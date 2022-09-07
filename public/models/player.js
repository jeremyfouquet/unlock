function Player (id, pseudo, avatar, roomId, start) {
    this.id = id;
    this.pseudo = pseudo;
    this.avatar = avatar;
    this.roomId = roomId;
    this.start = start;
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