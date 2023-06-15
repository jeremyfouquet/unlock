/****************************************************************************
  Nom ......... : player.js
  Rôle ........ : Constructeur de l'objet Player
  Auteur ...... : Jeremy Fouquet
  Version ..... : V1.0 du 31/03/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/
function Player (id, pseudo, avatar, roomId, start) {
    this.id = id;
    this.pseudo = pseudo;
    this.avatar = avatar;
    this.roomId = roomId;
    this.start = start;
}
