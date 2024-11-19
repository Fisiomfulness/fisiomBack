const phoneRegExp = /^(\+\d{1,3})?\d{10,14}$/;
const nameRegex = /^[a-zA-Z\u00C0-\u00FF\s]*$/; // ? Only letters
const cityRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/;
const latamDniExp = /^\d{7,9}$/;
const streetNameRegex = /^[a-zA-Z0-9 ]+$/;
const alphaNumericRegex = /^[a-zA-Z0-9]*$/;
const numericRegex = /^[0-9]*$/;

module.exports = {
  phoneRegExp,
  nameRegex,
  cityRegex,
  latamDniExp,
  streetNameRegex,
  alphaNumericRegex,
  numericRegex,
};
