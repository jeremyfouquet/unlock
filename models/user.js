/****************************************************************************
  Nom ......... : user.js
  Rôle ........ : Ficher contenant le modèle et methodes statique d'un utilisateur
  Auteurs ..... : Thibaut Decressonniere
  Version ..... : V1.0 du 24/04/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/**
 * Le model d'un utilisateur enregistré
 * @name userSchema 
 */
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  win: { type: Number, required: true},
  loose :{type: Number, required: true}
});

// Utilisation d'un plugin de validation d'unicité
userSchema.plugin(uniqueValidator);

/**
 * Methode statique permettant d'incrémenté la valeur de win d'un utilisateur
 * @name incrementWin 
 * @param {String} _id : l'id de l'utilisateur dont on souhaite incrémenter la valeur
 */
userSchema.statics.incrementWin = async function(_id) {
  this.findOne({ _id})
    .then(async user => {
      await this.updateOne(
        {_id},
        {win: user.win + 1})
      })
    .catch( err => {console.error(err)});
  };

/**
 * Methode statique permettant d'incrémenté la valeur de win d'un utilisateur
 * @name incrementLoose 
 * @param {String} _id : l'id de l'utilisateur dont on souhaite incrémenter la valeur
 */
  userSchema.statics.incrementLoose = async function(_id) {
  this.findOne({ _id})
  .then(async user => {
    await this.findOneAndUpdate(
      { _id },
      {loose: user.loose + 1},
      {new: true})
    })
  .catch( err => {console.error(err)});
  };

  
module.exports = mongoose.model('User', userSchema);

