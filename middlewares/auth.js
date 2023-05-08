const jwt = require('jsonwebtoken');
require('dotenv').config();
 
module.exports = (req, res, next) => {
   try {
       //récupération du JWT du cookie
       const token = new Cookies(req,res).get('access_token');
       const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {     
       res.redirect('/api/users');
    //    res.status(401).send('Veuillez vous reconnecter');
   }
};