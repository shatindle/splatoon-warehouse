const express = require('express');
const path = require('path');
const databaseApi = require("./DAL/databaseApi");
const appSettings = require("./settings.json");
const cookieParser = require('cookie-parser');

databaseApi.init();

const sessionParser = require('express-session')({
    cookie: {
        path: '/', 
        secure: appSettings.secureCookie, 
        httpOnly: true,
        maxAge: 40 * 24 * 60 * 60 * 1000 // 40 days
    },
    proxy: appSettings.secureCookie && !appSettings.secure,
    secret: appSettings.secret,
    resave: false,
    saveUninitialized: true,
    name: 'ww-token.sid',
    key: 'session_cookie_name',
});

const app = express();

var server = require("http").createServer(app);

if (!appSettings.secure && appSettings.secureCookie) {
    app.set('trust proxy', 'loopback');
}

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(sessionParser);

app.use('/js', express.static(__dirname + '/www/js'));
app.use('/css', express.static(__dirname + '/www/css'));
app.use('/fav', express.static(__dirname + '/www/fav'));
app.use(express.urlencoded());
app.use(cookieParser());

app.use((err, req, res, next) => {
    // Simple error handling here... in real life we might
    // want to be more specific
    console.log(`I'm the error handler. '${err.message}'`);
    res.status(500);
    res.json({ error: "Invalid argument" });
});

// endpoints
require("./app/discordlogin").init(app);
require("./app/root").init(app);

app.get('/logout', (req, res) => {
    req.session.destroy();
  
    res.render(path.join(__dirname, '/html/logout.html'), {
      loginUrl: appSettings.discord.login_uri
    });
});

server.listen(appSettings.http);