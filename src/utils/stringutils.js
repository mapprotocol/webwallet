if (!String.hasOwnProperty('contains')) {
  String['contains'] = function (str, target) {
    if (String.isEmpty(origin) || String.isEmpty(target)) {
      return false;
    }
    return str.indexOf(target) >= 0;
  }
  String.prototype.contains = function (target) {
    if (String.isEmpty(target)) {
      return false;
    }
    return this.indexOf(target) >= 0;
  }
}
if (!String['isEmpty']) {
    String['isEmpty'] = function (value) {
        if (value===undefined
            || value == null
            || value === ''
        ) {
            return true;
        }
        return false;
    };
    String['isNotEmpty'] = function (value) {
        return !String.isEmpty(value);
    };
}
if (!String['toUpperCase']) {
    String['toUpperCase'] = function (str) {
        if (String.isEmpty(str)) {
            return '';
        }
        return str.toUpperCase();
    };
}
if (!String['toLowerCase']) {
    String['toLowerCase'] = function (str) {
        if (String.isNotEmpty(str)) {
            return '';
        }
        return str.toLowerCase();
    };
}
if (!String['toTrimNum']) {
    String['toTrimNum'] = function (num) {
        if (typeof num != 'string') {
            num = num.toString();
        }
        return parseFloat(num);
    };
}
if (!String['toFixedNum']) {
    String['toFixedNum'] = function (num, limit) {
        if (String.isEmpty(num)) {
            return 0;
        }
        if (limit >= 0) {
            let temp = parseFloat(num);
            return temp.toFixed(limit);
        }
        return num;
    }
}
if (!String['toFoolNum']) {
    String['toFoolNum'] = function (num, limit) {
        if (String.isEmpty(num)) {
            return 0;
        }
        let temp = String(num);

        if (temp.indexOf(".")) {
            let strings = temp.split(".");
            let end = strings[1];
            if (end && end.length > limit) {
                temp = strings[0] + '.' + end.substr(0, limit);
            }
            return String.toFixedNum(temp, limit);
        } else {
            return num;
        }
    }
}
if (!String['formatDate']){
    String.prototype.formatDate=function(format){
        if (String.isEmpty(format)) {
            format = 'YY-MM-DD hh:mm:ss'
        }

        let timestamp=this;
        if (this.length !== 13) {
            timestamp = this.padEnd(13, "0");
        }
        let date = new Date(parseInt(timestamp));
        if (format.contains('YY')) {
            let Y = date.getFullYear();
            format = format.replace(/YY/, Y);
        }

        if (format.contains('MM')) {
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
            format = format.replace(/MM/, M);
        }

        if (format.contains('DD')) {
            let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
            format = format.replace(/DD/, D);
        }


        if (format.contains('hh')) {
            let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
            format = format.replace(/hh/, h);
        }

        if (format.contains('mm')) {
            let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
            format = format.replace(/mm/, m);
        }

        if (format.contains('ss')) {
            let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
            format = format.replace(/ss/, s);
        }
        return format;
    };
    String['formatDate']=function (ts,format) {
        let temp = String(ts);
        return temp.formatDate(format);
    }
}
if (!String['vague']){
    String.prototype.vague=function(subLength=4,symbol='*',symbolLength=4){
        if (this.length<length){
            length=this.length;
        }
        let end = '';
        for (let i = 0; i < symbolLength; i++) {
            end+= symbol;
        }
        let st= this.substr(0,subLength);
        return st+end;
    };
    String['vague']=function (st,length,symbol) {
        if (String.isEmpty(st)){
            return '';
        }
        return st.vague(length,symbol);
    }
}
if (!String['replace']){
    String['replaceMark']=function (str,obj,mark='$') {
        if (String.isEmpty(str)){
            return '';
        }
        if (obj == undefined){
            return str;
        }
        Object.keys(obj).forEach(function(key){
            if (obj[key] == undefined){
                obj[key] = '';
            }
            str = str.replace(`${mark}{${key}}`,obj[key])
        });
        return str;
    }
}
if (!String['isEmail']){
    String['isEmail']=function (str) {
        if (String.isEmpty(str)){
            return false;
        }
        let pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return pattern.test(str);
    }
    String.prototype.isEmail=function () {
        let pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return pattern.test(this);
    }
}
if (!String['toBuffer']){
    String['toBuffer']=function (value) {
      let wordarray = new Uint16Array(value.data);
      for (let i = 0; i < wordarray.length; i++) {
        wordarray[i] = wordarray[i] + 1;
      }
      return wordarray;
    };
}
