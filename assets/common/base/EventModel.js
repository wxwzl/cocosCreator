function Event(name) {
    this.name = name;
    this.handlers = [];
};
Event.prototype = {
    constructor: Event,
    pushHandler: function (method, times,context) {
        var obj = {
            method: method,
            times: times,
            context:context
        };
        this.handlers.push(obj);
    },
    deleHandler: function (method) {
        var handlers = this.handlers;
        var len = handlers.length;
        var handler = null;
        for (var i = 0; i < len; i++) {
            handler = handlers[i];
            if (handler.method === method) {
                return this.handlers.splice(i, 1);
            }
        }
    },
    //注意传入的参数对象中的函数属性都不能被访问到。
    executeHandlers: function () {
        var params = [].slice.call(arguments, 0);
        var handlers = this.handlers;
        var handler = null;
        for (var i = 0; i < handlers.length; i++) {
            handler = handlers[i];
            var clone = JSON.parse(JSON.stringify(params));
            var context= handler.context?handler.context:window;
            if (isNaN(handler.times) === true||handler.times===null||handler.times===undefined) {
                handler.method.apply(context, clone);
            } else {
                if (handler.times > 0) {
                    handler.method.apply(context, clone);
                    handler.times--;
                }
                if (handler.times <= 0) {
                    handlers.splice(i, 1);
                    i--;
                }
            }
        }
    }
};
function EventModel(){
    this._events=[];
};
EventModel.prototype={
    constructor: EventModel,
    on:function(eventName,callBack,context,times){
        let temp = context;
        if(times && isNaN(times)){
            context = times;
            times = temp;
        }
        var eventNames = eventName.replace(/\s+/g, " ").split(" ");
         var events = this._events;
         var len = events.length;
         var event = null;
         var i = 0;
         for (; i < len; i++) {
             event = events[i];
             eventName = event.name;
             if (this.hasItem(eventNames, eventName)) {
                 if (callBack) {
                     event.pushHandler(callBack, times,context);
                 }
                 this.removeItem(eventNames, eventName);
             }
         }
         if (eventNames.length > 0) {
             for (i = 0; i < eventNames.length; i++) {
                 eventName = eventNames[i];
                 event = new Event(eventName);
                 if (callBack) {
                     event.pushHandler(callBack, times,context);
                 }
                 events.push(event);
             }
         }
         return this;
    },
    trigger:function(eventName,data){
        var params=[];
        if(arguments.length>1){
            params = [].slice.call(arguments, 1);
        }
        var events = this._events;
         var len = events.length;
         var event = null;
         for (var i = 0; i < len; i++) {
             event = events[i];
             if (event.name === eventName) {
                 event.executeHandlers.apply(event,params);
                 return;
             }
         }
    },
    off:function(eventName,handler){
        var events = this._events;
         var len = events.length;
         var event = null;
         var i = 0;
         for (; i < len; i++) {
             event = events[i];
             if (event.name === eventName) {
                 if(handler){
                    event.deleHandler(handler);
                 }else{
                     events.splice(i,1);
                 }
                 return event;
             }
         }
         return this;
    },
    clear:function(){
        this._events=[];
    },
    hasItem: function (array, item) {
        var len = array.length;
        for (var i = 0; i < len; i++) {
            if (array[i] === item) {
                return true;
            }
        }
        return false;
    },
    removeItem: function (array, item) {
        var len = array.length;
        for (var i = 0; i < len; i++) {
            if (array[i] === item) {
                return array.splice(i, 1);
            }
        }
    }
};
module.exports=EventModel;