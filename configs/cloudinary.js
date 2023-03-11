const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dmrhenlws",
  api_key: "613668594541861",
  api_secret: "w_iDLwc5DYWt99zfh3xt_Ff6X90",
});

module.exports = cloudinary;
