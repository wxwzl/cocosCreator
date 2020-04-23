
let Base = require("../Base");
function Page(){
    Base.call(this);
};
Page.prototype = {
    loadPageConfig:function(config){
        let pageConfig = {};
        pageConfig.pageTitle = config.pageTitle;
        pageConfig.pageName = config.pageName;
        pageConfig.onHideDestroy = config.onHideDestroy;
        pageConfig.animation = config.animation;
        pageConfig.fullScreen = config.fullScreen;
        this._pageConfig = pageConfig;
    },
    getPageConfig:function(){
        return this._pageConfig;
    },
    setPageConfig:function(config){
        if( !this._pageConfig){
            this._pageConfig = {};
        }
        if(config){
            if(config.onHideDestroy!==undefined){
                this._pageConfig.onHideDestroy = config.onHideDestroy;
            }
        }
    },
    back:function(data){
        this._router.back(data);
    },
    /**
     * 获取当前页面所对应的路由管理器所在的js对象，
     */
    getPageScene:function(){
        if(this._router){
            return this._router.pageScene;
        }
    },
    // setPageParams:function(data){
    //      this._urlData.data = data;
    // },
    /**
     * 获取forword进来的data;
     */
    getPageParams:function(){
        if(this._urlData){
            return this._urlData.data;
        }
        return null;
    },
    onPageLoaded:function(router,data){
        this._urlData = data;
        this._router = router;
        this._vState = false;
    },
    /**
     * 当当前页由隐藏状态变为显示状态时调用一次。
     */
    onPageShow:function(){
        this.setActive(this.node,true);
        this._vState = true;
    },
    /**
     * 当当前页由显示状态变为隐藏状态时调用一次。
     */
    onPageHide:function(){
        this._vState = false;
        if(this._pageConfig.onHideDestroy){
            this.node.destroy();
            cc.sys.garbageCollect();
        }else{
            this.setActive(this.node,false);
        }
    },
};
module.exports = Page;
