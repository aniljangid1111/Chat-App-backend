const mongoose = require('mongoose')

// url = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBCLUSTER}.${process.env.DBCODE}.mongodb.net/${process.env.DBNAME}?appName=${process.env.DBCLUSTER}`

const url = "mongodb://127.0.0.1:27017/chat_app";

mongoose.connect(url)
    .then(() => {
        console.log('Mongoos connected');
    })
    .catch((err) => {
        console.log(err.message);
    }) 