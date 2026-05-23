const express = require('express');
const websiteRoutes = require('./routes/routes');

const allRoutes = express.Router();

allRoutes.use('/user', websiteRoutes);

module.exports = allRoutes