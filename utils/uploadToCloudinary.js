const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (fileBuffer,fileName) => {

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      (error, result) => {
        if (error) reject(error);
        else {
            const url = cloudinary.url(result.public_id,{
                transformation:[
                    {
                        fetch_format:'auto'
                    }
                ]   
            })
            result.url=url;
            resolve(result);
        }
      }
    );

    
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = uploadToCloudinary;