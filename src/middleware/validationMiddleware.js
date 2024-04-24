const { BadRequestError } = require('../util/errors');
const { ZodError } = require('zod');

// * Working with Zod and also async validations for database checks for example.
// ? Mode = post (all fields validation) /update (specific-sended)... 
const validationMiddleware = (schema, mode="post") => {
  return async (req, res, next) => {
    try {
      if (mode !== 'post' && mode !== 'update') {
        throw new Error(`validationMiddleware: mode must be either 'post' or 'update'`);
      }
      // *? Custom property with safe values to use in post controller if you want 
      // * However, the original req.body would also work.
      const schemaToValidate = mode === 'post' ? schema : schema.partial();
      req.validatedBody = await schemaToValidate.parseAsync(req.body);
      next();
    } catch (error) {
      let errorToHandle = error;
      if (error instanceof ZodError) {
        const issue = error.issues[0];
        errorToHandle = new BadRequestError(`${issue.path[0]} => ${issue.message}`);
      }
      next(errorToHandle); // * sends any error to work errorMiddleware
    }
  };
};

module.exports = { validationMiddleware };
