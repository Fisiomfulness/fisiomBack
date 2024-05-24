const addressSchema = require('./addressSchema');
const userSchema = require('./userSchema');
const professionalSchema = require('./professionalSchema');
const { blogSchema, commentSchema } = require('./blogSchemas');
const { questionSchema, questionResponseSchema } = require('./questionSchemas');

module.exports = {
  addressSchema,
  userSchema,
  professionalSchema,
  blogSchema,
  commentSchema,
  questionSchema,
  questionResponseSchema,
};
