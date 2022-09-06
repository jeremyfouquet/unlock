function Player (id, pseudo, avatar) {
    this.id = id;
    this.pseudo = pseudo;
    this.avatar = avatar;
    this.roomId = '';
    this.start = false;
    this.getInfo = function() {
        return {
            id: this.id,
            pseudo: this.pseudo,
            avatar: this.avatar,
            roomId: this.roomId,
            start: this.start
        };
    };
}