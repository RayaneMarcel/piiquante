const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const dotenv = require("dotenv").config();
const helmet = require('helmet');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const app = express();

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// connect to mongodb
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.apwibmo.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connecttion to MongoDB successful !'))
  .catch(() => console.log('Connecttion to MongoDB failed !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;

