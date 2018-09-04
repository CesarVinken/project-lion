const cloudinary = require("cloudinary");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const picUpload = (files, type) => {
  console.log(files);
  return files == undefined
    ? new Promise((resolve, reject) => {
        const { picture } = files;
        const path = `public/images/${picture.name}`;

        picture.mv(path, function(err) {
          if (err) return next(err);
          upload(path).then(result => {
            fs.unlinkSync(path);
            name = result.secure_url;
            resolve(name);
          });
        });
      })
    : Promise.resolve("public/images/placeholder" + type + ".png");
};

function upload(path) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(path, function(result) {
      resolve(result);
    });
  });
}

module.exports = {
  upload,
  picUpload
};
