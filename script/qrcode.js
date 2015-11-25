/**
 * Created by Chen on 2015-11-21.
 */

var QRCode = function () {
    this.Analysis = function (codeStr) {
        var tmp = codeStr.split('://');
        var type = tmp[0];
        var code = tmp[1];
        if (type == 'user') {
            AddFriend(code);
        } else if (type == 'http' || type == 'https') {
            OpenWebsite(codeStr);
        } else {
            api.alert({msg: '未知的二维码类型:' + codeStr});
        }
    };

    /**
     * @return {string}
     */
    this.GenerateCode = function (type, str) {
        return type + "://" + str;
    };

    var AddFriend = function (userId) {
        //暂未实现
    };

    var OpenWebsite = function (url) {
        api.openWin({
            name : 'website',
            url : 'widget://html/browser/browser.html',
            pageParam : {
                url : url
            }
        })
    }
};