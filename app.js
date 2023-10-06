const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()
const indexRouter = require('./routers/index.js');

const app = express();
mongoose.connect(process.env.MONGODB_URL);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/', indexRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('app listening on port ' + port));