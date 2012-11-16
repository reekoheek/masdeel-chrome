var APP = {
    options: localStorage
};

function isDriverExists(file) {
    return true;
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        var uris = tab.url.match(/^((http[s]?|ftp):\/\/)?\/?([^\/\.]+\.)*?([^\/\.]+\.[^:\/\s\.]{2,3}(\.[^:\/\s\.]‌​{2,3})?(:\d+)?)($|\/)([^#?\s]+)?(.*?)?(#[\w\-]+)?$/);
        if (uris) {
            hostname = uris[4] || '';
            var driverFile = hostname.split('.').join('_') + '.js';

            $.get('js/drivers/' + driverFile, function() {
                chrome.tabs.insertCSS(tabId, {file: 'css/contentscript.css'});
                chrome.tabs.executeScript(tabId, {code: 'APP = ' + JSON.stringify(APP) + ';', runAt: 'document_end'});
                chrome.tabs.executeScript(tabId, {file: 'js/jquery-1.8.2.min.js', runAt: 'document_end'});
                chrome.tabs.executeScript(tabId, {file: 'js/underscore-min.js', runAt: 'document_end'});
                chrome.tabs.executeScript(tabId, {file: 'js/drivers/' + driverFile, runAt: 'document_end' });
                chrome.tabs.executeScript(tabId, {file: 'js/contentscript.js', runAt: 'document_end'});
            });
        }
    }
});

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    var notification;

    switch (request.message) {
        case 'addPageAction':
            if (request.urls) {
                APP.urls = request.urls;
                chrome.pageAction.show(sender.tab.id);
                sendResponse({});
            }
            break;
        case 'download':
            if (request.link) {
                try {
                    Downloader.manager.download(request.link);
                    sendResponse({ error: null, link: request.link });
                    
                    notification = webkitNotifications.createNotification(
                        'img/icon48.png',
                        'Download Starting!',
                        'Your download starting, your file is ' + request.link.fileName + '.'
                    );
                    notification.show();
                } catch(e) {
                    sendResponse({ error: {message: 'Something error: ' + e.message, e: e }, link: request.link });

                    notification = webkitNotifications.createNotification(
                        'img/icon48.png',
                        'Download Error!',
                        'Something error: ' + e.message + '.'
                    );
                    notification.show();
                }
                setTimeout(function() {notification.cancel();}, 5000);
                var _onunload = window.onunload;
                window.onunload = function() {notification.cancel(); _onunload();};
            }
            break;
    }
    
});