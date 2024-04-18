const multer = require('multer');

const FOLDER_UPLOADS = 'uploads';

const generatorNameFile = (file) => `${Date.now()}-${file.originalname}`;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, FOLDER_UPLOADS),
  filename: (_req, file, cb) => cb(null, generatorNameFile(file)),
});

const upload = multer({ storage });

module.exports = {
  upload: upload.single('myFile'),
  uploadCurriculum: upload.single('curriculum'),
};
