'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const fuzzy = require('fuzzy');
const util = require('util');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

const MUSIC_ROOT = '/home/bukky/Music/plexmusic';
const FUZZY_FIND_CMD = "find %s -iname '*.mp3' | /home/bukky/.fzf/bin/fzf -f '%s'";
const PLAY_MUSIC_CMD = "ffplay -autoexit %s";

const app = express();
app.set('port', 8080);
app.use(bodyParser.json());

// Search the music directory synchronously and return the first match
function search(query) {
    console.log("executing command: " + util.format(FUZZY_FIND_CMD, MUSIC_ROOT, query));
    let matches = execSync(util.format(FUZZY_FIND_CMD, MUSIC_ROOT, query), {encoding: 'utf8'});
    return matches.split('\n')[0];
}

app.post('/action', function (req, res) {
    console.log('Request headers: ' + JSON.stringify(req.headers));
    console.log('Request body: ' + JSON.stringify(req.body));

    let song_path = "";
    if (req.body.result.action === 'jarvis.play') {
        let query = req.body.result.parameters.song || "vellai";
        console.log("Searching for song: " + query);
        song_path = search(query);
        console.log("Received file name: " + song_path);
        console.log("executing command: " + util.format(PLAY_MUSIC_CMD, song_path));
        exec(util.format(PLAY_MUSIC_CMD, song_path), (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });
    }


    let response = {
        "speech": "Playing the song " + song_path,
        "displayText": "what a beauty"
    };
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response ));
});

app.listen(app.get('port'), function () {
    console.log('Server started at port 8080!');
});