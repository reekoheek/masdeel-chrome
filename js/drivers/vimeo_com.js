var driverImpl = {
    search: function(cb) {

        var d = {
            vimeoID: $('meta[property="og:video"]').attr('content').split('=')[1],
            quality: $('meta[itemprop=videoQuality]').attr('content').toLowerCase()
        };

        $('script').each(function() {
            var text = $(this).text();
            if (text.match(/signature/)) {
                text = 'var clip' + d.vimeoID + text.split('clip'+d.vimeoID)[1];
                text = text.split('};')[0] + '}';
                text = text.split(' = ')[1];
                eval('var data = ' + text);
                d.requestSignature = data.config.request.signature;
                d.requestSignatureExpires = data.config.request.timestamp;

            }
        });

        var url = "http://player.vimeo.com/play_redirect?clip_id=" + d.vimeoID + "&sig=" + d.requestSignature + "&time=" + d.requestSignatureExpires + "&quality=" + d.quality + "&codecs=H264,VP8,VP6&type=moogaloop_local&embed_location=";
        console.log(url);
        var result = {};
        result[d.vimeoID] = url;
        cb(result);
    },

    fetchExtension: function(linkObj) {
        return 'mp4';
    }
};