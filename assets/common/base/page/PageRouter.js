let Stack = require("../Stack");
let Queue = require("../Queue");
let PageInstanceManager = require("./PageInstanceManager");
let EventModel = require("../EventModel");
function Url(url,data){
    this.url = url;
    this.data = data;
   
}
function PageAction(method,params){
    this.method = method;
    this.param = params;
};
function PageRouter(pageScene,rootNode,modal){
    this.pageScene = pageScene;
    this.lastPage = null;
    this.pageStack = new Stack();
    this.pageInstance = new PageInstanceManager(this,rootNode,modal);
    this.isShowing = false;
    EventModel.call(this);
    this.closePage();
    this.loading = false;
    this.actionQueue = new Queue();
    this.on("pageLoaded",function(){
        this.loading = false;
        let action = this.actionQueue.out();
        if(action){
            if(this[action.method] instanceof Function){
                this[action.method].apply(this,action.param);
            }else{
                this.trigger("pageLoaded");
            }
        }
    },null,this);
};
PageRouter.prototype = {
    /**
     * 参数是一个对象{alias:"modifyPhoneNumber",prefab:},或者是由上述对象构成的数组
     */
    addPagePrefab:function(prefabs){
        this.pageInstance.addPagePrefab(prefabs);
    },
    /**
     * 获取当前页面的继承于Page实例的js对象
     */
    getCurrentPageInstnce:function(){
        let data = this.pageStack.top();
        if(data){
            return this.pageInstance.getPage(data.url);
        }else{
            return null;
        }
        
    },
    /**
     * 判断当前页面是不是name这个目标页面
     */
    currentPageIsName:function(name){
        if(!name){
            return false;
        }
        let names = [];
        if( name instanceof Array){
            names = name;
        }else{
            names.push(name);
        }
        let currentPageInstance = this.getCurrentPageInstnce();
        if(currentPageInstance){
            if(currentPageInstance && currentPageInstance.node){
                let name = currentPageInstance.node.name;
                if(names.indexOf(name)>=0){
                    return true;
                }
            }
        }
        return false;
    },
    loadPage:function(){
        let data = this.pageStack.top();
        if(data){
            this.isShowing = true;
            this.pageInstance.loadPage(data);        
            return this;
        }else{
            console.error("url为undefined");
        }
    },
    /**
     * 隐藏路由根页面，原来已打开的子页面不隐藏，所有处于显示状态的页面不会调用onPageHide方法
     */
    hidePage:function(){
        this.isShowing = false;
        this.pageInstance.hidePage();
    },
     /**
     * 显示路由根页面，子页面的状态保持在hidePage方法执行时的状态
     */
    showPage:function(){
        this.isShowing = true;
        this.pageInstance.showPage();
    },
    /**
     * 隐藏路由根页面并关闭所有子页面，所有处于显示状态的页面会调用onPageHide方法
     */
    closePage:function(){
        this.clear();
        this.isShowing = false;
        this.pageInstance.closePage();
        this.trigger("closePage");
        this.trigger("pageLoaded");
    },
    go:function(url,data){
    },
    /**
     * 回到上一页
     */
    back:function(data){
        let methodName = "back";
        if(this.dealActionCache(methodName,data)){
            this.lastPage = this.pageStack.pop();
            if(this.size()>0){
                let url = this.pageStack.top();
                if(data){
                    url.data = data;
                }
                this.loadPage();
            }else{
                this.closePage(data);
            }
            this.trigger(methodName);
        }
        return this;
    },
    /**
     * 往前走一页
     */
    forward:function(url,data){
        let methodName = "forward";
        if(this.dealActionCache(methodName,url,data)){
            this.lastPage = this.pageStack.top();
            this.pageStack.push(new Url(url,data));
            this.loadPage();
            this.trigger(methodName);
        }
        return this;
    },
    /**
     * 替换当前页
     */
    replace:function(url,data){
        let methodName = "replace";
        if(this.dealActionCache(methodName,url,data)){
            this.lastPage = this.pageStack.pop();
            this.pageStack.push(new Url(url,data));
            this.loadPage();
            this.trigger(methodName);
        }
        return this;
    },

    reload:function(){
        // this.showPage();
    },
    size:function(){
        return this.pageStack.size();
    },
    push:function(url,data){
        this.pageStack.push(new Url(url,data));
        return this;
    },
    clear:function(){
       let array = this.pageStack.clear();
       return this;
    },
    destroy:function(){
        this.clear();
        this.actionQueue.clear();
        this.pageInstance.destroy();
        return this;
    },
    preloadRes:function(resUrls){
        this.pageInstance.preloadRes(resUrls);
        return this;
    },
    dealActionCache:function(methodName,url,data){
        if(this.loading){
            let params = Array.prototype.slice.call(arguments,1);
            this.actionQueue.push(new PageAction(methodName,params));
            return false;
        }else{
            this.loading = true;
            return true;
        }
    },
};
PageInstanceManager.prototype.grant(EventModel,PageRouter);
module.exports = PageRouter;