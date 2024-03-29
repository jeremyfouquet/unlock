/****************************************************************************
  Nom ......... : users.js
  Rôle ........ : Ficher contenant les controllers appelés par les routes '/routes/users.js'
  Auteurs ..... : Thibaut Decressonniere
  Version ..... : V1.0 du 24/04/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/

/**
 * @module controllers/users
 * @description Ficher contenant les controllers appelés par les routes '/routes/users.js'
 * @author Thibaut Decressonniere
 * @requires bcrypt
 * @requires jsonwebtoken
 * @requires path
 * @requires dotenv
 * @requires /models/users
 */


const User = require('../models/user'); // Modèle mongoose
const bcrypt = require('bcrypt');       // Chiffrement du MDP 
const jwt = require('jsonwebtoken');    // Utilisation des tokens hashé
const path = require('path');           // gestion des chemins d'accès fichier.

require('dotenv').config();

/**
 * Renvoie vers la page de connexion / inscription.
 * @name getPage
 * @param {object} req 
 * @param {object} res 
 * @function
 
 */
exports.getPage = (req , res) => {

    res.status(200).sendFile(path.join(process.cwd(), '/views/login.html'));   
};

/**
 * recoit une requette HTTP de type POST. Le mail ne poit pas déjà être présent dans la base
 * car unique dans le modèle. Si OK, enregistre un nouvel utilisateur, lui assigne un token
 * (le connecte) et le redirige vers une page.
 * @name signup
 * @param { object } req : la requête envoyé depuis le frontend
 * @param { object } res : la reponse envoyé depuis le backend
 * @function
*/
//TODO : redirection
exports.signup = (req, res) => {
    // Chiffrement du MDP
    bcrypt.hash(req.body.pass, 10)
        // Si la promise réussi on cré un nouvel utilisateur
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash,
          win: 0,
          loose: 0
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error}));
  };

/**
 * recoit une requette HTTP de type POST, contrôle le mail en fonction de la base de donnée,
 * s'il existe, compare les mots de passe, s'il sont identique, revoi un token d'authentification
 * via un cookie et redirige vers une page.
 * @name login
 * @param { object } req : la requête envoyé depuis le frontend
 * @param { object } res : la reponse envoyé depuis le backend
 * @function
*/
  exports.login = (req, res) => {
    // Cherche l'utilisateur dans la BDD
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'E-mail et/ou Mot de passe incorrect !' });
            }
            // Compare les mots de passe avec bcrypt car les MDP sont chiffrés
            bcrypt.compare(req.body.pass , user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'E-mail et/ou Mot de passe incorrect !' });
                    }

                    // Création du Token d'authentification expire en 24h
                    let token = jwt.sign(
                        { userId: user._id },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: '24h' }
                        // { expiresIn: '3h' }
                        // { expiresIn: '60s' }
                    )
                    
                    // Création du cookie contenant le Token expire en 24h
                    res.cookie('access_token', token, {maxAge: 1000 * 60 * 60 * 1, httpOnly: true});
                    try {
                        res.status(200).json({ message: 'Utilisateur connecté !' })
                    }
                    catch (err) {res.status(500).json({ error: err})}
         
                })
                .catch(error => res.status(501).json({ error, message: 'bcrypt' }));
        })
        .catch(error => res.status(500).json({ error, message: 'mongoose'}));
 };

 /**
 * recoit une requette HTTP de type POST, supprime le cookie d'authentification
 * @name logout
 * @param { object } req : la requête envoyé depuis le frontend
 * @param { object } res : la reponse envoyé depuis le backend
 * @function
*/
 exports.logout = (req, res) => {
    try {
        // Supprime le cookie
        res.clearCookie('access_token');
        // Retourne un simple message et Redirige vers une page de notre choix dans le front end
        res.status(200).json({ message: 'Utilisateur déconnecté !' });

    }
    catch (err) {res.status(500).json({ error: err})}
 };

