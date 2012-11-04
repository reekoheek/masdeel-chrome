var OPT = {

    restore: function () {
        return localStorage;
    },

    save: function (obj) {
        for(var i in obj) {
            localStorage[i] = obj[i];
        }
    }
};

$(function() {
    $('form').submit(function(evt) {
        var arr = $(this).serializeArray();
        var obj = {};
        for(var i in arr) {
            obj[arr[i].name] = arr[i].value;
        }
        OPT.save(obj);
        return evt.preventDefault();
    });

    var opts = OPT.restore();
    for(var i in opts) {
        $('form')[0][i].value = opts[i];
    }
});