const multer = require('multer');

const FOLDER_UPLOADS = 'uploads';

const generatorNameImage = (file) => `${Date.now()}-${file.originalname}`;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, FOLDER_UPLOADS),
  filename: (_req, file, cb) => cb(null, generatorNameImage(file)),
});
const upload = multer({ storage });

module.exports = {
  upload: upload.single('myFile'),
};
