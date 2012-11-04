var driverImpl = {

    search: function() {
        var result = {};
        var flashvars = $('embed').attr('flashvars').split('&');
        var flashvarsO = {};
        for(var i in flashvars) {
            var lines = flashvars[i].split('=');
            flashvarsO[lines[0]] = unescape(lines[1]);
        }
        result[flashvarsO['id_video']] = flashvarsO['flv_url'];
        return result;
    },

    getFileName: function(linkObj) {
        var url = linkObj.url;

        var file = linkObj.url.split('?')[0].split('/');
        file = file[file.length-1];
        var ext = file.split('.')[1];
        
        var q = location.search.substr(1).split('&');
        var qObj = {};
        for(var i = 0; i < q.length; i++) {
            var l = q[i].split('=');
            qObj[l[0]] = l[1];
        }
        
        var fileName = APP.options.file_name;
        fileName = fileName.replace('$HOSTNAME', location.host);
        fileName = fileName.replace('$TITLE', $('title').text());
        var token = fileName.match(/\$QS\[(.*)\]/);
        if (token) {
            fileName = fileName.replace(/\$QS\[(.*)\]/, qObj[token[1]] || '');
        }
        fileName = fileName.replace('$EXT', ext);
        return APP.options.download_dir + '/' + fileName;
    }
};
