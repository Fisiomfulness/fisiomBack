const addressSchema = require('./addressSchema');
const userSchema = require('./userSchema');
const professionalSchema = require('./professionalSchema');
const experienceSchema = require('./experienceSchema');
const { blogSchema, commentSchema } = require('./blogSchemas');
const { questionSchema, questionResponseSchema } = require('./questionSchemas');

module.exports = {
  addressSchema,
  userSchema,
  professionalSchema,
  experienceSchema,
  blogSchema,
  commentSchema,
  questionSchema,
  questionResponseSchema,
};
