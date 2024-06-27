const { getProfessionals } = require('./getProfessionals');
const { createProfessional } = require('./createProfessional');
const { getProfessionalDetail } = require('./getProfessionalDetail');
const { statusProfessional } = require('./statusProfessional');
const { updateProfessional } = require('./updateProfessional');
const { deleteProfessional } = require('./deleteProfessional');
const { createProfessionalScore } = require('./createProfessionalScore');
const { getProfessionalScore } = require('./getProfessionalScore');
const { addSpecialty } = require('./addSpecialty');
const { removeSpecialty } = require('./removeSpecialty');
const {
  addExperience,
  updateExperience,
  deleteExperience,
} = require('./experienceController');

module.exports = {
  getProfessionals,
  getProfessionalDetail,
  createProfessional,
  statusProfessional,
  updateProfessional,
  deleteProfessional,
  createProfessionalScore,
  getProfessionalScore,
  addSpecialty,
  removeSpecialty,
  addExperience,
  updateExperience,
  deleteExperience,
};
