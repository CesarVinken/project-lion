const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

function upload(path) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(path, function(result) {
      resolve(result);
    });
  });
}

module.exports = {
  upload
};
