 
const privKey       = process.env.PRIVKEY;
const jwtAlgorithm  = process.env.JWTALGORITHM;
const expireMins    = process.env.EXPIREMINS;

const jwt           = require('jsonwebtoken');

class UserToken
{
    algorithm    = jwtAlgorithm;
    privateKey   = privKey;
    jwt          = jwt;
    expireMins   = expireMins;

    constructor(params)
    {
        this.params = params?{params}:"";
    }

    sign()
    {
        const  token = (this.jwt).sign( this.params , this.privateKey, { algorithm: this.algorithm });
        console.info("Token got generated : " + token);
        return token; 
    }
    decode(token)
    {
        return jwt.verify(token, this.privateKey,{ algorithm: this.algorithm });
    }
    isExpired(decodedToken)
    {
        if( new Date(decodedToken.iat*1000 + this.expireMins*60000).getTime() <  new Date().getTime() ) 
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}
module.exports = UserToken;