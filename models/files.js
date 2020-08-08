const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const fails = sequelize.define('files', {
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
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ext: {
        type: Sequelize.STRING,
        allowNull: false
    },
    mimetype: {
        type: Sequelize.STRING,
        allowNull: false
    },
    size: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
});

module.exports = fails;