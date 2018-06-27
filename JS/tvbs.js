var scrape = require('website-scraper');
var fs = require('fs');
var cheerio = require('cheerio');
var rimraf = require('rimraf');



function tvbs(io) {

    //用 website-scraper module的方法下載
    io.once('connection', function (socket) {
        console.log('連線ID:' + socket.id);
        //指定下載頁面的URL和下載後檔案放置路徑
        var connect_id = socket.id
        var options = {
            urls: ['https://news.tvbs.com.tw/'],
            directory: 'public/store/tvbs/' + connect_id,
        };

        //刪除完成
        socket.on('delete ok', function () {
            //下載目前三立網頁資料包
            scrape(options).then((result) => {
                //發送下載完成事件
                io.sockets.connected[socket.id].emit('downloadOK');
            }).catch(console.log);
        })

        socket.once('creative id', function (CreateID) {
            console.log("收到素材ID :" + CreateID);
            fs.readFile('./public/store/tvbs/' + socket.id + '/index.html', 'utf8', async function (err, data) {
                var $ = cheerio.load(data);
                $("#v4_news_desktop_index_superrec_L2").remove();
                $('<ins class="clickforceads" style="display:inline-block;width:300px;height:600px;" data-ad-zone="7585"></ins><script async type="text/javascript" src="//cdn.doublemax.net/js/init.js"></script>').insertAfter('.ad_300x600.margin_b20');
                await fs.writeFile('./public/store/tvbs/' + socket.id + '/index.html', $.html(),function(){console.log('callback')});
            });

            setTimeout(() => {
                io.sockets.connected[socket.id].emit('modifyOK', CreateID);
            }, 4000);
        })

        socket.on('disconnect', function () {
            console.log("leave");
            //當使用者斷線後5分鐘刪除舊的資料包
            // setTimeout(() => {
            //     rimraf('./public/store/tvbs/' + socket.id, function () {
            //         console.log("delete: " + socket.id);
            //     })
            // }, 300000);
        });
    })

}
module.exports = tvbs;
