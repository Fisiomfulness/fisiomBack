const { getProfessionals } = require('./getProfessionals');
const { createProfessional } = require('./createProfessional');
const { getProfessionalDetail } = require('./getProfessionalDetail');
const { statusProfessional } = require('./statusProfessional');
const { updateProfessional } = require('./updateProfessional');
const { deleteProfessional } = require('./deleteProfessional');
const { getProfessionalRating } = require('./getProfessionalRating');
const { createProfessionalRating } = require('./createProfessionalRating');
const { deleteProfessionalRating } = require('./deleteProfessionalRating');
const { checkUserRating } = require('./checkUserRating');
const { addSpecialty } = require('./addSpecialty');
const { removeSpecialty } = require('./removeSpecialty');
const { approveProfessional } = require('./approveProfessional');
const { getPendingProfessionals } = require('./getPendingProfessionals');
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
  getProfessionalRating,
  createProfessionalRating,
  deleteProfessionalRating,

  checkUserRating,
  addSpecialty,
  removeSpecialty,
  addExperience,
  updateExperience,
  deleteExperience,
  approveProfessional,
  getPendingProfessionals,
};
