const pLimit = require("p-limit")
const uploadToCloudinary = require("../utils/uploadToCloudinary")



const multiapleUploads = async(req,res,next)=>{

    
       if (!req.files.length) {
      return res.status(400).json({
         "errors": [
        {
            "type": "field",
            "msg": "imgs field required",
            "path": "imgs",
            "location": "body"
        }
    ]
      })
    }

        const files = req.files;

        const limit = pLimit(10);
        const imgaesToUpload =   files.map(img=>{
            return limit(async ()=>{
                try {
                    const result  = await uploadToCloudinary(img.buffer);
                return {
                    publicId:result.public_id,
                    url:result.url
                }
                } catch (error) {
                    next(error)
                }
                }
            )
        })
       
        const imgs = await Promise.all(imgaesToUpload);

        
        

        req.body.imgs=imgs;
         
         next();
      
}

module.exports = multiapleUploads