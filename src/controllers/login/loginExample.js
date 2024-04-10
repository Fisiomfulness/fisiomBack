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
    res.header("Access-Control-Allow-Origin", "*");
    try {
        const { name, email, password, role, specialties, curriculum, phone, address, license } = req.body;

        const emailVerify = await User.findOne({email})

        console.log(emailVerify);

        if(emailVerify){
            res.status(400).send("este email ya existe")
        }

        else if (role === 'user') {
            const hashedPass = await hashData(password)

            await User.create({
                name,
                email,
                password: hashedPass,
                specialties,
                curriculum,
                phone,
                address,
                license
            });
            
            res.status(200).send("creado");
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