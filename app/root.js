const { Express } = require('express');
const path = require('path');
const appSettings = require("../settings.json");

async function rootPage(req, res) {
    res.render(path.join(__dirname, '/../www/html/index.html'), {
        id: req.session.userId,
        username: req.session.username,
        avatar: req.session.avatar,
        loginUrl: appSettings.loginUrl
    });
    return;
}


async function init(app) {
    app.get('/', rootPage);
}

module.exports = {
    init
};