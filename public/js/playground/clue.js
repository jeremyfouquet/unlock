/****************************************************************************
  Nom ......... : clue.js
  Rôle ........ : Constructeur de l'objet Clue
  Auteur ...... : Jeremy Fouquet
  Version ..... : V1.0 du 31/03/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/
function Clue (id, name, description, img, numsClues, discard, type) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.img = img;
    this.numsClues = numsClues;
    this.discard = discard;
    this.type = type;
    this.combinable = {};
    this.machine = {};
    /**
     * Affecte this.combinable avec l'objet passé en parametre
     * @name setCombinable
     * @param { Object } combinable
    */
    this.setCombinable = function (combinable) {
        this.combinable = combinable;
    };

    /**
     * Affecte this.machine avec l'objet passé en parametre
     * @name setMachine
     * @param { Object } machine
    */
    this.setMachine = function (machine) {
        this.machine = machine;
    };
}
