const Sequelize = require('sequelize');
const DB_NAME = 'zimad_task';
const USER_NAME = 'root';
const PASSWORD = '1234';

const sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;