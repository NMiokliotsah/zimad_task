require('dotenv/config');
const jwt = require('jsonwebtoken');

exports.createAccessToken = id => {
    return jwt.sign({ id }, process.env.SECRET_VALUE_ACCESS_TOKEN, {
        expiresIn: '10m'
    });
}

exports.createRefreshToken = id => {
    return jwt.sign({ id }, process.env.SECRET_VALUE_REFRESH_TOKEN);
}