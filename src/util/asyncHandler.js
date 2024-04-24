// * Using this handler we avoid try catch and next in every controller
const asyncHandler = (controller) => {
  return (req, res, next) => {
    controller(req, res, next).catch((error) => next(error));
  };
};

module.exports = { asyncHandler };
