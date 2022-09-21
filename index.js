const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {origin : '*'}
});
const port = process.env.PORT || 3000;
const path = require('path');
const url = require('url');

app.use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/popper.js', express.static(path.join(__dirname, 'node_modules/popper.js/dist')));
app.use('/bootstrap/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use(express.static('public'));

// DATAS :
const games = require(path.join(__dirname + '/datas/games.json'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/home.html'));
});
app.all('/connection/?', (req, res, next) => {
    const query = url.parse(req.url,true).query;
    const game = games[query.game];
    if(game) {
      next();
    } else {
      res.sendFile(path.join(__dirname, 'views/buildingpage.html'));
    }
});
app.get('/connection/?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/connection.html'));
});
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, 'views/404.html'));
});

http.listen(port, () => {
    console.log(`listening on port : http://localhost:${port}`);
});