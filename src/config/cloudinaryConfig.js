const cloudinary = require('cloudinary').v2;
const {
  CLOUDINARY_NAME,
  CLOUDINARY_KEY,
  CLOUDINARY_SECRET,
} = require('./envConfig');

const cloudinaryCredentials = {
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
};
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

const curriculumUploadOptions = {
  ...uploadOptions,
  tags: ['curriculum'],
  folder: FOLDER_USERS,
};

module.exports = {
  cloudinary,
  cloudinaryCredentials,
  productsUploadOptions,
  blogsUploadOptions,
  userUploadOptions,
  curriculumUploadOptions,
};
