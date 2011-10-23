var masdeel = {
	'splitAttr': function(attr) {
		attr = attr.split('&');
		var splitted = {};
		for(var i=0;i<attr.length;i++) {
			var tmp = attr[i].split('=');
			splitted[tmp[0]] = tmp[1];
		}
		return splitted;
	},
	'getFlashAttrs': function() {
		try {
			var attr = $('embed[flashvars]').attr('flashvars');
			if (typeof(attr) == 'undefined') {
				attr = $('object param[name=flashvars]').attr('value');
			}
			return this.splitAttr(attr);
		} catch(e) {}
	},
	'npapiDownload': function(param) {
		if (param.referer) {
			param.referer = location.href;
		}
		if (param.cookie) {
			param.cookie = document.cookie;
		}
		chrome.extension.sendRequest({'method': "download", 'param': param}, function(response) {
			
		});
	},
	'default': function(cb, ret) {
		var url = '';
		try {
			var attr = this.getFlashAttrs();
			url = attr['file'];
		} catch(e) {
			console.error(e);
		}
		
		if (typeof(cb) != 'undefined') {
			cb(url);
		} else {
			return url;
		}
	},
	'xhamster.com': function(cb) {
		var url = this['default']();
		console.log('http://xhamster.com/flv2/' + url);
		cb('http://xhamster.com/flv2/' + url);
	},
	'youporn.com': function(cb) {
		var url = $('#download a:first').attr('href');
		cb(url);
	},
	'xvideos.com': function(cb) {
		var attr = this.getFlashAttrs();
		cb(unescape(attr['flv_url']));
	},
	'tube8.com': function(cb) {
		var url = $('#downloadIconsBox a').attr('href');
		this.npapiDownload({url:url});
		//cb(url);
	},
	'video.xnxx.com': function(cb) {
		var attr = $('embed').attr('flashvars');
		attr = this.splitAttr(attr);
		cb(unescape(attr['flv_url']));
		
	},
	'free18.net': function(cb) {
		var attr = $('object param[name=flashvars]').attr('value');
		eval('attr = ' + attr);
		cb(attr.playlist[1].url);
	},
	'empflix.com': function(cb) {
		var attr = $('object#movie param[name=flashvars]').attr('value');
		attr = this.splitAttr(attr);
		console.log(attr);
		try {
			var param = {
				'async': false,
				'type': 'get',
				'url': unescape(attr.config),
				'dataType': 'text'
			};
			
			chrome.extension.sendRequest({'method': "xhr", 'param': param}, function(response) {
				var url = response.match(/<videoLink>(.*)<\/videoLink>/);
				cb(url[1]);
			});
		} catch(e) {
			alert(e); console.error(e);
		}
	},
	'tnaflix.com': function(cb) {
		var attr = $('object#flashMovie param[name=flashvars]').attr('value');
		attr = this.splitAttr(attr);
		try {
			var param = {
				'async': false,
				'type': 'get',
				'url': unescape(attr.config),
				'dataType': 'text'
			};
			
			chrome.extension.sendRequest({'method': "xhr", 'param': param}, function(response) {
				var url = response.match(/<videoLink>(.*)<\/videoLink>/);
				cb(url[1]);
			});
		} catch(e) {
			alert(e); console.error(e);
		}
	},
	'deviantclip.com': function(cb) {
		$('script').each(function(i, script) {
			var s = $(script).html().match(/{"file".*"}/);
			if (s) {
				eval('s = '+s);
				var url = unescape(s.file);
				cb(url);
				//masdeel.html5Download(url);
			}
		});
	},
	'youtube.com': function(cb) {
		var attr = $('embed#movie_player').attr('flashvars');
		attr = this.splitAttr(attr);
		var fmt_map = unescape(attr['url_encoded_fmt_stream_map']);
		var fmt_list = unescape(attr['fmt_list']).split(',');
		var biggest = -1;
		var biggest_size = 0;
		for (idx in fmt_list) {
			fmt_list[idx] = fmt_list[idx].split('/');
			fmt_list[idx][1] = fmt_list[idx][1].split('x');
			var dim = fmt_list[idx][1][0] * fmt_list[idx][1][1];
			if (dim > biggest_size) {
				biggest_size = dim;
				biggest = fmt_list[idx][0];
			}
		}
		fmt_map = this.splitAttr(fmt_map);
		fmt_map = unescape(fmt_map['url']);
		var url = fmt_map.replace(/itag=\d+&/, 'itag=' + biggest +'&');
		this.npapiDownload({ 'url': url });
		//cb(url);
	}
};

var loc = location.hostname.replace(/^www./i, '');

function getDownloadUrl(url) {
	try {
		if (typeof(url) == 'undefined' || url == null || url == '') {
			throw new Error();
		}
		console.info('Downloading ' + url + ' ..');
		$('body').append('<div class="masdeel-download"><a href="' + url + '">Download</a></div>');
		$('body').append('<iframe src="' + url + '" style="width:0px;height:0px"></iframe>');
	} catch(e) {
		alert(loc + ' currently is not supported!');
	}
}

try {
	if (masdeel[loc]) {
		masdeel[loc](getDownloadUrl);
	} else {
		masdeel['default'](getDownloadUrl);
	}
} catch(e) {
	console.log(e);
	alert(loc + ' currently is not supported!');
}
