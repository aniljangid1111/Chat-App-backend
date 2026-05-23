const express = require('express');
const authRoute = require('./webSite/auth.routes');
const userRouter = require('./webSite/user.routes')
const chatRouter = require('./webSite/chat.routes')
const websiteRoutes = express.Router();


websiteRoutes.use('/auth', authRoute);
websiteRoutes.use('/', userRouter);
websiteRoutes.use('/chat',chatRouter );

module.exports = websiteRoutes