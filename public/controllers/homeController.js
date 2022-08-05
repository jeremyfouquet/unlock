const path = require('path');
function play(index) {
    const game = require(path.join(__dirname + '/datas/games.json'))[index];
    console.log(game);
}