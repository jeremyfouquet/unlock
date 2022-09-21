const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {origin : '*'}
});
const port = process.env.PORT || 3000;
const path = require('path');

app.use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/popper.js', express.static(path.join(__dirname, 'node_modules/popper.js/dist')));
app.use('/bootstrap/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/home.html'));
});

http.listen(port, () => {
    console.log(`listening on port : http://localhost:${port}`);
});