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

//打开二维码扫码
function OpenScanner() {
    var scanner = api.require('FNScanner');
    scanner.openScanner({
        autorotation: true,
        saveToAlbum: false
    }, function (ret) {
        if (ret && (ret.eventType == 'success')) {
            alert(JSON.stringify(ret.content));
        }
        else if (ret && ret.eventType == 'fail') {
            api.alert('扫码失败。请重试');
        }
    });
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
    ShowDownloadManager();//打开下载管理页面
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
//添加到收藏
function AddFavour(id, type) {
    var userInfo = $api.getStorage('userInfo');
    if (userInfo.favorite) {
        var favorite = userInfo.favorite;
        if (type == 'document' || type == 'question') {
            var documents = favorite.documents,
                questions = favorite.questions;
            if (type == 'document') {
                if (documents.indexOf(id) < 0) {
                    documents.push(id);
                } else {
                    api.toast({msg: '已收藏该项目'});
                    return;
                }
            }
            else if (type == 'question') {
                if (questions.indexOf(id) < 0) {
                    questions.push(id);
                } else {
                    api.toast({msg: '已收藏该项目'});
                    return;
                }
            }
            var model = api.require('model');
            model.updateById({
                class: 'Favorite',
                id: favorite.id,
                value: {
                    questions: questions,
                    documents: documents
                }
            }, function (ret, err) {
                if (!ret) {
                    api.alert({msg: '出错' + JSON.stringify(err)});
                } else {
                    $api.setStorage('userInfo', userInfo);//将结果保存到本地
                    api.toast({msg: '成功添加到收藏夹'});
                }
            });
        } else {
            api.toast({msg: '添加收藏失败,未知的收藏类型'});
        }
    }
}
//切换列表
function SwitchDocListState(obj) {
    if ($api.hasCls(obj, 'actived')) {
        $api.removeCls(obj, 'actived');
    } else {
        $api.addCls(obj, 'actived');
    }
}

//生成文档列表
//dat 为列表数据数组，需要有成员name,url
function GenerateDocumentList($parent, dat) {
    if (arguments.length >= 2 && typeof dat == 'object') {
        if (dat.length == 0) {
            $api.html($parent, '<div style="text-align: center"><img src="../../image/nodata_s01.png"></div>');
        }
        else {
            var str = '<ul class="aui-list-view">';
            for (var i = 0; i < dat.length; i++) {
                if (dat[i]) {
                    var id = dat[i].id;
                    var url = dat[i].url;
                    var name = dat[i].name;
                    var uploadId = dat[i].uploadId;
                    str += '<li class="aui-list-view-cell documentList" onclick="SwitchDocListState(this)">'
                        + '<div class="title">' + name + '</div>'
                        + '<div class="operate">'
                        + '<div><div class="aui-iconfont aui-icon-form" onclick=\'OpenDocumentFile("' + url + '", "' + name + '")\'>预览</div></div>'
                        + '<div><div class="aui-iconfont aui-icon-down" onclick=\'EnqueueFile("' + url + '", "' + name + '")\'>下载</div></div>'
                        + '<div><div class="aui-iconfont aui-icon-favor" onclick=\'AddFavour("' + id + '", "document");\'>收藏</div></div>'
                        + '</div>';
                }
            }
            str += '</ul>';
            $api.html($parent, str);
        }
    }
}

//打开下载管理页面
function ShowDownloadManager() {
    var manager = api.require('downloadManager');
    manager.openManagerView({
        title: '下载管理'
    }, function (ret) {
        var id = ret.id;
        var mimeType = ret.mimeType;
        var savePath = ret.savePath;
        manager.openDownloadedFile({
            id: id
        }, function (ret, err) {
            if (ret.status) {

            } else {
                var msg = ret.msg;
            }
        });
    });
}
