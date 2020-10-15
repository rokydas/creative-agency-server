const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
const fileUpload = require('express-fileupload');
require('dotenv').config()

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('services'));
app.use(fileUpload());

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const name = process.env.DB_NAME;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${user}:${pass}@cluster0.vetwi.mongodb.net/${name}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db(name).collection('service');
    const adminCollection = client.db(name).collection('admin');
    const feedbackCollection = client.db(name).collection('feedback');
    const orderCollection = client.db(name).collection('order');

    app.get('/', (req, res) => {
        res.send('Hello I am your new node js project');
    })

    app.get('/services', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/admin', (req, res) => {
        adminCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/feedback', (req, res) => {
        feedbackCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addService', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const description = req.body.description;
        const filePath = `${__dirname}/services/${file.name}`;

        file.mv(filePath, err => {
            if (err) {
                return res.status(500).send('msg: Unable to Upload')
            }
            const newImg = fs.readFileSync(filePath);
            const encImg = newImg.toString('base64');

            const image = {
                contextType: req.files.file.mimetype,
                size: req.files.size,
                img: Buffer(encImg, 'base64')
            }

            serviceCollection.insertOne({ name, description, image })
                .then(result => {
                    fs.remove(filePath, err => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            res.send(result.insertedCount > 0)
                        }
                    });

                })

        })
    })

    app.post('/addFeedback', (req, res) => {
        const name = req.body.name;
        const description = req.body.description;
        const img = req.body.img;
        const designation = req.body.designation;

        feedbackCollection.insertOne({ name, designation, description, img })
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/addOrder', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const price = req.body.price;
        const productDetails = req.body.productDetails;
        const filePath = `${__dirname}/orders/${file.name}`;

        file.mv(filePath, err => {
            if (err) {
                return res.status(500).send('msg: Unable to Upload')
            }
            const newImg = fs.readFileSync(filePath);
            const encImg = newImg.toString('base64');

            const image = {
                contextType: req.files.file.mimetype,
                size: req.files.size,
                img: Buffer(encImg, 'base64')
            }

            console.log(name, email, price, productDetails, image);

            orderCollection.insertOne({ name, email, price, productDetails, image })
                .then(result => {
                    fs.remove(filePath, err => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log(result);
                            res.send(result.insertedCount > 0)
                        }
                    });

                })

        })
    })

});







app.listen(5000); 