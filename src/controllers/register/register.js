const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
require("dotenv").config();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { hashData } = require("../../util/hashData");
const E_HOST = process.env.MAILHOST;
const E_PORT = process.env.MAILPORT;

const register = async (req, res) => {
    try {
        const { password, email, ...restData } = req.body;

        const emailVerify = await User.findOne({ email })

        if (emailVerify) {
            res.status(400).json({message: 'este email ya existe'});
        } else {
            const hashedPass = await hashData(password)

            restData.password = hashedPass
            restData.email = email

            await User.create(restData);

            res.status(200).json({ message: 'creado con exito' });
        }





    } catch (error) {
        res.status(400).send(error.message)
    }



    // Envío del correo electrónico de confirmación
    /*
    const emailConfirmation = async (data) => {
        const transport = nodemailer.createTransport({
            host: E_HOST,
            port: E_PORT,
            auth: {
                user: E_USER,
                pass: E_PASSWORD,
            },
        });
        const { username, email, token } = data;
        await transport.sendMail({
            from: "fisiumfulness",
            to: email,
            subject: "Confirm account",
            text: "Confirm account",
            html: `
        <p> Hi! ${username}, confirm account in Fisium Fulness </p>
        <p> Confirm your account in the link :
        <a href="http://localhost:5173/confirm/${token}"> Confirm Account </a></p>
        <p> If you didn't create the account, ignore it</p>`,
        });
    };

    emailConfirmation({
        username: newUser.username,
        email: newUser.email,
        token: newUser.token,
    });)*/
};

module.exports = { register }