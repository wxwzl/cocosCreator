var  stringUtil={
     /**
     * 截取字符串，
     * @augments
     * str:需要被的字符串，为String类型
     * maxLength:截取的最大长度，
     * needDot:字符串超过最大长度时是否需要加...，true加，false:不加
     */
    substr: function substr(str, maxLength, needDot) {
        var _result = str || '';
        if (this.getLength(str) > maxLength) {
            var realLength = 0,
                len = str.length,
                charCode = -1,
                _subIndex;
            for (var i = 0; i < len; i++) {
                if (realLength >= maxLength) {
                    _subIndex = i;
                    break;
                }
                charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128) realLength += 1;else realLength += 2;
            }

            _result = str.substr(0, _subIndex);
            if (needDot === true) _result += '...';
        }
        return _result;
    },
    //获得字符串实际长度，中文2，英文1
    getLength: function getLength(str) {
        if (str == null || str == '') {
            return 0;
        }
        var realLength = 0,
            len = str.length,
            charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;else realLength += 2;
        }
        return realLength;
    },
    //截取真实字符串长度
    cutRealStr(str, cutLength){
        let resultsStr = '';
        if (str == null || str == '') {
            return resultsStr;
        }
        var realLength = 0,
            len = str.length,
            charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;else realLength += 2;
            resultsStr += realLength > cutLength ? "" : str.substr(i, 1);
        }
        return resultsStr;
    },
     /**
     * 根据当前代理商获取对应的名字
     */
    getUserName: function getUserName(info) {
        var _backName = '';
        let player=window[window.appName]?window[window.appName].player:"";
        if (info) {
            if (player) {
                if (player.lineId != info.lineId || player.agentId != info.agentId) {
                    _backName = info.username2;
                } else {
                    _backName = info.username;
                }
            } else {
                _backName = info.username;
            }
        }
        return _backName;
    },
     // ArrayBuffer转为字符串，参数为ArrayBuffer对象
    ab2str: function ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint16Array(buf));
    },


    // 字符串转为ArrayBuffer对象，参数为字符串
    str2ab: function str2ab(str) {
        var buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    },
    stringToByte(str) {
        var bytes = new Array();
        var len, c;
        len = str.length;
        for (var i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10FFFF) {
                bytes.push(((c >> 18) & 0x07) | 0xF0);
                bytes.push(((c >> 12) & 0x3F) | 0x80);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000800 && c <= 0x00FFFF) {
                bytes.push(((c >> 12) & 0x0F) | 0xE0);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000080 && c <= 0x0007FF) {
                bytes.push(((c >> 6) & 0x1F) | 0xC0);
                bytes.push((c & 0x3F) | 0x80);
            } else {
                bytes.push(c & 0xFF);
            }
        }
        return bytes;
    },
    byteToString(arr) {
        if (typeof arr === 'string') {
            return arr;
        }
        var str = '',
            _arr = arr;
        for (var i = 0; i < _arr.length; i++) {
            var one = _arr[i].toString(2),
                v = one.match(/^1+?(?=0)/);
            if (v && one.length == 8) {
                var bytesLength = v[0].length;
                var store = _arr[i].toString(2).slice(7 - bytesLength);
                for (var st = 1; st < bytesLength; st++) {
                    store += _arr[st + i].toString(2).slice(2);
                }
                str += String.fromCharCode(parseInt(store, 2));
                i += bytesLength - 1;
            } else {
                str += String.fromCharCode(_arr[i]);
            }
        }
        return str;
    },
    objToUrlParam:function(param){
        if(param==null||param==""){return null;}
        var str="";
        for(var key in param){
            str=str+key+"="+encodeURIComponent(param[key]+"&");
        }
        return str;
    },
    // rsaDecrypt:function(str){
    //     var publicKey="MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAJkxtwh8MKazuopu9pMfs7kDTGKA7QbdNk5scU1nvWVpx24tw2xdsQ+A6hywFjzgmb3HamZwsYN9RkA5gIqnWW+gWlIprBU36L8gOkxmijyRTZkoSL6eJtQyd1CXPRFTxiC0NMwstXrtibvkKZUP4w2oovR6Ya2oh0isbZil25QdAgMBAAECgYAuGI+CthvNjXcsAIehbYCewydQ3Ip17kpQ/sB5EiYjRdkEhjCvguGsUJYhW7rVRp/8Quz5Nh+z+RYSbTsIfaKjROYYaQcMIF1y83thVZeHA99hc72SMpJROkplwi9OuaOxhHDAXmJ2r2guBX2g2j/CVTGb0js8OhMv8eiEYDKAAQJBAMe5zlcVlRzVQzKjjnIfeMUNPia9MtHL1AiylVHuj72PV9n1+f4t6Bqt25NQWzE6R8yndcOdV2cB1AsO8Gn/IB0CQQDEW5dBMwuW2X2T4XRPRy/dnaas0B3QqKJSvmVS8xpX+V2sapW//gFMzFTexP78dRkV/FAInbko6mAa33VWDAQBAkA1b3LTPcT9R9mIrNWplt366oYcWzZDhyMdiJoGp6rxbm50tCjEZofYy3cZvMAJNayMBqmtQmVl+8k9hCuyUD3JAkEAjZIHvK9j9K/8dWmApUQLA7qNmF04kd9zoTq67RJvdOxKmGwEafdl0owjyLW5riVzH8HZpkypWhGZluZzv8VMAQJAEdcfLWJ4pa3zvlrvjdBSqT1lf6TSkRJpcx4/NWvRjtdttlX7lPDCZTIG8cvboC1S0wrM5WeahWT7xhASgAQNdA==";
    //     // if(!JSEncrypt.prototype.encryptLong){
    //     //     require("./EnhanceJSEncrypt");
    //     // }
    //     var encrypt=new JSEncrypt();
    //     encrypt.setPrivateKey(publicKey);
    //     return encrypt.decryptLong(str);
    // },
    // //  //RSA加密数据
    //  rsaEncrypt:function(str){
    //     var publicKey="MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZMbcIfDCms7qKbvaTH7O5A0xigO0G3TZObHFNZ71lacduLcNsXbEPgOocsBY84Jm9x2pmcLGDfUZAOYCKp1lvoFpSKawVN+i/IDpMZoo8kU2ZKEi+nibUMndQlz0RU8YgtDTMLLV67Ym75CmVD+MNqKL0emGtqIdIrG2YpduUHQIDAQAB";
    //     // if(!JSEncrypt.prototype.encryptLong){
    //     //     require("./EnhanceJSEncrypt");
    //     // }
    //     var encrypt=new JSEncrypt();
    //     encrypt.setPublicKey(publicKey);
    //     return encrypt.encryptLong(str);
    // //     var result=cryptico.encrypt(str, publicKey);
    // //     if(result.status==="success"){
    // //         return result.cipher;
    // //     }
    // //    return null;
    // },
    // rsaEncryptLong:function(str){
    //     var publicKey="MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCnrL23/5nMk0A2REFYL6Wpn1Oz1+pHGBL04UBPc9GDj5NPzksWTULKSyqFqydwxMUc08n9XauMPNOqlD8hVXzSyBdA54w1XSoWt9W1IVUDju7VYLcA5BOaOMFkcY8M7FAuePm5Qs9MPCCsxgX5TZSb26zLW/LHhUHNl6sYEiKWBQIDAQAB";
    //     var encrypt=new JSEncrypt();
    //     encrypt.setPublicKey(publicKey);
    //     return encrypt.encryptLong(str);
    // },
    // md5:function(str){
    //     var bytes=md5.digest(str);
    //     console.log("bytes:",bytes);
    //     // let hexStr="";
    //     // for (var i = 0; i < bytes.length; i++) {
    //     //     var val = bytes[i]& 0xff;
    //     //     if (val < 16) {
    //     //         hexStr=hexStr+"0";
    //     //     }
    //     //     hexStr=hexStr+val.toString(16);
    //     // }
    //     // return hexStr;
    //     return md5.hex(str);
    // },
};
module.exports=stringUtil;