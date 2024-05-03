const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes/index');
const cookieParser = require('cookie-parser');
const { optionCors } = require('./config/corsConfig');
const { errorHandler } = require('./util/errorHandler');
const compression = require('compression');

const app = express();

app.use(express.json());
app.use(cors(optionCors));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(compression());

app.use('/', routes);

app.use(errorHandler);

module.exports = { app };
