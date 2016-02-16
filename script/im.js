/**
 * Created by Chen on 2016-02-16.
 */

(function(window){
    var rongcloud_im = {
        appKey: '',
        appSecret: '',
        init: function(appKey, appSecret){
            this.appKey = appKey;
            this.appSecret = appSecret;
        },
        getUserToken : function (userId, name, callback) {
            if(!!this.appKey && !! this.appSecret){
                var appKey = this.appKey;
                var Nonce = Math.floor(Math.random() * 1000000);
                var Timestamp = new Date().getTime();
                var AppSecret = this.appSecret;
                var Signature = hex_sha1(AppSecret + Nonce + Timestamp);
                api.ajax({
                    url : 'https://api.cn.ronghub.com/user/getToken.json',
                    method : 'post',
                    headers : {
                        "App-Key" : appKey,
                        "Nonce" : Nonce,
                        "Timestamp" : Timestamp,
                        "Signature" : Signature,
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data : {
                        values:{
                            "userId" : userId,
                            "name" : name
                        }

                    }
                }, callback);
            }
        }
    };

    window.rongcloud_im = rongcloud_im;
})(window);
