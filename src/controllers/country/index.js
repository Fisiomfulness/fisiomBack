const CountryCode = require('../../models/Country');

const americanCountries = [
  { code: 'AR', name: 'Argentina', number: '+54' },
  { code: 'BO', name: 'Bolivia', number: '+591' },
  { code: 'BR', name: 'Brazil', number: '+55' },
  { code: 'CA', name: 'Canada', number: '+1' },
  { code: 'CL', name: 'Chile', number: '+56' },
  { code: 'CO', name: 'Colombia', number: '+57' },
  { code: 'CR', name: 'Costa Rica', number: '+506' },
  { code: 'DO', name: 'Dominican Republic', number: '+1' },
  { code: 'EC', name: 'Ecuador', number: '+593' },
  { code: 'SV', name: 'El Salvador', number: '+503' },
  { code: 'GT', name: 'Guatemala', number: '+502' },
  { code: 'HN', name: 'Honduras', number: '+504' },
  { code: 'MX', name: 'Mexico', number: '+52' },
  { code: 'PY', name: 'Paraguay', number: '+595' },
  { code: 'PE', name: 'Peru', number: '+51' },
  { code: 'PR', name: 'Puerto Rico', number: '+1' },
  { code: 'US', name: 'United States', number: '+1' },
  { code: 'UY', name: 'Uruguay', number: '+598' },
  { code: 'VE', name: 'Venezuela', number: '+58' },
];

const populateCountryCodes = async (req, res) => {
  try {
    await CountryCode.insertMany(americanCountries);
    console.log('Códigos de país agregados exitosamente.');
    const countries = await CountryCode.find();
    res.status(200).json(countries);
  } catch (error) {
    console.error('Error al obtener los códigos de país:', error);
    res
      .status(500)
      .json({ error: 'Hubo un problema al obtener los códigos de país.' });
  }
};

const createCountryCode = async (req, res) => {
  const { code, name, number } = req.body;

  try {
    const existingCountry = await CountryCode.findOne({ code });
    if (existingCountry) {
      return res.status(400).json({ message: 'El código de país ya existe.' });
    }

    const newCountry = new CountryCode({ code, name });
    await newCountry.save();

    res.status(201).json({
      message: 'Código de país creado exitosamente.',
      country: newCountry,
    });
  } catch (error) {
    console.error('Error al crear el código de país:', error);
    res
      .status(500)
      .json({ error: 'Hubo un problema al crear el código de país.' });
  }
};

const editCountryCode = async (req, res) => {
  const { id } = req.params;
  const { code, name, number } = req.body;

  try {
    const updatedCountry = await CountryCode.findByIdAndUpdate(
      id,
      { code, name, number },
      { new: true, runValidators: true }
    );

    if (!updatedCountry) {
      return res.status(404).json({ message: 'Código de país no encontrado.' });
    }

    res.status(200).json({
      message: 'Código de país actualizado exitosamente.',
      country: updatedCountry,
    });
  } catch (error) {
    console.error('Error al editar el código de país:', error);
    res
      .status(500)
      .json({ error: 'Hubo un problema al editar el código de país.' });
  }
};

const deleteCountryCode = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCountry = await CountryCode.findByIdAndDelete(id);

    if (!deletedCountry) {
      return res.status(404).json({ message: 'Código de país no encontrado.' });
    }

    res.status(200).json({
      message: 'Código de país eliminado exitosamente.',
      country: deletedCountry,
    });
  } catch (error) {
    console.error('Error al eliminar el código de país:', error);
    res
      .status(500)
      .json({ error: 'Hubo un problema al eliminar el código de país.' });
  }
};

const getAllCountryCodes = async (req, res) => {
  try {
    const countries = await CountryCode.find();
    res.status(200).json(countries);
  } catch (error) {
    console.error('Error al obtener los códigos de país:', error);
    res
      .status(500)
      .json({ error: 'Hubo un problema al obtener los códigos de país.' });
  }
};

module.exports = {
  populateCountryCodes,
  createCountryCode,
  editCountryCode,
  deleteCountryCode,
  getAllCountryCodes,
};
