var driverImpl = {

    search: function() {
        var result = {};
        var flashvars = $('object#player param[name=flashvars]').attr('value').split('&');
        var flashvarsO = {};
        for(var i in flashvars) {
            var line = flashvars[i].split('=');
            var value = line.splice(1);
            flashvarsO[line[0]] = unescape(value.join('='));
        }
        console.log(flashvarsO);
        result[flashvarsO.title] = flashvarsO.srv + '/key=' + flashvarsO.file;
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
