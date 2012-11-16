var RC4  = {

    sbox: [0xFF],
    mykey: [0xFF],

    'encrypt': function(_arg1, _arg2) {
        var _local3 = this.strToChars(_arg1);
        var _local4 = this.strToChars(_arg2);
        var _local5 = this.calculate(_local3, _local4);
        return (this.charsToHex(_local5));
    },
    'decrypt': function(_arg1, _arg2){
        var _local3 = this.hexToChars(_arg1);
        var _local4 = this.strToChars(_arg2);
        var _local5 = this.calculate(_local3, _local4);
        return (this.charsToStr(_local5));
    },
    'initialize': function(_arg1){
        var _local3;
        var _local2 = 0;
        var _local4 = _arg1.length;
        var _local5 = 0;
        while (_local5 <= 0xFF) {
            this.mykey[_local5] = _arg1[(_local5 % _local4)];
            this.sbox[_local5] = _local5;
            _local5++;
        }
        _local5 = 0;
        while (_local5 <= 0xFF) {
            _local2 = (((_local2 + this.sbox[_local5]) + this.mykey[_local5]) % 0x0100);
            _local3 = this.sbox[_local5];
            this.sbox[_local5] = this.sbox[_local2];
            this.sbox[_local2] = _local3;
            _local5++;
        }
    },
    'calculate': function(_arg1, _arg2){
        var _local6;
        var _local7;
        var _local8;
        var _local10;
        this.initialize(_arg2);
        var _local3 = 0;
        var _local4 = 0;
        var _local5 = [];
        var _local9 = 0;
        while (_local9 < _arg1.length) {
            _local3 = ((_local3 + 1) % 0x0100);
            _local4 = ((_local4 + this.sbox[_local3]) % 0x0100);
            _local7 = this.sbox[_local3];
            this.sbox[_local3] = this.sbox[_local4];
            this.sbox[_local4] = _local7;
            _local10 = ((this.sbox[_local3] + this.sbox[_local4]) % 0x0100);
            _local6 = this.sbox[_local10];
            _local8 = (_arg1[_local9] ^ _local6);
            _local5.push(_local8);
            _local9++;
        }
        return (_local5);
    },
    'charsToHex': function(_arg1){
        var _local2 = "";
        var _local3 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
        var _local4 = 0;
        while (_local4 < _arg1.length) {
            _local2 = (_local2 + (_local3[(_arg1[_local4] >> 4)] + _local3[(_arg1[_local4] & 15)]));
            _local4++;
        }
        return (_local2);
    },
    'hexToChars': function(_arg1){
        var _local2 = [];
        var _local3 = ((_arg1.substr(0, 2))=="0x") ? 2 : 0;
        while (_local3 < _arg1.length) {
            _local2.push(parseInt(_arg1.substr(_local3, 2), 16));
            _local3 = (_local3 + 2);
        }
        return (_local2);
    },
    'charsToStr': function(_arg1){
        var _local2 = "";
        var _local3 = 0;
        while (_local3 < _arg1.length) {
            _local2 = (_local2 + String.fromCharCode(_arg1[_local3]));
            _local3++;
        }
        return (_local2);
    },
    'strToChars': function(_arg1){
        var _local2 = [];
        var _local3 = 0;
        while (_local3 < _arg1.length) {
            _local2.push(_arg1.charCodeAt(_local3));
            _local3++;
        }
        return (_local2);
    }

};

var driverImpl = {

    search: function(cb) {
        var result = {};
        var flashvars = $('object param[name=flashvars]').attr('value').split('&');
        var flashvarsO = {};
        for(var i in flashvars) {
            var line = flashvars[i].split('=');
            flashvarsO[line[0]] = unescape(line.splice(1).join('='));
        }
        
        $.get(flashvarsO.xmlfile, function(data) {
            var xml = RC4.decrypt(data, "RA#6P*Nq");
            var $xml = $(xml);
            $xml.find('video:first').children().each(function() {
                if ($(this)[0].tagName.match(/^FILE/)) {
                    result[$(this)[0].tagName] = $('<div>' + $(this).html() + '</div>').text();
                }
            });
            cb(result);
        });
    }
};
