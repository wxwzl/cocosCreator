
let BaseComponent = require("../BaseComponent");
let pageRouter = require("./PageRouter");
/**
 * 页面路由的持有者。
 */
function PageScene(){

};
PageScene.prototype={
    getPageRouter:function(){
        return this.pageRouter;
    },
    initData:function(config){
        this.pageRouter = new pageRouter(this,config.pageRootNode,config.modal);
    },
}
module.exports = PageScene;
