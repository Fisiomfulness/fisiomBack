const { getProfessionals } = require('./getProfessionals');
const { createProfessional } = require('./createProfessional');
const { getProfessionalDetail } = require('./getProfessionalDetail');
const { statusProfessional } = require('./statusProfessional');
const { updateProfessional } = require('./updateProfessional');
const { deleteProfessional } = require('./deleteProfessional');


module.exports = {
  getProfessionals,
  getProfessionalDetail,
  createProfessional,
  statusProfessional,
  updateProfessional,
  deleteProfessional,
};