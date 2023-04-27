const path = require('path');
const games = require(path.join(process.cwd(), '/datas/games.json'));
const url = require('url');


exports.getHome = (req, res) => {
        res.status(200).sendFile(path.join(process.cwd(), '/views/home.html'));
};

exports.getBuildPage = (req, res, next) => {
    const query = url.parse(req.url,true).query;
    const game = games[query.game];
    if(game) {
      next();
    } else {
      res.sendFile(path.join(process.cwd(), '/views/buildingpage.html'));
    }
}

exports.getPlaygroundPage = (req, res) => {
    res.sendFile(path.join(process.cwd(), '/views/playground.html'));
};