'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.set('port', 8080);
app.use(bodyParser.json());

app.post('/action', function (req, res) {
    console.log('Request headers: ' + JSON.stringify(req.headers));
    console.log('Request body: ' + JSON.stringify(req.body));
    res.send('Hello World!');
});

app.listen(app.get('port'), function () {
    console.log('Server started at port 8080!');
});