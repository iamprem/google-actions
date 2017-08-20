const gapi = require('googleapis');
const opn = require('opn');
const config = require('./config');


const OAuth2 = gapi.auth.OAuth2;
const oauth2Client = new OAuth2(
    config.gapi.client_id,
    config.gapi.client_secret,
    config.gapi.redirect_url
);


const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: config.gapi.scope_youtube_readonly,
});

opn(url);

// Paste the code in the redirected url and get the refresh token for first time
oauth2Client.getToken(config.gapi.code, function (err, tokens) {
    if (!err) {
        console.log(tokens);
        oauth2Client.setCredentials(tokens);
    } else {
        console.log(err)
    }
});