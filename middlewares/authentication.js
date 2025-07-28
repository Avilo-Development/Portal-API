import jwt from 'jsonwebtoken'
import config from '../config/index.js'

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.status(401).json({message: 'Unauthorized'})

    jwt.verify(token, config.token_secret, (err, user) => {
        if(err) return res.status(403).json(err)
        req.user = user
        next()
    })
}
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role; // Assumes user already authenticated
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

export {authenticateToken, authorizeRoles}