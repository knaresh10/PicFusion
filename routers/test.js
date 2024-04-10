const {Router} = require('express')
const multer = require('multer');
const path = require('path');
const {S3Client, ListObjectsV2Command, DeleteObjectCommand, GetObjectCommand}=require('@aws-sdk/client-s3');
const {Upload}=require('@aws-sdk/lib-storage');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

const router = Router();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const s3Client=new S3Client({
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region:'eu-north-1'
});

const Bucket = 'nodejs-training'

router.get("/formUpload", async (req, res) => {
    res.render('test');
})

router.get('/listFiles', async (req, res) => {
    const input = {
        Bucket
    }
    const command = new ListObjectsV2Command(input);
    const response = await s3Client.send(command);
    // console.log(response)
    let dataURL = [];

    for(let i = 0; i < response.Contents.length; i++) {
        const param = {
            Bucket,
            Key : response.Contents[i].Key
        }
        const url = await getSignedUrl(s3Client, new GetObjectCommand(param), {expiresIn : 3600})
        dataURL.push({Key : response.Contents[i].Key, url});
    }
    // response.Contents.forEach(async (content) =>  {
    //     const params = {
    //         Bucket,
    //         Key : content.Key
    //     }

    // });
    res.send(dataURL);
})


router.post('/upload', upload.single('file'), (req, res) => {
    if(!req.body.fName.trim()){
        res.send({
            success:false,
            error:'Invalid file name'
        })
    }
    if(!req.file||!req.file.buffer){
        res.send({
            success:false,
            error:'Invalid file'
        })
    }
    new Upload({
        client:s3Client,
        params:{
            Bucket:'nodejs-training',
            Key:`${req.body.fName}${path.extname(req.file.originalname)}`,
            Body:req.file.buffer,
            ContentType:req.file.mimetype,
        }
    })
    .done()
    .then(data=>{
        // res.send({
        //     success:true,
        //     ...data
        // });
        res.redirect('/test/formUpload')
    })
    .catch(err=>{
        res.send({
            success:false,
            ...err
        })
    })
})

router.delete('/deleteFile/:key', async (req, res) => {
    if(!req.params.key) {
        res.send({
            success : false,
            error : 'missing file'
        })
    }

    const input = {
        Bucket:'nodejs-training',
        Key : req.params.key
    }

    const command = new DeleteObjectCommand(input)
    const response = s3Client.send(command);
    res.send({ redirectURL : '/test/formUpload'})
})

module.exports = router;