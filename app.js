const express = require('express');
const path = require('path');
const cors = require('./middlewares/cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

require('dotenv').config()
const app = express();

const errorroutes = require('./routes/error')
const usersroutes = require('./routes/users')
const standartroutes = require('./routes/standart')


mongoose.connect(process.env.MONGO_URI, //Secret URI from .env
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app
    //Traitement du corp et de l'URL de la requête
    .use(express.urlencoded())
    .use(express.json())
    .use(cookieParser())
    //Traitement des erreurs CORS
    .use(cors)
    //Traitement des dependances
    .use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
    .use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
    .use('/popper.js', express.static(path.join(__dirname, 'node_modules/popper.js/dist')))
    .use('/bootstrap/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
    .use(express.static('public'))
    //Application des routes
    .use('/api/users', usersroutes)
    .use('/', standartroutes)
    .use('*', errorroutes);

module.exports = app;
