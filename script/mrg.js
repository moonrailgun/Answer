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
    api.toast({msg: '停止下载服务'});
    return;

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
//获取经济数据,如果没有则创建,回调参数为经济对象
function GetEconomy(func) {
    var score = 0;
    var userInfo = $api.getStorage('userInfo');
    if (userInfo) {
        var userId = userInfo.userId;
        var model = api.require('model');
        var query = api.require('query');
        query.createQuery(function (ret, err) {
            if (ret && ret.qid) {
                var queryId = ret.qid;
                query.whereEqual({
                    qid: queryId,
                    column: 'userId',
                    value: userId
                });
                query.justFields({
                    qid: queryId,
                    value: ['userId', 'score']
                });
                model.findAll({
                    class: "Economy",
                    qid: queryId
                }, function (ret, err) {
                    if (ret) {
                        if (ret.length == 0) {
                            //创建数据
                            model.insert({
                                class: 'Economy',
                                value: {
                                    userId: userId,
                                    score: 0
                                }
                            }, function (ret, err) {
                                if (ret) {
                                    var dat = {
                                        userId: userId,
                                        score: 0
                                    };
                                    func(dat)
                                } else {
                                    api.toast({msg: '错误，无法获取分数数据'});
                                }
                            });
                        } else {
                            var dat = ret[0];
                            func(dat);
                        }
                    } else {
                        api.toast({msg: '错误，无法获取分数数据'});
                    }
                });
            }
        });
    } else {
        api.toast({msg: '错误，无法获取分数数据'});
    }
}

//获取错题集资料
function GetUserWrongData(func) {
    var userId = $api.getStorage('userInfo')['userId'];
    if(userId){
        var query = api.require('query');
        query.createQuery(function (ret, err) {
            if (ret && ret.qid) {
                var queryId = ret.qid;
                query.whereEqual({
                    qid: queryId,
                    column: 'userId',
                    value: userId
                });
                var model = api.require('model');
                model.findAll({
                    class: "WrongSet",
                    qid: queryId
                }, function (ret, err) {
                    if (ret) {
                        var dat;
                        if (ret.length != 0) {
                            dat = {
                                userId: ret[0].userId,
                                wrongSet: ret[0].wrongSet,
                                wrongNumSum: ret[0].wrongNumSum
                            };
                            func(true,dat);
                        } else {
                            //创建错题集
                            dat = {
                                userId: userId,
                                wrongSet: [],
                                wrongNumSum: 0
                            };
                            model.insert({
                                class: 'WrongSet',
                                value: dat
                            },function(ret,err){
                                if(ret){
                                    func(true,dat);
                                }
                            });
                        }
                    } else {
                        func(false);
                    }
                });
            }
        });
    }else{
        func(false);
    }
}
//添加题目到错题本 参数为错题id数组
function AddItemToWrongSet(list,func) {
    var userId = $api.getStorage('userInfo')['userId'];
    if (userId) {
        var query = api.require('query');
        query.createQuery(function (ret, err) {
            if (ret && ret.qid) {
                var queryId = ret.qid;
                query.whereEqual({
                    qid: queryId,
                    column: 'userId',
                    value: userId
                });
                var model = api.require('model');
                model.findAll({
                    class: "WrongSet",
                    qid: queryId
                }, function (ret, err) {
                    if (ret) {
                        var dat = ret[0];
                        var wrongSet = dat.wrongSet;
                        for (var i = 0; i < list.length; i++) {
                            var questionId = list[i];
                            var tmp = {
                                id: questionId,
                                group: '默认',
                                num: 1
                            };
                            for (var j = 0; j < wrongSet.length; i++) {
                                if (questionId == wrongSet[j].id) {
                                    tmp = {
                                        id: wrongSet[j].id,
                                        group: wrongSet[j].group,
                                        num: wrongSet[j].num + 1
                                    };
                                    wrongSet.splice(j, 1);//删除原元素
                                    break;
                                }
                            }
                            wrongSet.push(tmp);
                        }

                        //将修改完毕的数据同步到远程
                        model.updateById({
                            class: 'WrongSet',
                            id: dat.id,
                            value: {
                                wrongSet: wrongSet
                            }
                        }, function (ret, err) {
                            if (ret) {
                                func(true);
                            }else{
                                func(false);
                            }
                        });
                    } else {
                        func(false);
                    }
                });
            }
        });
    }
}
//删除错题本内的错题 参数为题目id数组
function RemoveItemInWrongSet(list) {
    var userId = $api.getStorage('userInfo')['userId'];
    if (userId) {
        var query = api.require('query');
        query.createQuery(function (ret, err) {
            if (ret && ret.qid) {
                var queryId = ret.qid;
                query.whereEqual({
                    qid: queryId,
                    column: 'userId',
                    value: userId
                });
                var model = api.require('model');
                model.findAll({
                    class: "WrongSet",
                    qid: queryId
                }, function (ret, err) {
                    if (ret) {
                        var dat = ret[0];
                        var wrongSet = dat.wrongSet;
                        for (var i = 0; i < list.length; i++) {
                            for (var j = 0; j < wrongSet.length; i++) {
                                if (wrongSet[j].id == list[i]) {
                                    wrongSet.splice(j, 1);//删除该项
                                    break;
                                }
                            }
                        }

                        //将修改完毕的数据同步到远程
                        model.updateById({
                            class: 'WrongSet',
                            id: dat.id,
                            value: {
                                wrongSet: wrongSet
                            }
                        }, function (ret, err) {
                            if (!ret && err) {
                                api.toast({msg: '删除错题失败请重试:' + err.msg})
                            }
                        });
                    } else {
                        api.toast({msg: '删除错题失败请重试...'})
                    }
                });
            }
        });
    }
}
//获取错题数量
function GetItemNumInWrongSet(func){
    GetUserWrongData(function (state, data) {
        if(state){
            var num = 0;
            num = data['wrongSet'].length;
            func(state,num);
        }else{
            func(state);
        }
    });
}

