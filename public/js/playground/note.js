/****************************************************************************
  Nom ......... : note.js
  Rôle ........ : Constructeur de l'objet Note
  Auteur ...... : Jeremy Fouquet
  Version ..... : V1.0 du 31/03/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/
function Note (message, avatar, id, pseudo, date) {
    this.message = message;
    this.avatar = avatar;
    this.id = id;
    this.pseudo = pseudo;
    this.date = date;
}
