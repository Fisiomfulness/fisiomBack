const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

const { cloud_name, api_key, api_secret } = process.env;
const cloudinaryCredentials = { cloud_name, api_key, api_secret };
cloudinary.config(cloudinaryCredentials);

const FOLDER_PRODUCTS = 'FisiumFulness/products';
const FOLDER_BLOGS = 'FisiumFulness/blogs';
const FOLDER_USERS = 'FisiumFulness/users';

const uploadOptions = {
  resource_type: 'image',
  use_filename: true,
  unique_filename: false,
  overwrite: true,
};

const productsUploadOptions = {
  ...uploadOptions,
  tags: ['product'],
  folder: FOLDER_PRODUCTS,
};

const blogsUploadOptions = {
  ...uploadOptions,
  tags: ['blog'],
  folder: FOLDER_BLOGS,
};

const userUploadOptions = {
  ...uploadOptions,
  tags: ['user'],
  folder: FOLDER_USERS,
};

module.exports = {
  cloudinary,
  cloudinaryCredentials,
  productsUploadOptions,
  blogsUploadOptions,
  userUploadOptions,
};
