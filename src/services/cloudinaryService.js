const fs = require('node:fs/promises');
const path = require('path');

// Asegura que la carpeta uploads existe
const ensureUploadsFolderExists = async () => {
  const uploadDir = path.join(__dirname, 'uploads');
  try {
    await fs.mkdir(uploadDir, { recursive: true });
    console.log('La carpeta uploads existe o ha sido creada.');
  } catch (error) {
    console.error('Error al crear la carpeta uploads:', error);
  }
};

// Subir imagen localmente
const uploadImage = async (file) => {
  await ensureUploadsFolderExists();  // Asegurarse de que la carpeta uploads exista

  const uploadPath = path.join(__dirname, 'uploads', file.filename);  // Ruta para guardar el archivo

  try {
    // Guardar el archivo en la carpeta uploads
    await fs.writeFile(uploadPath, await fs.readFile(file.path));
    console.log(`Imagen guardada localmente en ${uploadPath}`);

    // Retorna la ruta local donde se guardó el archivo
    return { filePath: uploadPath };
  } catch (error) {
    console.error('Error al guardar la imagen localmente:', error);
    throw error;
  }
};

// Eliminar archivo local
const deleteLocalFile = async (filename) => {
  const filePath = path.join(__dirname, 'uploads', filename);
  try {
    await fs.unlink(filePath);
    console.log(`Archivo ${filename} eliminado de forma local.`);
  } catch (error) {
    console.error('Error al eliminar el archivo local:', error);
  }
};

module.exports = {
  uploadImage,
  deleteLocalFile,
};
