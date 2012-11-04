var driverImpl = {
    search: function() {
        var result = {};
        $('.downloadList a').each(function() {
            result[$(this).html()] = $(this).attr('href');
        });

        return result;
    },

    getFileName: function(linkObj) {
        var url = linkObj.url;

        var ext = linkObj.title.split('-')[0].trim().toLowerCase();
        
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