/**
 * recoit une requette HTTP de type GET, contrôle le token d'authentification,
 * et renvoie si ce token existe les informations relative au joueur ou un générique
 * le cas échéant.
 * @name getMe
 * @param { object } req : la requête envoyé depuis le frontend
 * @param { object } res : la reponse envoyé depuis le backend
 * @function
*/
exports.getMe = (req, res) => {
        try {
            // Récupération du cookie
            const token = req.cookies.access_token;
            // décodage et vérification avec JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            // Renvoie (le mieux dans un fetch) les informations utilisateur
            if (decoded) {
                User.findOne({_id : decoded.userId})
                    .then((user) => {
                        res.status(200).json({ 
                            email : user.email,
                            win : user.win ,
                            loose: user.loose
                        });
                    })
                    .catch((err) => {console.error(err);});
                }
        }            
        // Si pas de token ou une erreur innatendue on renvoie une erreur
        catch {
            // Si pas de token ou une erreur innatendue on renvoie un random
            res.status(400).json({ 
                email : "GUEST",
                win : "PAS INSCRIT !",
                loose: "PAS INSCRIT !"
            });
        }
};

/**
 * recoit une requette HTTP de type PUT, contrôle le token d'authentification,
 * et modifie le mot de passe en base de donnée
 * @name updatePSWD
 * @param { object } req : la requête envoyé depuis le frontend
 * @param { object } res : la reponse envoyé depuis le backend
 * @function
 * @async
*/
exports.updatePSWD = async (req, res) => {
    try{
        const decoded = jwt.verify(req.cookies.access_token, process.env.JWT_SECRET_KEY);

        if (decoded) {
            bcrypt.hash(req.body.pass, 10)
                .then(async hash =>  {
                    await User.findOneAndUpdate(
                        {_id: decoded.userId},
                        {password: hash},
                        {new: true})
                            .then((user) => {
                                res.status(200).json({ message: "Le mot de passe a été mis à jour"});
                            });
                        
    })}}
    catch (err) {res.status(500).json({ error: err})}
};

/**
 * recoit une requette HTTP de type DELETE, contrôle le token d'authentification,
 * supprime le compte de l'utilisateur de la base de donnée. Supprime également le cookie
 * d'authentification.
 * @name deleteAccount
 * @param { object } req : la requête envoyé depuis le frontend
 * @param { object } res : la reponse envoyé depuis le backend
 * @async
 * @function
*/
exports.deleteAccount = async (req, res) => {
    try{
        const decoded = jwt.verify(req.cookies.access_token, process.env.JWT_SECRET_KEY);

        if (decoded) {
            const result = await User.deleteOne({_id: decoded.userId})
            if (result.deletedCount) {
                 // Supprime le cookie
                res.clearCookie('access_token');
                // Retourne un simple message et Redirige vers une page de notre choix dans le front end
                res.status(200).json({ message: 'Utilisateur supprimé !' });

            }
        }
    }
    catch (err) {console.error(err);}
};

/**
 * Renvoie vers la page de profil ou login après avoir contrôler avec succès ou non le token d'authentification.
 * @name getProfil
 * @param { object } req : la requête envoyé depuis le frontend
 * @param { object } res : la reponse envoyé depuis le backend
 * @async
 * @function
*/
exports.getProfil = async (req , res) => {
    try{
        const decoded = jwt.verify(req.cookies.access_token, process.env.JWT_SECRET_KEY);
        if (decoded) {
            const user = await User.findOne({_id: decoded.userId});
            if (user) {
               // Redirige vers le page de profil
               res.status(200).sendFile(path.join(process.cwd(), '/views/profil.html'));
            }
        }
    }
    catch (err) {
        // Redirige vers le page de login
        res.status(200).sendFile(path.join(process.cwd(), '/views/login.html'));
    } 
};

/**
 * Incremente la valeur Win du joueur enristré dans le token d'authentification
 * @name incrementWin
 * @param { object } req : la requête envoyé depuis le frontend
 * @param { object } res : la reponse envoyé depuis le backend
 * @function
 * @async
*/
exports.incrementWin = async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.access_token, process.env.JWT_SECRET_KEY);
      if (decoded) {
        await User.incrementWin({ _id: decoded.userId });
        res.status(200).json({ message: "Win incremented successfully" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error incrementing win" });
    }
  };

  /**
 * Incremente la valeur Loose du joueur enristré dans le token d'authentification.
 * @name incrementLoose
 * @param { object } req : la requête envoyé depuis le frontend
 * @param { object } res : la reponse envoyé depuis le backend
 * @function
 * @async
*/
exports.incrementLoose = async (req, res) => {
    try {
      const decoded = jwt.verify(req.cookies.access_token, process.env.JWT_SECRET_KEY);
      if (decoded) {
        await User.incrementLoose({ _id: decoded.userId });
        res.status(200).json({ message: "Loose incremented successfully" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error incrementing loose" });
    }
  };
