const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

require('dotenv').config();

const mainRouter = require('./routers/main');
const authRouter = require('./routers/auth');
const profileRouter = require('./routers/profile');
const pinRouter = require('./routers/pin');
const boardRouter = require('./routers/board');
const testRouter = require('./routers/test');

const app = express();

const PORT = process.env.PORT;
const URL = process.env.DB_URL;

app.set("view engine", "ejs");
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.json())
app.use(bodyParser.json());

// middlewares
app.use(session({
    secret : process.env.SESSION_SECRET_KEY,
    resave : false,
    saveUninitialized : true
}))

// testing
app.use('/test', testRouter);

// routers
app.use('/', mainRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/pin', pinRouter);
app.use('/board', boardRouter);

// connections
mongoose.connect(URL)
.then(() => {
    app.listen(PORT, () => {
        console.log(`The server is running on port http://localhost:${PORT}`)
    })
    console.log('mongodb connected')
});




