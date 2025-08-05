import crypto from 'crypto'

function hashEncode(data, algorithm='sha256'){
    const hash = crypto.createHash(algorithm)
    hash.update(data)
    return hash.digest('hex');
}

export {hashEncode}