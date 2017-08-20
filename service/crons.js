const schedule  = require('node-schedule');
const youtube   = require('./youtube_data_api');
const util      = require('util');
const exec      = require('child_process').exec;
const log       = require('./logging');
const config    = require('./config');

var getHourlyLikedVideos = schedule.scheduleJob('0 0 * * * *', function(){
    var pastHour = new Date();
    pastHour.setHours(pastHour.getHours() - 1);
    youtube.activities.list({
        part: 'snippet,contentDetails',
        maxResults: 50,
        mine: true,
        publishedAfter: pastHour.toISOString()
    }, function (err, data, response) {
        if (err) {
            log.error('Error getting activities from youtube: ' + err);
        }
        if (response) {
            log.info('Status code: ' + response.statusCode);
        }
        if (data) {
            log.info(util.inspect(data, false, null));
            for(var i in data.items) {
                if (data.items[i].snippet.type === 'like') {
                    var videoId = data.items[i].contentDetails.like.resourceId.videoId;
                    log.info("Getting the liked video using the videoId: " + videoId);
                    exec([config.cmd.ytdl_from_id, videoId].join(" "), (err, stdout, stderr) => {
                        if (err) {
                            log.error(err);
                            return;
                        }
                        log.info(`stdout: ${stdout}`);
                        log.error(`stderr: ${stderr}`);
                    });
                } else {
                    log.info("Skipping item in activity list that are not 'Likes'");
                }
            }
        }

    });
});