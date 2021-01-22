const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const compression = require('compression');
const db = require('../database/setUp/index');
const config = require('../config/appConfig');
const helmet = require('helmet');

// initiate a server connection
const app = express();

// server setups
app.set('config',config);
// app.set('port',process.env.DEV-APP-PORT);
app.set('db',db);

// protection middleware
app.use(helmet());

// middlewares
app.use(require('method-override')())
app.use(cors());
app.use(bodyParser.json());
app.use(compression());


// routers
app.use(require('./router'))