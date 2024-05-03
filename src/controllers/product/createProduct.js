const fs = require('node:fs/promises');
const Product = require('../../models/Product');
const {
  cloudinary,
  productsUploadOptions,
} = require('../../config/cloudinaryConfig.js');

const createProduct = async (req, res) => {
  const { name, price, stock, category, description } = req.body;
  try {
    //Esto viene gracias al middleware upload.
    const newImage = req.file.path;
    const nameImageDelete = req.file.filename;
    //Sube a cloudinary y retorna el url de la imágen, que luego es asignado al producto.
    const { public_id, url } = await cloudinary.uploader.upload(
      newImage,
      productsUploadOptions,
    );
    const newProduct = {
      name,
      price,
      stock,
      category,
      description,
      image: url,
      id_image: public_id,
    };

    //*Si es necesario, cambiar la palabra "FisiomBack" por el nombre de la carpeta contenedora del backend. De otra forma, no funcionará.
    //En esta parte, se elimina la imagen guardada en la carpeta uploads. La misma solo se guarda para hacer la subida a cloudinary, luego se borra de la carpeta.
    const routeImageDelete = `../FisiomBack/uploads/${nameImageDelete}`;
    await fs.unlink(routeImageDelete);

    const product = new Product(newProduct);
    await product.save();

    return res.status(200).json({ message: 'Producto creado con éxito.' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
};
