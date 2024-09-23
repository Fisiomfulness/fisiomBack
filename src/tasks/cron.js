const cron = require("node-cron");
const moment = require("moment");
const User = require("../models/user/User");
const Professional = require("../models/profesional/Profesional");

// Programar una tarea que se ejecute diariamente a medianoche
cron.schedule("0 0 * * *", async () => {
  try {
    const now = moment().toDate();

    // Buscar usuarios cuya suspensión haya caducado
    const usersUpdated = await User.updateMany(
      { suspended: true, suspensionEndDate: { $lte: now } },
      { suspended: false }
    );

    const professionalsUpdated = await Professional.updateMany(
      { suspended: true, suspensionEndDate: { $lte: now } },
      { suspended: false }
    );

    console.log(`${usersUpdated.modifiedCount} users were unsuspended`);
    console.log(
      `${professionalsUpdated.modifiedCount} professionals were unsuspended`
    );
  } catch (error) {
    console.error("Error updating suspended users:", error);
  }
});
