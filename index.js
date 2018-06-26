var scrape = require('website-scraper');
var util = require("util");
var fs = require('fs');
var cheerio = require('cheerio');
var rimraf = require('rimraf');

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var PORT = 9999;
app.use(express.static(__dirname + '/public'));

//載入模組
var setn = require('./JS/setn');
var tvbs = require('./JS/tvbs');


app.get('/', function (req, res) {
    res.sendfile('./index.html');
});





//三立新聞
app.get('/setn', function (req, res) {
    res.sendfile('public/page/setn.html');
    setn(io);

})
// TVBS
app.get('/tvbs', function (req, res) {
    res.sendfile('public/page/tvbs.html');
    tvbs(io);
})

server.listen(PORT);
