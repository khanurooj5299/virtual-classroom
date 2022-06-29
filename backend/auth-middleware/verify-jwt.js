const jwt = require('jsonwebtoken');

const config = require('../env/config');

module.exports = (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    if(authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.TOKEN_KEY, (err, data)=>{
            if(err) {
                if(err.name==='TokenExpiredError') {
                    res.json({status: 401, data: 'Session expired.'});
                }
                else {
                    res.json({status: 403, data: 'Invalid Token'});
                }
            }
            else {
                next();
            }
        })
    }
    else {
        res.json({status: 500, data: 'No token found'});
    }
}