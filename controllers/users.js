const {getUniqueId} = require('../middlewares/helper.js');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

// let users = require('../mock-users')

// exports.getUsers = (req, res, next) => {
//     res.status(200).json(users);
//     console.log(users);
// };

// exports.createUser = (req, res, next) => {
//         const id = getUniqueId(users)
//         console.log(req.body)
//         const userCreated = {...req.body, ...{_id: id}}//{ ...req.body, ...{id: id, created: new Date()}}
//         users.push(userCreated)
//         console.log(userCreated);
//         res.status(201).json(users);
// };

exports.getPage = (req, res) => {
    res.sendFile(path.join(process.cwd(), '/views/user.html'));   
};

exports.signup = (req, res) => {
    bcrypt.hash(req.body.pass, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
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
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };