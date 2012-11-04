

var Downloader = function(plugin) {
    this.plugin = plugin;
    if (this.progId) {
        this.npObject = this.plugin.CreateObject(this.progId);
    }
};
Downloader.prototype.download = function(linkObj) {
    console.log('download start');
};

var CurlDownloader = function() {
    this.command = 'curl -C - -L -o "$FILE_NAME" --referer "$REFERER" "$URL"';
    this.progId = 'curl';
    Downloader.apply(this, arguments);
};
CurlDownloader.prototype = new Downloader();

CurlDownloader.prototype.download = function(linkObj) {
    if (this.command) {
        var parameter = this.command.replace("$URL", linkObj.url);
        parameter = parameter.replace("$REFERER", linkObj.pageUrl);
        if (linkObj.fileName) {
            parameter = parameter.replace("$FILE_NAME", linkObj.fileName);
        }
        this.npObject.Download(parameter, linkObj.url);
    }
};

/*****************************************************************************/

Downloader.manager = {
    plugin: null,

    init: function(plugin) {
        this.plugin = plugin;
        // this.downloader = {};
        // this.downloader.curl = new CurlDownloader(plugin);
    },
    download: function(linkObj) {
        var downloader = new CurlDownloader(this.plugin);
        downloader.download(linkObj);
    }
};

function downloadCallback(retvalue, path) {
    console.log(retvalue, path);
    var notification = webkitNotifications.createNotification(
        'img/icon48.png',
        'Download Stopped!',
        'Your download stopped with status ' + retvalue + ', your file is ' + path + '.'
    );
    notification.show();
    setTimeout(function() {notification.cancel();}, 5000);
    var _onunload = window.onunload;
    window.onunload = function() {notification.cancel(); _onunload();};
}

var plugin = document.getElementById('pluginId');
Downloader.manager.init(plugin);

