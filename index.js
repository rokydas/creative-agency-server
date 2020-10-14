const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const name = process.env.DB_NAME;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${user}:${pass}@cluster0.vetwi.mongodb.net/${name}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db(name).collection('service');
    
});


app.get('/', (req, res) => {
    res.send('Hello I am your new node js project');
})

app.listen(5000); 