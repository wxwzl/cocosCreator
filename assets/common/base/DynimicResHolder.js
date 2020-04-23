function DynimicResHolder(node,config) {
    this.resource = {};
    this.node = node;
    if(config.error){
        this.errorCallBack = config.error;
        this.errorContext = config.errorContext;
    }
};
DynimicResHolder.prototype = {
    constructor: DynimicResHolder,
    addDynimicResUrl: function (url) {
        this.resource[url] = url;
    },
    getLocalRes: function (url, callBack) {
        this.addDynimicResUrl(url);
        cc.loader.loadRes(url, callBack);
    },
    getRemoteRes: function (url, callBack) {
        this.addDynimicResUrl(url);
        cc.loader.load(url, callBack);
    },
    getRemotePrefab: function (url, callBack, context) {
        let self = this;
        this.getRemoteRes(url, function (err, prefab) {
            if (self.checkNodeIsExist()!=true) {
                return ;
            }
            if (!err && prefab instanceof cc.Prefab) {
                callBack && callBack.call(context, true, prefab);
            } else {
                console.log("加载远程Prefab资源出错：", url);
                console.log("err:", err);
                callBack && callBack.call(context, false, prefab);
                self.errorCallBack&& self.errorCallBack.call(self.errorContext);
            }
        });
    },
    getLocalPrefab: function (url, callBack, context) {
        let self = this;
        this.getLocalRes(url, function (err, prefab) {
            if (self.checkNodeIsExist()!=true) {
                return ;
            }
            if (!err && prefab instanceof cc.Prefab) {
                callBack && callBack.call(context, true, prefab);
            } else {
                console.log("加载本地resources目录下Prefab资源出错：", url);
                console.log("err:", err);
                callBack && callBack.call(context, false, prefab);
                self.errorCallBack&& self.errorCallBack.call(self.errorContext);
            }
        });
    },
    getLocalSpriteAtlas:function(url, callBack, context){
        this.addDynimicResUrl(url);
        let self = this;
        cc.loader.loadRes(url, cc.SpriteAtlas, function (err, atlas) {
            if (self.checkNodeIsExist()!=true) {
                return ;
            }
            if (!err && atlas instanceof cc.SpriteAtlas) {
                callBack && callBack.call(context, true, atlas);
            } else {
                console.log("加载本地resources目录下图集资源出错：", url);
                console.log("err:", err);
                callBack && callBack.call(context, false, atlas);
                self.errorCallBack&& self.errorCallBack.call(self.errorContext);
            }
        });
    },
    getLocalSpriteFrame:function(url, callBack, context){
        this.addDynimicResUrl(url);
        let self = this;
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, atlas) {
            if (self.checkNodeIsExist()!=true) {
                return ;
            }
            if (!err && atlas instanceof cc.SpriteFrame) {
                callBack && callBack.call(context, true, atlas);
            } else {
                console.log("加载本地resources目录下图片资源出错：", url);
                console.log("err:", err);
                callBack && callBack.call(context, false, atlas);
                self.errorCallBack&& self.errorCallBack.call(self.errorContext);
            }
        });
    },
    getLocalSpriteAtlas:function(url, callBack, context){
        this.addDynimicResUrl(url);
        let self = this;
        cc.loader.loadRes(url, cc.SpriteAtlas, function (err, atlas) {
            if (self.checkNodeIsExist()!=true) {
                return ;
            }
            if (!err && atlas instanceof cc.SpriteAtlas) {
                callBack && callBack.call(context, true, atlas);
            } else {
                console.log("加载本地resources目录下图集资源出错：", url);
                console.log("err:", err);
                callBack && callBack.call(context, false, atlas);
                self.errorCallBack&& self.errorCallBack.call(self.errorContext);
            }
        });
    },
    release: function (url) {
        cc.loader.releaseRes(url);
        delete this.resource[url];
    },
    releaseAll: function () {
        let urls = Object.keys(this.resource);
        let len = urls.length;
        let url = null;
        for (let i = 0; i < len; i++) {
            url = urls[i];
            cc.loader.releaseRes(url);
            delete this.resource[url];
        }
    },
    checkNodeIsExist: function () {
        let node = this.node;
        if (node && node._components && cc.isValid(node,true)) {
            return true;
        }
        return false;
    },
};
module.exports = DynimicResHolder