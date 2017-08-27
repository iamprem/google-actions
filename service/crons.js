const schedule  = require('node-schedule');
const youtube   = require('./youtube_data_api');
const util      = require('util');
const exec      = require('child_process').exec;
const log       = require('./logging');
const config    = require('./config');

var getLikedVideosEvery10Min = schedule.scheduleJob('0 */10 * * * *', function(){
    var pastTenMin = new Date();
    pastTenMin.setMinutes(pastTenMin.getMinutes() - 10);
    getLikeActivities(pastTenMin, null);
});


function getLikeActivities(publishedAfter, pageToken) {

    youtube.activities.list({
        part: 'snippet,contentDetails',
        maxResults: 50,
        mine: true,
        publishedAfter: publishedAfter.toISOString(),
        pageToken: pageToken
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
            if (data.nextPageToken !== undefined && data.nextPageToken !== null) {
                log.info("Fetching the next activities result page" + data.nextPageToken);
                getLikeActivities(publishedAfter, data.nextPageToken);
            }
        }

    });
}