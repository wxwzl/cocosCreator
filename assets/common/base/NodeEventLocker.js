const TaskTimer = require("../baseUtil/TaskTimer");

function NodeEvent(targetNode, callBack, context, config, params) {
    this.targetNode = targetNode;
    this.method = callBack;
    this.context = context;
    this.config = config;
    this.params = params;
};

function NodeEventLocker(cacheTime) {
    this.events = {};
    this.timers = {};
    if(typeof cacheTime != "number"){
        cacheTime = 150;
    }
    this.cacheTime = cacheTime;//milisecond,定时器的缓冲时间
};

NodeEventLocker.prototype = {
    /**
     * 
     */
    addNodeEvent: function (targetNode, eventName, callBack, context, config) {
        let timers = this.timers;
        if (!timers[eventName]) {
            timers[eventName] = new TaskTimer();
        }
        if (!config || config.notRemoveEvent != true) {
            targetNode.off(eventName);
        }
        targetNode.on(eventName, function (e) {
            let events = this.events;
            if (!events[eventName]) {
                events[eventName] = [];
            }
            let params = Array.prototype.slice.call(arguments, 0);
            let nodeEvent = new NodeEvent(targetNode, callBack, context, config, params);
            events[eventName].push(nodeEvent);
            this.stopEvent(e);
            let timer = this.timers[eventName];
            if(timer){
                timer.setTimer(this.cacheTime, function () {
                    this.excuteEventCallBack(eventName);
                }, this);
            }
        }, this);
        return this;
    },
    excuteEventCallBack: function (eventName) {
        let nodeEvents = this.events[eventName];
        if(nodeEvents&&nodeEvents.length>0){
            let nodeEvent = nodeEvents[0];
            if(nodeEvent&&this.checkNodeIsExist(nodeEvent.targetNode)){
                this.excuteNodeEvent(nodeEvent);
            }
            nodeEvents.length = 0;
        }
    },
    stopEvent: function (e) {
        if (e && e.stopPropagation) {
            e.stopPropagationImmediate();
            e.stopPropagation();
        }
    },
    checkNodeIsExist: function (node) {
        if (node && node._components && cc.isValid(node,true)) {
            return true;
        }
        return false;
    },
    excuteNodeEvent: function (nodeEvent) {
        if (nodeEvent) {
            let method = nodeEvent.method;
            let context = nodeEvent.context;
            let params = nodeEvent.params;
            if (method instanceof Function) {
                method.apply(context, params);
            } else {
                console.error(nodeEvent, method, "不是一个函数！");
            }
        }
    },
    destroy:function(){
        this.clearEventTimers();
        this.clearNodeEvents();
    },
    clearNodeEvents:function(){
        this.events = {};
    },
    clearEventTimers:function(){
        this.walkObject(this.timers,function(key,timer){
            if(timer){
                timer.clearTimer();
            }
        },this);
        this.timers = {};
    },
    walkObject: function (object, handler, context) {
        let keys = Object.keys(object);
        let len = keys.length;
        if (len > 0) {
            let key = null;
            let value = null;
            for (let i = 0; i < len; i++) {
                key = keys[i];
                value = object[key];
                if (handler) {
                    let isStop = handler.call(context, key, value, object);
                    if (isStop) {
                        return isStop;
                    }
                }

            }
        }
    },
};

module.exports = NodeEventLocker;