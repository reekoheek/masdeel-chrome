var driverImpl = {
    search: function(cb) {
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

        cb(result);
    },

    fetchExtension: function(linkObj) {
        var mimes = {
            'video/webm': 'webm',
            'video/x-flv': 'flv',
            'video/mp4': 'mp4',
            'video/3gpp': '3gp'
        };

        return mimes[linkObj.title.split(';')[0]] || 'flv';
    }
};
