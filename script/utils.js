/**
 * Created by Chen on 2016-02-09.
 */

var Utils = {
    /**
     * 补零
     * @return {string}
     */
    Supply: function (str, supplyStr, rightLength) {
        var text = str.toString();
        if (text.length < rightLength) {
            var temp = '';
            for (var i = 0; i < rightLength - text.length; i++) {
                temp += supplyStr;
            }
            text = temp + text;
        }
        return text;
    },
    /**
     * @return {string}
     */
    ParseTime: function (time) {
        var date = Date.parse(time);
        var now = Date.now();
        var diff = now - date;
        var diffSec = parseInt(diff / 1000);//间隔秒数
        var diffMin = parseInt(diffSec / 60);//间隔分钟
        var diffHour = parseInt(diffMin / 60);//间隔小时
        var diffDay = parseInt(diffHour / 24);//间隔天数

        var retStr = '';
        if (diffDay > 0) {
            if (diffDay == 1) {
                retStr = '昨天';
            } else {
                retStr = diffDay + " 天前";
            }
        } else if (diffHour > 0) {
            retStr = diffHour + " 小时前";
        }
        else if (diffMin > 0) {
            retStr = diffMin + " 分钟前";
        }
        else if (diffSec > 0) {
            retStr = diffSec + " 秒前";
        }
        else {
            retStr = '刚刚';
        }
        return retStr;
    },
    /**
     * @return {string}
     */
    GetTimeDate: function (time) {
        var date = new Date(time);
        return (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + this.Supply(date.getMinutes(), '0', 2) + ':' + this.Supply(date.getSeconds(), '0', 2);
    }
};

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern=function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "\u65e5",
        "1" : "\u4e00",
        "2" : "\u4e8c",
        "3" : "\u4e09",
        "4" : "\u56db",
        "5" : "\u4e94",
        "6" : "\u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
};