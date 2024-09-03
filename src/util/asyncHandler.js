// * Usando este handler y el manejo de errores personalizado, se evita el try - catch - next(error) en cada controlador
// ? USO -> En el enrutador... asyncHandler(controller);
// * IMPORTANTE -> Se agrego libreria 'express-promise-router'
// ? USO -> const Router = require('express-promise-router').default;
// * Mejora la legibilidad, pero cualquiera de los dos funciona igual.
const asyncHandler = (controller) => {
  return (req, res, next) => {
    controller(req, res, next).catch((error) => next(error));
  };
};

module.exports = { asyncHandler };