//获取收藏数据
function GetFavorite(func) {
    var userInfo = $api.getStorage('userInfo');
    if (userInfo) {
        var userId = userInfo.userId;

        var query = api.require('query');
        query.createQuery(function (ret, err) {
            if (ret && ret.qid) {
                var queryId = ret.qid;
                query.whereEqual({
                    qid: queryId,
                    column: 'userId',
                    value: userId
                });
                var model = api.require('model');
                model.findAll({
                    class: "Favorite",
                    qid: queryId
                }, function (ret, err) {
                    if (ret) {
                        var dat = ret[0];
                        if (dat) {
                            var id = dat.id;
                            var questions = dat.questions;
                            var documents = dat.documents;
                            var favorite = {
                                id: id,
                                questions: questions,
                                documents: documents
                            };

                            $api.setStorage('favorite', favorite);

                            if (func && typeof func == 'function') {
                                func(favorite);
                            }
                        }
                    }
                });
            }
        });
    }
}
//添加到收藏
function AddFavour(id, type, obj) {
    var favorite = $api.getStorage('favorite');
    if (!favorite) {
        GetFavorite(AddFavour(id, type, obj));
        return;
    }
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

        //更新本地图标
        if (obj) {
            $api.removeCls(obj, 'aui-icon-favor');
            $api.addCls(obj, 'aui-icon-favorfill');
            $api.text(obj, '取消收藏')
        }

        //更新数据到远程数据库
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
                $api.setStorage('favorite', favorite);//将结果保存到本地
                api.toast({msg: '成功添加到收藏夹'});
            }
        });
    } else {
        api.toast({msg: '添加收藏失败,未知的收藏类型'});
    }
}
//取消收藏
function RemoveFavour(id, type, obj) {
    var favorite = $api.getStorage('favorite');
    if (!favorite) {
        GetFavorite(RemoveFavour(id, type, obj));
        return;
    }

    if (type == 'document' || type == 'question') {
        var documents = favorite.documents,
            questions = favorite.questions;

        var index = -1;
        if (type == 'document') {
            index = index = documents.indexOf(id);
            if (index >= 0) {
                documents.splice(index, 1);//删除该索引的元素
                documents.push(id);
            } else {
                api.toast({msg: '已删除该项目'});
                return;
            }
        }
        else if (type == 'question') {
            index = questions.indexOf(id);
            if (index >= 0) {
                questions.splice(index, 1);//删除该索引的元素
            } else {
                api.toast({msg: '已删除该项目'});
                return;
            }
        }

        //更新本地图标
        if (obj) {
            $api.removeCls(obj, 'aui-icon-favorfill');
            $api.addCls(obj, 'aui-icon-favor');
            $api.text(obj, '收藏')
        }

        //更新数据到远程数据库
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
                $api.setStorage('favorite', favorite);//将结果保存到本地
                api.toast({msg: '成功添加到收藏夹'});
            }
        });
    } else {
        api.toast({msg: '取消收藏失败,未知的收藏类型'});
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
    var favorite = $api.getStorage('favorite');
    var docFavorite = [];
    if (favorite) {
        docFavorite = favorite.documents;
    }

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
                    var favoriteStr = '<div><div class="aui-iconfont aui-icon-favor" onclick=\'AddFavour("' + id + '", "document", this);\'>收藏</div></div>';
                    if (docFavorite.length > 0 && docFavorite.indexOf(id) >= 0) {
                        favoriteStr = '<div><div class="aui-iconfont aui-icon-favorfill" onclick=\'RemoveFavour("' + id + '", "document", this);\'>取消收藏</div></div>';
                    }

                    str += '<li class="aui-list-view-cell documentList" onclick="SwitchDocListState(this)">'
                        + '<div class="docListTitle">' + name + '</div>'
                        + '<div class="docListOperate">'
                        + '<div><div class="aui-iconfont aui-icon-form" onclick=\'OpenDocumentFile("' + url + '", "' + name + '")\'>预览</div></div>'
                        + '<div><div class="aui-iconfont aui-icon-down" onclick=\'EnqueueFile("' + url + '", "' + name + '")\'>下载</div></div>'
                        + favoriteStr
                        + '</div></li>';
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

//没有该功能
function NoFunction(messgae) {
    var str = '';
    if (messgae) {
        str += messgae;
    } else {
        str += '抱歉该功能暂时还没有开放';
    }
    api.toast({msg: str});
}