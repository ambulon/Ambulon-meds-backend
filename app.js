const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const multer = require('multer');

const authRoute = require('./routes/auth');

const port = process.env.PORT || 3000;
const mongoURI = require('./util/config').mongoURI;

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/user/images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + ' ' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};

app.use(helmet());

app.use(bodyParser.json());

// app.use(multer({ storage: fileStorage, fileFilter }).single('user_photo'))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(authRoute);

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    res.status(statusCode).json({
        message: error.message
    });
});

app.use((req, res, next) => {
    res.status(404).json({
        message: 'invalid route'
    });
});

mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        app.listen(port);
        console.log(`Server running at port ${port}`)
    })
    .catch(err => {
        console.log(err);
    });
