import jwt from 'jsonwebtoken'
import config from '../config/index.js'

function generateAccessToken(username){
    return jwt.sign(username, config.token_secret, {expiresIn: '36000s'});
}

export {generateAccessToken}