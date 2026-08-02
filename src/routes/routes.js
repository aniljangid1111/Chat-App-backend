const express = require('express');
const authRoute = require('./webSite/auth.routes');
const userRouter = require('./webSite/user.routes')
const chatRouter = require('./webSite/chat.routes')
const messageRouter = require('./webSite/message.routes')
const notificationRouter = require('./webSite/notification.routes.js')
const websiteRoutes = express.Router();


websiteRoutes.use('/auth', authRoute);
websiteRoutes.use('/', userRouter);
websiteRoutes.use('/chat', chatRouter);
websiteRoutes.use('/message', messageRouter);
websiteRoutes.use('/notification', notificationRouter);

module.exports = websiteRoutes