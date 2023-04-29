//const {getUniqueId} = require('../middlewares/helper.js');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const Cookies = require('cookies');

require('dotenv').config();

exports.getPage = (req, res) => {
    res.status(200).sendFile(path.join(process.cwd(), '/views/user.html'));   
};

exports.signup = (req, res) => {
    bcrypt.hash(req.body.pass, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash,
          win:0,
          loose:0
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.pass , user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }


                    // Création du Token d'authentification
                    let token = jwt.sign(
                        { userId: user._id },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: '3h' }
                    )
                    
                    // Création du cookie contenant le Token
                    new Cookies(req,res).set('access_token',token, {
                        httpOnly: true, //cookie not available through client js code
                        secure: false, // true to force https
                        maxAge: 5000 // time in seconds before expiration
                    });

                    // On envoie tout 
                    // TODO renvoyé ver Home.html
                    try {
                        res.status(200).json({
                            userId: user._id,
                            token: token
                        });
                    }
                    catch (err) {res.status(500).json({ error: err})}
         
                })
                .catch(error => res.status(501).json({ error, message: 'bcrypt' }));
        })
        .catch(error => res.status(500).json({ error, message: 'mongoose'}));
 };

 exports.logout = (req, res) => {

    new Cookies(req,res).set('access_token', "", {
        httpOnly: true, //cookie not available through client js code
        secure: false, // true to force https
        maxAge: 5 // Time in seconde before expire
    });

    try {
        res.status(200).sendFile(path.join(process.cwd(), '/views/user.html'));
    }
    catch (err) {res.status(500).json({ error: err})}
 }