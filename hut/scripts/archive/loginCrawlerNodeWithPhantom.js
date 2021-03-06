// reference: https://github.com/sgentle/phantomjs-node

var phantom = require('phantom');

phantom.create(function(ph) {
    var urlLogin = 'http://recreation.forest.gov.tw/personal/Personal_index.aspx';
    var urlHut = 'http://recreation.forest.gov.tw/askformonhouse/AskForPaperAddNew.aspx?mode=0&AskSID=&houseid=C';
    // var urlJQ = 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js';
    var urlJQ = 'http://code.jquery.com/jquery-2.1.3.min.js';
    var countOnLoadFinished = 0;
    ph.createPage(function(page) {

        page.set('onLoadFinished', function(status) {
            console.log('onLoadFinished: ' + countOnLoadFinished + ' ' + status);
            switch (countOnLoadFinished) {
                case 1:
                    page.open(urlHut, function(status) {
                        page.includeJs(urlJQ, function() {
                            page.evaluate(parserFunction, function(huts) {
                                console.log(huts);
                                page.evaluate(function() {
                                    $('#eventscalendar_ctl00_NextMonth').click();
                                });
                            });
                        });
                    });
                    break;
                case 2:
                    page.includeJs(urlJQ, function() {
                        page.evaluate(parserFunction, function(huts) {
                            console.log(huts);
                            ph.exit();
                        });
                    });
                    break;
            }
            countOnLoadFinished++;
        });

        page.open(urlLogin, function(status) {
            console.log('login page opened: ', status);
            page.includeJs(urlJQ, function() {
                page.evaluate(function() {
                    $('#ContentPlaceHolder1_ID_TextBox').val('joshuayes@gmail.com');
                    $('#ContentPlaceHolder1_Pass_TextBox').val('jojo782011');
                    $('#ContentPlaceHolder1_login_button').click();
                });
                // return document.title;
                // }, function(gg) {
                // console.log(gg);
                // });
            });
        });
    });
});


var parserFunction = function() {
    // Check the month
    var monthZH = $('#eventscalendar_ctl00_label2').text().split(' ')[0];
    var month = 0;
    switch (monthZH) {
        case '一月':
            month = 1;
            break;
        case '二月':
            month = 2;
            break;
        case '三月':
            month = 3;
            break;
        case '四月':
            month = 4;
            break;
        case '五月':
            month = 5;
            break;
        case '六月':
            month = 6;
            break;
        case '七月':
            month = 7;
            break;
        case '八月':
            month = 8;
            break;
        case '九月':
            month = 9;
            break;
        case '十月':
            month = 10;
            break;
        case '十一月':
            month = 11;
            break;
        case '十二月':
            month = 12;
            break;
    }

    // Check days one by one
    var huts = [];
    var dayPre = 0;
    $('.dayNumber').each(function(i) {
        // Calculate the date
        var day = parseInt($(this).text());
        if (i == 0) {
            if (day != 1) {
                month--;
            };
        } else {
            if (day < dayPre) {
                month++;
            };
        };
        dayPre = day;

        // Record if there is data
        if ($(this).parent().children().length > 1) {
            var date = new Date();
            date.setMonth(month - 1);
            date.setDate(day);
            var remaining = $(this).parent().find('#eventscalendar_Label1_0').html().split('<br>')[1].split(':')[1];
            var applying = $(this).parent().find('#eventscalendar_Label1_0').html().split('<br>')[2].split(':')[1];
            huts.push({
                'date': date,
                'remaining': remaining,
                'applying': applying
            });

        };
    });
    return huts;
}
