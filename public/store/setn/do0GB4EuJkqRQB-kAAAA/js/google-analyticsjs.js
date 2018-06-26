//ga tracking event
$(function () {
    ga_track('');
});

// ajax 事件後的 ga track binding action
function ga_track(selector, debug) {
    if (selector) {
        selector += ' .gt'
    }
    else {
        selector = '.gt';
    }

    $(selector).on('click', function () {

        var pa = '';

        var pl = '';
        if ($(this).attr('data-pl')) { pl = $(this).attr('data-pl'); }

        pa = $(this).attr('data-pa');

        var lb = '';
        if ($(this).attr('data-lb')) {
            lb = $(this).attr('data-lb');
        }
        else {
            if ($(this).has("img").length > 0) {
                if ($(this).find('img').first().attr('alt')) {
                    lb = $(this).find('img').first().attr('alt');
                }
                else {
                    lb = $(this).find('img').first().attr('src');
                }
            }
            else {
                lb = $(this).text();
            }
        }

        if (debug === true) {
            alert(pa + ',' + pl + ',' + lb);
            return false;
        }

        ga('send', 'event', pa, pl, lb);
    });
}