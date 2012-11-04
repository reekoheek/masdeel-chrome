var bgPage = chrome.extension.getBackgroundPage();
if (bgPage.APP.urls) {
    for(var i in bgPage.APP.urls) {
        $('#download-list').append('<div><a href="' + bgPage.APP.urls[i] + '">' + i + '</a></div>');
    }
}
