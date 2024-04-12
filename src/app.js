const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require("./routes/index")
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
const { optionCors } = require('./config/corsConfig');

const app = express();

app.use(express.json());
app.use(cors(optionCors));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*") // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    next()
  })

app.use('/', routes);

require('./db');

module.exports = { app };
