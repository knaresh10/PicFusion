const fs = require('fs');

const GetFileStream =  async (file) => {
    try {
        let fileStream = await fs.createReadStream(file.path);
        console.log('stream finished');
        return fileStream
    } catch (error) {
        console.log('Streaming file error', error);
        throw error;
    }
}

module.exports = {
    GetFileStream,
}