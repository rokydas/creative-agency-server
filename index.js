const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
require('dotenv').config()

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.send('Hello I am your new node js project');
})
app.listen(5000); 