var driverImpl = {

    search: function(cb) {
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
        cb(result);
    }
};
