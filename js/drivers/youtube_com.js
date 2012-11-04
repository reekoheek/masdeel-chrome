var driverImpl = {
    search: function() {
        var result = {};
        var i;
        var $embed = $('embed');
        if ($embed.length) {
            var flashvars = unescape($embed.attr('flashvars')).split('&');
            var flashvarsO = {};
            for(i = 0; i < flashvars.length; i++) {
                var line = flashvars[i];
                var lineArr = line.split('=');
                if (typeof(flashvarsO[lineArr[0]]) == 'undefined') {
                    flashvarsO[lineArr[0]] = [];
                }
                flashvarsO[lineArr[0]].push(unescape(lineArr[1]));
            }

            for(i = 0; i < flashvarsO['url'].length; i++) {
                result[flashvarsO['type'][i]] = flashvarsO['url'][i] + '&ptk=' + flashvarsO['ptk'][0] + '&signature=' + flashvarsO['sig'][i];
            }
        }

        return result;
    },

    getExtFromMime: function(mime) {
        var mimes = {
            'video/webm': 'webm',
            'video/x-flv': 'flv',
            'video/mp4': 'mp4',
            'video/3gpp': '3gp'
        };

        return mimes[mime] || 'flv';
    },

    getFileName: function(linkObj) {
        var url = linkObj.url;

        var ext = this.getExtFromMime(linkObj.title.split(';')[0]);
        
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
