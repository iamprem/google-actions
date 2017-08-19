const express   = require('express');
const config    = require('./config');
const log       = require('./logging');
const exec      = require('child_process').exec;
const util      = require('util');

const router = express.Router();

router.get('/', function (req, res) {
    res.send('Welcome to ytdl home page')
});


router.get('/download', function (req, res) {
    var url = req.query.url;
    try {
        //TODO Validate youtube urls
        log.info("Starting to download song from request url: " + url);
        exec([config.cmd.ytdl_mp3, url].join(" "), (err, stdout, stderr) => {
            if (err) {
                log.error(err);
                return;
            }
            log.info(`stdout: ${stdout}`);
            log.error(`stderr: ${stderr}`);
        });
        res.send("Download started")
    } catch (err) {
        res.status(500).send('Error occurred while downloading the provided url');
    }
});

module.exports = router;