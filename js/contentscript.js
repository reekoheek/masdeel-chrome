var urls = null;
try {
    urls = driverImpl.search();
} catch(e) {}

var toolbar = $('<div id="masdeel-toolbar"><a href="" id="masdeel-action">MasDeel</a></div>').appendTo('body');
var menu = $('<div id="masdeel-menu"></div>').appendTo(toolbar);

if (urls) {
    // chrome.extension.sendRequest({ message: 'addPageAction', urls: urls }, function(response) {});

    for(var i in urls) {
        menu.append('<a href="' + urls[i] + '" class="masdeel-link">' + i + '</a>');
    }

    $('.masdeel-link').click(function(evt) {
        chrome.extension.sendRequest({
            message: 'download',
            link: {
                pageUrl: location.href,
                url: $(this).attr('href'),
                fileName: driverImpl.getFileName({
                    url: $(this).attr('href'),
                    title: $(this).html()
                })
            }
        }, function(response) {

        });
        return evt.preventDefault();
    });

// } else {
//     menu.append('<a href="#" class="masdeel-link">Something</a>');
}

$('#masdeel-toolbar, #masdeel-toolbar *').hover(function() {
    $(this).addClass('hover');
}, function() {
    $(this).removeClass('hover');
});
