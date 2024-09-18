const { cloudinary } = require('../../config/cloudinaryConfig');
const User = require('../../models/user/User');
const Comment = require('../../models/blog/Comment');
const { sendEmailNodemailer } = require('#src/util/nodemailer');


const deleteUser = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  

  try {
    return res.status(200).json({ message: 'User has been deleted' });
    
    
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  deleteUser,
};

// if (id === '64c2d44f61cc7d6cec9d2abb') throw new Error('Dont remove admin');
// const user = await User.findByIdAndDelete(id);
// if (!user) throw new Error('the user does not exist');
// await cloudinary.uploader.destroy(user.id_image);
// await Comment.deleteMany({ user_id: id });

// sendEmailNodemailer({
//   to: 'jhonndiaz58@gmail.com',
//   subject: 'Eliminación de cuenta - Fisiom Fulness',
//   html: `
//   <p> Hola! jhonn, confirma la eliminación de tu cuenta de Fisiom Fulness</p>
//   <p> Has click en este enlace para eliminar tu cuenta:
//   <p> Si tu no hiciste esta petición, ignora este mensaje.</p>`,
// });
// <a href=${} target="_blank"> Eliminar mi cuenta...</a></p>
