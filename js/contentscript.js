driverImpl = _.defaults(driverImpl, {
    fetchHost: function(linkObj) {
        return location.host;
    },

    fetchTitle: function(linkObj) {
        return $('title').text().replace(/[?\/\\:]/g, '-');
    },

    fetchQueryString: function(linkObj) {
        var q = location.search.substr(1).split('&');
        var qObj = {};
        for(var i = 0; i < q.length; i++) {
            var l = q[i].split('=');
            qObj[l[0]] = l[1];
        }
        return qObj;
    },

    fetchExtension: function(linkObj) {
        var file = linkObj.url.split('?')[0].split('/');
        file = file[file.length-1];
        return file.split('.')[1];
    },

    getFileName: function(linkObj) {
        var fileName = APP.options.file_name;
        
        fileName = fileName.replace('$HOSTNAME', this.fetchHost(linkObj));
        fileName = fileName.replace('$TITLE', this.fetchTitle(linkObj));

        var token = fileName.match(/\$QS\[(.*)\]/);
        if (token) {
            qObj = this.fetchQueryString(linkObj);
            fileName = fileName.replace(/\$QS\[(.*)\]/, qObj[token[1]] || '');
        }
        fileName = fileName.replace('$EXT', this.fetchExtension(linkObj));

        return APP.options.download_dir + '/' + fileName;
    }
});

driverImpl.search(function(urls) {
    var toolbar = $('<div id="masdeel-toolbar"><a href="" id="masdeel-action">MasDeel</a></div>').appendTo('body');
    var menu = $('<div id="masdeel-menu"></div>').appendTo(toolbar);

    if (urls) {
        // chrome.extension.sendRequest({ message: 'addPageAction', urls: urls }, function(response) {});

        for(var i in urls) {
            menu.append('<a href="' + urls[i] + '" class="masdeel-link">' + i + '</a>');
        }

        $('.masdeel-link').unbind('click').bind('click', function(evt) {
            evt.preventDefault();
            try {
                chrome.extension.sendRequest({
                    message: 'download',
                    link: {
                        pageUrl: location.href.split('#')[0],
                        url: $(this).attr('href'),
                        fileName: driverImpl.getFileName({
                            url: $(this).attr('href'),
                            title: $(this).html()
                        })
                    }
                }, function(response) {
                    
                });
            } catch(e) {
                console.error(e);
            }
            return false;
        });
    }

    $('#masdeel-toolbar, #masdeel-toolbar *').hover(function() {
        $(this).addClass('hover');
    }, function() {
        $(this).removeClass('hover');
    });

});