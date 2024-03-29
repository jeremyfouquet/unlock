/****************************************************************************
  Nom ......... : server.js
  Rôle ........ : Fichier responsable de la création et de la gestion du serveur HTTP, définition du port d'écoute et gestion des erreurs.
  Auteurs ..... : Jeremy Fouquet, Thibaut Decressonniere
  Version ..... : V1.0 du 28/04/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/

/**
 * @module server
 * @description Fichier responsable de la création et de la gestion du serveur HTTP, définition du port d'écoute et gestion des erreurs.
 * @author Jeremy Fouquet, Thibaut Decressonniere
 * @requires http
 * @requires dotenv
 * @requires socketio
 * @requires ./app
 */

const http = require('http');
const app = require('./app');
require('dotenv').config();

/**
 * Normalise le port en base 10
 * @name normalizePort 
 * @param {String} val : valeur entrée par l'utilisateur, le .env ou la valeur par défaut
 * @function
 */
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Gestionnaire d'erreurs
 * @name errorHandler
 * @param {Object} error : l'erreur levée
 * @function
 * @throws {EACCES} si l'utilisateur n'a pas les droits d'accès
 * @throws {EADDRINUSE} si le port est déjà utilisé
 */
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);

server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

const io = require('socket.io')(server, {
  cors: {origin : '*'}
});
// initialize socket module and pass it the io instance
require('./socket')(io);

server.listen(port);

module.exports = server;
