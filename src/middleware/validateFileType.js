const fs = require('fs');
const { deleteLocalFile } = require('#src/services/cloudinaryService');
const { BadRequestError } = require('#src/util/errors');

const ACCEPTED_APP_TYPES = ['image', 'pdf'];

// ? Valida de manera segura un archivo leyendo el buffer del mismo
// ? Por ahora solo se aceptan imágenes y el curriculum en pdf
// ? Si se quiere agregar mas soporte este middleware utiliza el paquete "file-type" con sus compatibilidades.
const validateFileType = (expectedType) => {
  return async (req, res, next) => {
    const hasFile = !!req.file;
    
    if (!hasFile) {
      return next();
    }

    try {
      if (!ACCEPTED_APP_TYPES.includes(expectedType)) {
        throw new Error(`validateFileType: expected string parameter, one of -> ${ACCEPTED_APP_TYPES.join(', ')}`);
      }

      // * La librería solo funciona con ESM asi que se realiza un import dinámico
      const { fileTypeFromBuffer } = await import('file-type');
      const buffer = fs.readFileSync(req.file.path);
      const fileType = await fileTypeFromBuffer(buffer);

      if (!fileType) throw new BadRequestError('No se pudo determinar el tipo de archivo');

      if (expectedType === 'image' && !fileType.mime.startsWith('image/')) {
        throw new BadRequestError('El archivo enviado no es una imagen');
      }

      if (expectedType === 'pdf' && fileType.mime !== 'application/pdf') {
        throw new BadRequestError('El archivo enviado no es un PDF');
      }

      next();
    } catch (err) {
      if (hasFile) await deleteLocalFile(req.file.filename);
      next(err);
    }
  };
};

module.exports = { validateFileType };
