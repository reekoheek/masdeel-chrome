var driverImpl = {
    search: function(cb) {
        var config = $('object param[name=flashvars]').attr('value').replace('config=', '');
        $.get(config, function(data) {
            cb({
                'URL': $(data).find('config file').text()
            });
        });
    }
};