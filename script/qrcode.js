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

    var OpenWebsite = function (url, isDirect) {
        //api.openWin({
        //    name: 'website',
        //    url : url
        //});
        api.confirm({
            msg: '检测到一个来自外部的网络连接地址,是否打开该网址？',
            buttons: ['否', '是']
        }, function (ret, err) {
            if (ret.buttonIndex == 2) {
                var platform = api.systemType;
                if (platform == 'ios') {
                    api.openApp({
                        iosUrl: url
                    });
                } else if (platform == 'android') {
                    api.openApp({
                        androidPkg: 'android.intent.action.VIEW',
                        mimeType: 'text/html',
                        uri: url
                    });
                } else {
                    api.alert({msg: '无法打开网页:' + url + ',不支持Windows系统'});
                }
            }
        });
    }
};