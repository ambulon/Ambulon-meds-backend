const express = require('express');
const toJson = require('body-parser').json;
const helmet = require('helmet');
const mongoose = require('mongoose');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');

const port = process.env.PORT || 3000;
const mongoURI = require('./util/config').mongoURI;

const app = express();

app.use(helmet());

app.use(toJson());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(authRoute);

app.use('/user', userRoute);

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
