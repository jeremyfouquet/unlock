const express = require('express');
const {restart} = require('nodemon');
const path = require('path');
const cors = require('./middlewares/cors');
const mongoose = require('mongoose');


const app = express();

const errorroutes = require('./routes/error')
const usersroutes = require('./routes/users')
const standartroutes = require('./routes/standart')

mongoose.connect('', //Secret URI
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app
    //Traitement du corp et de l'URL de la requête
    .use(express.urlencoded())
    .use(express.json())
    //Traitement des erreurs CORS
    .use(cors)
    //Traitement des dependances
    .use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
    .use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
    .use('/popper.js', express.static(path.join(__dirname, 'node_modules/popper.js/dist')))
    .use('/bootstrap/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
    .use(express.static('public'))
    //Application des routes
    .use('/', standartroutes)
    .use('/api/users', usersroutes)
    .use('*', errorroutes);

module.exports = app;
