let DynimicResHolder = require("../DynimicResHolder");
let Base = require("../Base");
let TaskTimer = require("../../baseUtil/TaskTimer");
let animateJs = require("../../baseUtil/animateJs");
/**
 * 属于页面路由的一部分，负责具体加载，销毁页面和保存页面的引用
 * @param {*} router 
 * @param {*} rootNode 
 * @param {*} modal 
 */
function PageInstanceManager(router, rootNode, modal) {
    Base.call(this);
    this.rootNode = rootNode;
    this.instances = {};
    this.modal = modal;
    this.resourceHolder = new DynimicResHolder(this.rootNode, {
        "error": function () {
            this.modal.popUp("资源丢失了，请联系客服！");
        },
        errorContext: this
    });
    this.localResLoading = {};
    this.router = router;
    this.timer = new TaskTimer();
    let events = ["click", cc.Node.EventType.MOUSE_UP, cc.Node.EventType.MOUSE_DOWN,
        cc.Node.EventType.TOUCH_END, cc.Node.EventType.TOUCH_START
    ];
    let len = events.length;
    for (let i = 0; i < len; i++) {
        this.rootNode.on(events[i], function (e) {
            this.stopEvent(e);
        }, this);
    }
    this.pagePrefabs = {};
};
PageInstanceManager.prototype = {
    addPagePrefab: function (prefabs) {
        if (prefabs instanceof Array) {
            this.walkArray(prefabs, function (item) {
                if (item && item.alias && item.prefab instanceof cc.Prefab) {
                    this.pagePrefabs[item.alias] = item.prefab;
                } else {
                    console.error("传入的页面预制数据有误，页面别名", item.alias, ",实例数据", item.prefab);
                }
            }, this);
        } else if (prefabs && prefabs.alias && prefabs.prefab) {
            this.pagePrefabs[prefabs.alias] = prefabs.prefab;
        } else {
            console.error("传入的页面预制数据有误:", prefabs);
        }
    },
    _onPageShow: function (instance, data) {
        if (instance) {
            if (instance._isOnLoadCalled != 0) {
                let pageConfig = instance._pageConfig;
                if (pageConfig) {
                    data.pageName = pageConfig.pageName;
                    data.fullScreen = pageConfig.fullScreen;
                }
                this.showPage();
                instance._urlData = data;
                this.closeAllPage(data.url);
                if (this.checkNodeIsExist(instance.node)) {
                    this.router.trigger("beforeShowPage");
                    instance.onPageShow();
                    if (pageConfig && pageConfig.animation !== null) {
                        animateJs.openWindow(instance.node, function () {
                            this.router.trigger("afterShowPage");
                            this.router.trigger("pageLoaded");
                        }, this);
                    } else {
                        this.router.trigger("afterShowPage");
                        this.router.trigger("pageLoaded");
                    }
                } else {
                    this.router.trigger("pageLoaded");
                }
            } else {
                console.error("prefab组件", data.url, "onload还未初始化！");
                this.timer.setTimer(100, function () {
                    this._onPageShow(instance, data);
                }, this);
                return;
            }
        } else {
            console.error("传入的组件实例为null");
        }
    },
    loadPage: function (data) {
        let url = data.url;
        let instance = this.instances[url];
        if (instance && this.checkNodeIsExist(instance.node)) {
            this._onPageShow(instance, data);
        } else {
            this.createPage(url, data);
        }
    },
    getPage: function (url) {
        return this.instances[url];
    },
    showPage: function () {
        this.setActive(this.rootNode, true);
    },
    hidePage: function () {
        this.setActive(this.rootNode, false);
    },
    closePage: function () {
        this.closeAllPage();
        this.hidePage();
    },
    closeAllPage: function (url) {
        this.walkObject(this.instances, function (key, instance, object) {
            if (key != url && this.checkNodeIsExist(instance.node)) {
                if (instance._vState) {
                    if (instance._isOnLoadCalled != 0) {
                        instance.onPageHide();
                    } else {
                        this.setActive(instance.node, false);
                    }

                }
            }
        }, this);
    },
    loadPrefab: function (url, callBack, context) {
        if (this.pagePrefabs[url]) {
            callBack && callBack.call(context, true, this.pagePrefabs[url]);
        } else {
            this.resourceHolder.getLocalPrefab(url, function (status, prefab) {
                if (this.checkNodeIsExist(this.rootNode)) {
                    callBack && callBack.call(context, status, prefab);
                }
            }, this);
        }
    },
    createPage: function (url, data) {
        if (this.localResLoading[url]) {
            console.log("正在加载该资源：", url);
            return;
        }
        this.showPage();
        this.localResLoading[url] = true;
        this.loadPrefab(url, function (status, prefab) {
            this.localResLoading[url] = false;
            if (status) {
                this.instantiatePage(url, data, prefab);
            } else {
                console.error("加载资源：", url, "失败！");
                this.router.back();
            }
        }, this);
    },
    instantiatePage: function (url, data, prefab) {
        let node = cc.instantiate(prefab);
        node.parent = this.rootNode;
        let com = node.getComponent(cc.Component);
        if (com) {
            com.onPageLoaded(this.router, data);
            this.instances[url] = com;
            this._onPageShow(com, data);
        } else {
            console.error("预制：", url, "的脚本没有作为节点的第一个组件绑定！");
        }
    },
    preloadRes: function (resUrls) {
        if (resUrls instanceof Array) {
            let len = resUrls.length;
            for (let i = 0; i < len; i++) {
                this.resourceHolder.getLocalPrefab(resUrls[i]);
            }
        } else {
            this.resourceHolder.getLocalPrefab(resUrls);
        }
    },
    destroy: function () {
        this.walkObject(this.instances, function (key, instance, object) {
            if (this.checkNodeIsExist(instance.node)) {
                instance.node.destroy();
            }
        }, this);
        this.instances = {};
        timer.putTaskTimer(this.timer);
        this.resourceHolder.releaseAll();
    },
};
Base.prototype.grant(Base, PageInstanceManager);
module.exports = PageInstanceManager;