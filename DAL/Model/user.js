const { Sequelize, DataTypes, Model } = require('sequelize');
const { Login } = require("./login");

class User extends Model {}

/**
 * @description Defines the table structure
 * @param {Sequelize} sequelize The database instance
 */
async function setupModel(sequelize, sync = false) {
    User.init({
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        statusID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    }, {
        sequelize,
        modelName: "User",
        tableName: "User"
    });

    User.hasMany(Login, {
        foreignKey: {
            name: "userID",
            allowNull: false
        },
        foreignKeyConstraint: true
    });

    if (sync)
        await syncModel();
}

/**
 * @description Update the database schema to match our definition
 */
async function syncModel() {
    await User.sync();
}

module.exports = {
    setupModel,
    syncModel,
    User
};