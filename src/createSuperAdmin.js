const User = require('./models/user/User');
const bcrypt = require('bcryptjs');

async function createSuperAdmin() {
  const superAdminExists = await User.findOne({ role: 'super_admin' });

  if (!superAdminExists) {
    const hashedPassword = await bcrypt.hash('Password', 10); // Cambiar la contraseña y que se ubique en el .env?
    const superAdmin = new User({
      email: 'superadmin@example.com', // cambiar
      name: 'Super Admin', //cambiar
      password: hashedPassword,
      birthDate: '2000-01-01', //cambiar
      role: 'super_admin',
      gender: 'Prefiero no responder', //cambiar
      confirmEmail: true,
      address: {
        streetName: 'Calle', //cambiar
        streetNumber: '123', //cambiar
        floorAppartment: '1A', //cambiar
        city: 'Lima', //cambiar
        state: 'Lima', //cambiar
        country: 'Peru', //cambiar
      },
    });

    await superAdmin.save();
    console.log('Superadmin creado exitosamente');
  } else {
    console.log('El superadmin ya existe.');
  }
}

module.exports = { createSuperAdmin };
