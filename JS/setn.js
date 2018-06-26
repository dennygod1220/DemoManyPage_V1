var scrape = require('website-scraper');
var fs = require('fs');
var cheerio = require('cheerio');
var rimraf = require('rimraf');



function setn(io) {

    //用 website-scraper module的方法下載
    io.once('connection', function (socket) {
        console.log('連線ID:' + socket.id);
        //指定下載頁面的URL和下載後檔案放置路徑
        var connect_id = socket.id
        var options = {
            urls: ['https://www.setn.com/'],
            directory: 'public/store/setn/' + connect_id,
        };
        //刪除舊的資料包
        rimraf('./public/3lee', function () {
            io.sockets.connected[socket.id].emit('delete old');
        })
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
            fs.readFile('./public/store/setn/' + socket.id + '/index.html', 'utf8', async function (err, data) {
                var $ = cheerio.load(data);
                $("script[src='advertisement']").remove();
                $('<ins class="clickforceads" style="display:inline-block;width:970px;height:250px;" data-ad-zone="7965"></ins><script async type="text/javascript" src="//cdn.doublemax.net/js/init.js"></script>').insertAfter('#bar_ad');
                await fs.writeFile('./public/store/setn/' + socket.id + '/index.html', $.html());
            });

            setTimeout(() => {
                io.sockets.connected[socket.id].emit('modifyOK', CreateID);
            }, 4000);
        })

        socket.on('disconnect', function () {
            console.log("leave");
            //當使用者斷線後5分鐘刪除舊的資料包
            // setTimeout(() => {
            //     rimraf('./public/store/setn/' + socket.id, function () {
            //         console.log("delete: " + socket.id);
            //     })
            // }, 300000);
        });
    })

}
module.exports = setn;