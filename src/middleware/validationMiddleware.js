const { BadRequestError } = require('../util/errors');
const { ZodError } = require('zod');
const fs = require('node:fs/promises');

// * Working with Zod and also async validations for database checks for example.
// ? Mode = post (all fields validation) /update (specific-sended)... 
const validationMiddleware = (schema, mode="post") => {
  return async (req, res, next) => {
    const file = req.file || null;
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
      if (file) await fs.unlink(file.path); // ? If a file [multer] exists, delete it on error
      if (error instanceof ZodError) {
        const issue = error.issues[0];
        const path = issue.path.join('.');
        errorToHandle = new BadRequestError(`${path} => ${issue.message}`);
      }
      next(errorToHandle); // * sends any error to work errorMiddleware
    }
  };
};

module.exports = { validationMiddleware };
