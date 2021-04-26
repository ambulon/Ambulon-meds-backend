const { spawn } = require('child_process');

const express = require('express');
const toJson = require('body-parser').json;
const helmet = require('helmet');
const mongoose = require('mongoose');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');

const port = process.env.PORT || 3000;
const mongoURI = require('./util/config').mongoURI;

const app = express();

const getPrices = (req, res, next) => {
    const name = req.query.name;
    const process = spawn('python', ['./scrapers/netmeds.py', name]);
    let price;
    process.stdout.on('data', data => {
        price = data.toString();
    });
    process.on('close', code => {
        if (code !== 0) {
            price = -1;
        }
        else {
            price = price.slice(0, 5);
            price = parseFloat(price);
        }
        res.json({
            site: "netmeds",
            price
        });
    });
};

app.use(helmet());

app.use(toJson());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(authRoute);

app.get('/scrape', getPrices);

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
