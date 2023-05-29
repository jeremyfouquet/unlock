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

module.exports = Clue;
