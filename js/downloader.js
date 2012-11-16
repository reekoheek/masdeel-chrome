

var Downloader = function(plugin) {
    this.plugin = plugin;
    if (this.progId) {
        this.npObject = this.plugin.CreateObject(this.progId);
    }
};
Downloader.prototype.download = function(linkObj) {
    console.log('download start');
};

var CLIDownloader = function() {
    // this.command = 'curl -C - -L -o "$FILE_NAME" --referer "$REFERER" "$URL"';
    this.command = 'wget -U "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11" --referer="$REFERER" -c "$URL" -O "$FILE_NAME"';
    // this.progId = 'curl';
    this.progId = 'cli';
    Downloader.apply(this, arguments);
};
CLIDownloader.prototype = new Downloader();

CLIDownloader.prototype.download = function(linkObj) {
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
        // this.downloader.curl = new CLIDownloader(plugin);
    },
    download: function(linkObj) {
        var downloader = new CLIDownloader(this.plugin);
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

