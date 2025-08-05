import jwt from 'jsonwebtoken'
import config from '../config/index.js'

function generateAccessToken(payload){
    return jwt.sign(payload, config.token_secret, {expiresIn: '36000s'});
}

export {generateAccessToken}