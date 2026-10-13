import crypto from 'crypto'

const cles = {
    cleRefreshToken : crypto.randomBytes(64).toString('hex'),
    cleAccesToken   : crypto.randomBytes(32).toString('hex')
}

export default cles