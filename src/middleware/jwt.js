const fs = require('fs');
const jwt = require('jsonwebtoken');

// Load RSA Keys
const private_cert = fs.readFileSync('cert/private.key', 'utf8');
const public_cert = fs.readFileSync('cert/public.key', 'utf8');

const jwtMiddleware = (req, res, next) => {

    const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

    jwt.verify(token, public_cert, { audience: 'clientServer' }, function(err, decoded) {
        try {
            if (!err && decoded.iss === 'cserver') {
                if (decoded.customer) {
                    req.body.customer = decoded.customer;
                }
                if (decoded.partner) {
                    req.body.partner = decoded.partner;
                }
                next();
            } else {
                throw 'err';
            }
        }
        catch(err) {
            res.status(401).json({
                statusCode: 401,
                messsage: 'Unauthorized'
            })
        }
    });
}

module.exports = { jwtMiddleware }