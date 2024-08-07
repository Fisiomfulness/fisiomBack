const userSchema = require('./userSchema');
const addressSchema = require('./addressSchema');
const experienceSchema = require('./experienceSchema');
const serviceSchema = require('./serviceSchema');
const { professionalSchema, professionalRatingSchema } = require('./professionalSchema');
const { blogSchema, commentSchema } = require('./blogSchemas');
const { questionSchema, questionResponseSchema } = require('./questionSchemas');

module.exports = {
  addressSchema,
  userSchema,
  professionalSchema,
  professionalRatingSchema,
  experienceSchema,
  serviceSchema,
  blogSchema,
  commentSchema,
  questionSchema,
  questionResponseSchema,
};
