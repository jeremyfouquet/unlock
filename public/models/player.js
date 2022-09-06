function Player (id, pseudo, avatar) {
    return {
        id: id,
        pseudo: pseudo,
        avatar: avatar,
        roomId: '',
        start: false,

        getInfo: function () {
            return {
                id,
                pseudo,
                avatar,
                roomId,
                start
            };
        },
        getId: function () {
            return id;
        },
        getPseudo: function () {
            return pseudo;
        },
        getAvatar: function () {
            return avatar;
        },
        getRoomId: function () {
            return roomId;
        },
        getStart: function () {
            return start;
        }
    };
}