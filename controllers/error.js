const path = require('path')

exports.getpage = (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../views/404.html'));
};