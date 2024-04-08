const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
require("dotenv").config();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const E_HOST = process.env.MAILHOST;
const E_PORT = process.env.MAILPORT;
// exports.login = async (req, res) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   const { email, password, username } = req.body;

//   if (!username || username.trim() === "") {
//     return res.status(400).json({ error: "Username is required" });
//   }

//   const newUser = new User({
//     username,
//     email,
//     password,
//   });

//   const salt = await bcrypt.genSalt(10);
//   newUser.password = await bcrypt.hashSync(newUser.password, salt);
//   await newUser.save();

//   // Envío del correo electrónico de confirmación
//   const emailConfirmation = async (data) => {
//     const transport = nodemailer.createTransport({
//       host: E_HOST,
//       port: E_PORT,
//       auth: {
//         user: E_USER,
//         pass: E_PASSWORD,
//       },
//     });
//     const { username, email, token } = data;
//     await transport.sendMail({
//       from: "fisiumfulness",
//       to: email,
//       subject: "Confirm account",
//       text: "Confirm account",
//       html: `
//         <p> Hi! ${username}, confirm account in Fisium Fulness </p>
//         <p> Confirm your account in the link :
//         <a href="http://localhost:5173/confirm/${token}"> Confirm Account </a></p>
//         <p> If you didn't create the account, ignore it</p>`,
//     });
//   };

//   emailConfirmation({
//     username: newUser.username,
//     email: newUser.email,
//     token: newUser.token,
//   });

//   res.status(200).send(newUser);
// };