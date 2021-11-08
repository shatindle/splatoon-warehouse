const { Express, request, response } = require('express');
const url = require('url');
const discordCredentials = require("../discord.json");
const { Login } = require("../DAL/Model/login");
const { User } = require("../DAL/Model/user");
const fetch = require("node-fetch");

/**
 * @description The post back to a login to discord
 * @param {request} req The Express request object
 * @param {response} res The Express response object
 * @param {Next} next The next function to call
 */
async function discordLoginPage (req, res, next) {
    try {
        const urlObj = url.parse(req.url, true);

        if (urlObj.query.code) {
            const accessCode = urlObj.query.code;
            const data = {
                client_id: discordCredentials.client_id,
                client_secret: discordCredentials.client_secret,
                grant_type: 'authorization_code',
                redirect_uri: discordCredentials.redirect_uri,
                code: accessCode,
                scope: 'identify',
            };

            var response = await fetch('https://discord.com/api/oauth2/token', {
                method: 'POST',
                body: new URLSearchParams(data),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            var info = await response.json();

            var userInfoRequest = await fetch('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `${info.token_type} ${info.access_token}`,
                },
            });    

            var userData = await userInfoRequest.json();

            req.session.loginId = userData.id;
            req.session.loginType = "discord";
            req.session.username = userData.username + "#" + userData.discriminator;
            req.session.createdon = userData.id;

            if (userData.avatar) {
                req.session.avatar = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}`;
            } else {
                req.session.avatar = `/css/img/discord.png`;
            }

            // check if the login already exists
            let login = await Login.findOne({
                where: {
                    userType: "discord",
                    userID: req.session.loginId
                }
            });

            if (login) {
                // login exists, get user
                req.session.userId = login.userID;
            } else {
                // login does not exist, so neither does the user
                // create the login and user
                let user = await User.create({
                    name: userData.username + "#" + userData.discriminator,
                    active: true,
                    statusID: 1
                });

                await Login.create({
                    userType: "discord",
                    userID: user.userID,
                    loginUserID: req.session.loginId
                });

                req.session.userId = user.userID;
            }

            // TODO: server role lookups
        }

        res.redirect('/');
    } catch (e) {
        next("Error logging in");
    }
}

/**
 * 
 * @param {Express} app 
 */
function init(app) {
    app.get('/discordlogin', discordLoginPage);
}

module.exports = {
    init
};