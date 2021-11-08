const { Sequelize } = require('sequelize');
const appSettings = require("../settings.json");
const path = require("path");

const login = require("./Model/login");
const user = require("./Model/user");

const sequelize = new Sequelize({
    username: appSettings.database.username,
    password: appSettings.database.password,
    storage: path.join(__dirname, '..', 'database.sqlite'),
    host: 'localhost',
    dialect: 'sqlite',
    logging: console.log
});

async function init() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        login.setupModel(sequelize, true);
        user.setupModel(sequelize, true);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = {
    init,
    Login: login.Login,
    User: user.User
};