const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { createTokenForUser } = require('../services/authentication');

const userSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique: true,
    },
    password : {
        type : String,
        required : true,
    },
});



userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
});


userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
    const user = await this.findOne({email});

    if(!user) throw new Error('user not found');

    const result = await bcrypt.compare(password, user.password);

    if(!result) throw new Error('password not matched');
    
    // generate a token
    return createTokenForUser(user);
})

const User = mongoose.model("user", userSchema);

module.exports = User;