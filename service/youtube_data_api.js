const gapi = require('googleapis');
const config = require('./config');
const util = require('util');


const OAuth2 = gapi.auth.OAuth2;

const oauth2Client = new OAuth2(
    config.gapi.client_id,
    config.gapi.client_secret,
    config.gapi.redirect_url
);


oauth2Client.setCredentials({
    refresh_token: config.gapi.refresh_token,
});

oauth2Client.refreshAccessToken(function(err, tokens) {
    console.log(tokens);
});


const youtube = gapi.youtube({
    version: 'v3',
    auth: oauth2Client
});

// youtube.playlists.list({
//     part: 'id,snippet',
//     channelId: config.channel_id
//     }, function (err, data, response) {
//     if (err) {
//         console.error('Error: ' + err);
//     }
//     if (data) {
//         console.log(util.inspect(data, false, null));
//     }
//     if (response) {
//         console.log('Status code: ' + response.statusCode);
//     }
// });


module.exports = youtube;