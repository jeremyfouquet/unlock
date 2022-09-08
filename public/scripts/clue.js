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
    this.setCombinable = function (combinable) {
        this.combinable = combinable;
    };
    this.setMachine = function (machine) {
        this.machine = machine;
    };
}