const {uploadS3} = require('../middleware/multer')
const {S3Client, ListObjectsV2Command, DeleteObjectCommand, GetObjectCommand, PutObjectCommand}=require('@aws-sdk/client-s3');
const {Upload}=require('@aws-sdk/lib-storage');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const {v4 : uuidv4} = require('uuid');
const path = require('path')
require('dotenv').config();

const s3Client=new S3Client({
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region:process.env.AWS_REGION
});

const s3PinUpload = async (file, folder) => {
    let unique = uuidv4();
    const params = {
        Bucket: process.env.AWS_S3_UPLOAD_BUCKET,
        Key:`${folder}/${unique}${path.extname(file.originalname)}`,
        Body:file.buffer,
        ContentType:file.mimetype,
    }
    await s3Client.send(new PutObjectCommand(params))
    const url = `https://${process.env.AWS_S3_UPLOAD_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    return url;
}

module.exports = {
    s3PinUpload,
}