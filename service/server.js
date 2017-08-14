'use strict';

const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const fuzzy = require('fuzzy');
const util = require('util');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const log = require('./logging');

const MUSIC_ROOT = '/home/bukky/Music/plexmusic';
const FUZZY_FIND_CMD = "find %s -iname '*.mp3' | /home/bukky/.fzf/bin/fzf -f '%s'";
const PLAY_MUSIC_CMD = "ffplay -autoexit %s";

var options = {
    key: fs.readFileSync('/home/bukky/workspace/google-actions/config/iamprem.key'),
    cert: fs.readFileSync('/home/bukky/workspace/google-actions/config/iamprem_tech.crt'),
    ca: fs.readFileSync('/home/bukky/workspace/google-actions/config/iamprem_tech.ca-bundle'),
};
const app = express();
app.set('port', 8080);
app.use(bodyParser.json());
app.use(log.requestLogger);
// app.use(log.errorLogger);

// Search the music directory synchronously and return the first match
function search(query) {
    log.info("executing command: " + util.format(FUZZY_FIND_CMD, MUSIC_ROOT, query));
    let matches = execSync(util.format(FUZZY_FIND_CMD, MUSIC_ROOT, query), {encoding: 'utf8'});
    return matches.split('\n')[0];
}

app.post('/action', function (req, res) {
    log.info('Request headers: ' + JSON.stringify(req.headers));
    log.info('Request body: ' + JSON.stringify(req.body));
    log.error('Sample error log');
    let song_path = "";
    if (req.body.result.action === 'jarvis.play') {
        let query = req.body.result.parameters.song || "vellai";
        log.info("Searching for song: " + query);
        song_path = search(query);
        log.info("Received file name: " + song_path);
        log.info("executing command: " + util.format(PLAY_MUSIC_CMD, song_path));
        exec(util.format(PLAY_MUSIC_CMD, song_path), (err, stdout, stderr) => {
            if (err) {
                log.info(err);
                return;
            }
            log.info(`stdout: ${stdout}`);
            log.info(`stderr: ${stderr}`);
        });
    }


    let response = {
        "speech": "Playing the song " + song_path,
        "displayText": "what a beauty"
    };
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response ));
});

app.get('/', function (req, res) {
    log.info("Get Request")
    res.send("Success")
});

var server = https.createServer(options, app).listen(8443, function(){
    log.info("server started at port 8443");
});

app.listen(app.get('port'), function () {
    log.info('Server started at port 8080!');
});