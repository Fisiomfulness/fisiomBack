const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require("./routes/index")

const bodyParser = require('body-parser');
const { optionCors } = require('./config/corsConfig');

const app = express();

app.use(express.json());
app.use(cors(optionCors));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/', routes);
require('./db');
module.exports = { app };
