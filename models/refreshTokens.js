const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const refreshTokens = sequelize.define('refresh_tokens', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    refresh_token: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = refreshTokens;