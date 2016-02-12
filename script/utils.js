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