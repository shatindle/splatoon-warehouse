const { Sequelize, DataTypes, Model } = require('sequelize');

class Login extends Model {}

/**
 * @description Defines the table structure
 * @param {Sequelize} sequelize The database instance
 */
async function setupModel(sequelize, sync = false) {
    Login.init({
        userType: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        loginUserID: {
            type: DataTypes.STRING(500),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "Login",
        tableName: "Login"
    });

    if (sync)
        await syncModel();
}

/**
 * @description Update the database schema to match our definition
 */
async function syncModel() {
    await Login.sync();
}

module.exports = {
    setupModel,
    syncModel,
    Login
};