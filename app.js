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
    const obj = [];
    let price;
    const process1 = spawn('python', ['./scrapers/netmeds.py', name]);
    process1.stdout.on('data', data => {
        price = data.toString();
    });
    process1.on('close', code => {
        if (code !== 0) {
            price = -1;
        }
        else {
            price = price.slice(0, 5);
            price = parseFloat(price);
        }
        obj.push({ site: 'www.netmeds.com', price });
        const process2 = spawn('python', ['./scrapers/1mg.py', name]);
        process2.stdout.on('data', data => {
            price = data.toString();
        });
        process2.on('close', code => {
            if (code !== 0) {
                price = -1;
            }
            else {
                price = price.slice(0, 5);
                price = parseFloat(price);
            }
            obj.push({ site: 'www.1mg.com', price });
            const process3 = spawn('python', ['./scrapers/1mg.py', name]);
            process3.stdout.on('data', data => {
                price = data.toString();
            });
            process3.on('close', code => {
                if (code !== 0) {
                    price = -1;
                }
                else {
                    price = price.slice(0, 5);
                    price = parseFloat(price);
                }
                obj.push({ site: 'www.apollopharmacy.in', price });
                res.json({
                    priceList: obj
                });
            });
        });
    });
};


const test = (req, res, next) => {
    const name = req.query.name;
    let price;
    const process1 = spawn('python', ['./test.py', name]);
    process1.stdout.on('data', data => {
        price = data.toString();
    });
    process1.on('close', code => {
        if (code !== 0) {
            price = -1;
        }
        else {
            price = price.slice(0, 5);
            price = parseFloat(price);
        }
        res.json({ code, price });
    });
};

const test1 = (req, res, next) => {
    const name = req.query.name;
    let price;
    const process1 = spawn('python', ['./scrapers/1mg.py', name]);
    process1.stdout.on('data', data => {
        price = data.toString();
    });
    process1.on('close', code => {
        if (code !== 0) {
            price = -1;
        }
        else {
            price = price.slice(0, 5);
            price = parseFloat(price);
        }
        res.json({ code, price });
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

app.get('/test', test);
app.get('/test1', test1);

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
