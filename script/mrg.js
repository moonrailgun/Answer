/**
 * Created by Chen on 2015-10-30.
 */

//随机颜色类
function GetRandomValFromArray(arr) {
    var length = arr.length;
    var random = Math.random();//[0,1)
    var index = Math.floor(random * length);//[0,length-1]
    return arr[index];
}
function GetRandomValColor() {
    //随机返回数组中的一个值
    var randomColorCls = ['default', 'primary', 'success', 'info', 'warning', 'danger', 'blue', 'pink', 'dark'];
    return GetRandomValFromArray(randomColorCls);
}

//下载到缓存并打开文档
function OpenDocumentFile(url, name) {
    var temp = name.split('.');
    var type = temp[temp.length - 1];

    api.download({
        url: url,
        savePath: 'cache://' + name,
        report: true,
        cache: true,
        allowResume: false
    }, function (ret, err) {
        if (ret) {
            if (ret.state == 0) {
                api.showProgress({
                    style: 'default',
                    animationType: 'fade',
                    title: '正在打开...',
                    text: ret.percent + '%'
                });
            }
            else if (ret.state == 1) {
                api.hideProgress();
                if (type == 'doc' || type == 'docx' || type == 'xls' || type == 'xlsx' || type == 'txt') {
                    var docReader = api.require('docReader');
                    docReader.open({
                        path: 'cache://' + name
                    });
                }
                else if (type == 'pdf') {
                    var pdfReader = api.require('pdfReader');
                    pdfReader.open({
                        path: 'cache://' + name
                    });
                }
                else {
                    api.toast({
                        msg: '打开失败',
                        duration: 2000,
                        location: 'bottom'
                    });
                }
            }
            else if (ret.state == 2) {
                api.hideProgress();
                api.toast({
                    msg: '打开失败,无法打开后缀为' + type + '的文件',
                    duration: 2000,
                    location: 'bottom'
                });
            }
        } else {
            api.hideProgress();
            api.alert({msg: err.msg});
        }
    });
}
//添加到下载队列
function EnqueueFile(url, name) {
    var use3g = false;
    api.getPrefs({
        key: '3g'
    }, function (ret, err) {
        use3g = ret.value;
    });

    var networkType = 'wifi';
    if (use3g) {
        networkType = 'all';
    }

    var manager = api.require('downloadManager');
    manager.openManagerView({
        title: '下载管理'
    },function(ret){
        var id = ret.id;
        var mimeType = ret.mimeType;
        var savePath = ret.savePath;
        manager.openDownloadedFile({
            id: id
        },function(ret,err){
            if (ret.status) {

            } else {
                var msg = ret.msg;
            }
        });
    });
    manager.enqueue({
        url: url,
        savePath: 'fs://Document/' + name,
        cache: true,
        title: name,
        networkTypes: networkType
    }, function (ret, err) {
        if (ret.id) {
            api.toast({msg: '下载完毕'});
        }
    });
}