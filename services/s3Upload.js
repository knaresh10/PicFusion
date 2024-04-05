const {uploadS3} = require('../middleware/multer')
const {S3Client, ListObjectsV2Command, DeleteObjectCommand, GetObjectCommand}=require('@aws-sdk/client-s3');
const {Upload}=require('@aws-sdk/lib-storage');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

const s3Client=new S3Client({
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region:process.env.AWS_REGION
});

const s3PinUpload = (fileStream, file) => {
    new Upload({
        client:s3Client,
        params:{
            Bucket: process.env.AWS_S3_UPLOAD_BUCKET,
            Key:`${file.filename}`,
            Body:fileStream,
            ContentType:file.mimetype,
        }
    })
    .done()
    .then(data=>{
        return data;
    })
    .catch(err=>{
        return err;
    })
}

module.exports = {
    s3PinUpload,
}