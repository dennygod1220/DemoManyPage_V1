$(document).ready(function () {
    var ip = '';
    try {
        if (client_ip) {
            sendLog(client_ip);
            ip = client_ip;
        }
    }
    catch (e) {
    }

    try {
        if (ip === '') {
            $.getJSON("http://jsonip.appspot.com?callback=?", function (data) {
                sendLog(data.ip);
            });
        }
    }
    catch (e) {
    }
});

function sendLog(ip) {

    var plateType = [/Android/i, /iPhone|iPad/i, /Windows/i, /Mobile/i, /Macintosh/i];
    var plateDevice = ['mobile', 'mobile', 'web', 'mobile', 'web'];
    
    try {
        var paras = {
            Username: '1',
            Password: '2',
            Invoice: '23740512',
            EventID: 'SETNEWS',
            ClickUser: getCookie("userKey"),
            ClickID: '',
            ClickPageID: '',
            ClickDevice: 'web',
            ClickPreURL: document.referrer,
            ClickSearchKey: '',
            ClickURL: document.location.href,
            ClickIP: ip,
            OnlineTime : ''
        };

        
        if (typeof (nOnlineTime) !== 'undefined') {
            paras.OnlineTime = nOnlineTime;
        }

        var userAgent = navigator.userAgent;
        for (var i = 0; i < plateType.length; i++) {
            if (plateType[i].test(userAgent)) {
                paras.ClickDevice = plateDevice[i];
                break;
            }
        }

        var uri = location.search.toLowerCase();
        if (uri.length > 0) {
            var qObj = parsrQueryString(uri);
            if (qObj.newsid) {
                paras.ClickID = qObj.newsid;
                //para2.ptsri = paras.ClickID;
            }
            if (qObj.pagegroupid) { paras.ClickPageID = qObj.pagegroupid; }

            if (qObj.q) { paras.ClickSearchKey = qObj.q; }
        }

        $.get('//ubas.setn.com/import.ashx', paras);

        //try
        //{
        //    sa('567cad3cbdc38', {
        //        title: document.title,
        //        url: document.location.href,
        //        user: getCookie("userKey")
        //    });
        //}
        //catch (exinner) {

        //}

    }
    catch (ex) {
        alert(ex.message);
    }
    finally {

    }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}
function parsrQueryString(uri) {
    var string_array = [];
    var string_array = uri.replace('?', '').split("&");
    var obj = {};
    for (var i = 0; i < string_array.length; i++) {
        obj[string_array[i].split('=')[0]] = string_array[i].split('=')[1] || '';
    }
    return obj;
}