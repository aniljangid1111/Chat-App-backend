const express = require('express')
var cors = require('cors')
require('dotenv').config()
const allRoutes = require('./src/app.js')
require('./src/config/db.js')

const app = express()
const PORT = process.env.PORT;
app.use(express.urlencoded())
app.use(express.json())
app.use(cors())

app.use('/uploads', express.static('uploads'));


app.use('/api', allRoutes)


app.listen(PORT, (() => {
    console.log(`server Start on PORT ${PORT}`)
}))