const Users = require('../models/users');
const RefreshTokens = require('../models/refreshTokens');
const Fails = require('../models/files');

exports.getUserByEmail = async email => {
    const user = await Users.findAll({
        where: {
            email
        }
    });

    return user[0];
}

exports.getRefreshToken = async refresh_token => {
    const token = await RefreshTokens.findAll({
        where: {
            refresh_token
        }
    });

    return token[0];
}

exports.getRefreshTokenByUserId = async user_id => {
    const token = await RefreshTokens.findAll({
        where: {
            user_id
        }
    });

    return token[0];
}

exports.getFileById = async id => {
    const fail = await Fails.findAll({
        where: {
            id
        }
    });

    return fail[0];
}

exports.getFileByName = async name => {
    const fail = await Fails.findAll({
        where: {
            name
        }
    });

    return fail[0];
}

exports.addRefreshToken = (user_id, refresh_token) => {
    return RefreshTokens.create({
        user_id,
        refresh_token
    });
}