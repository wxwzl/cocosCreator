let Base = require("../base/Base");
function Animation(){
  
};
Animation.prototype={
    constructor: Animation,
    getComponent:function(){
        return cc.find("Canvas")._components[0];
    },
    //time为秒数
    easeAnimate:function(array,animation,time,animationParam,callBack,param,context){
        let component=this.getComponent();
        let len=array.length;
        if(len===0){
            callBack&&callBack.call(context,param);
            return;
        }
        let i=0;
        let aniContext=animationParam.context;
        if(aniContext===undefined)aniContext=this;
        component.schedule(function() {
            if(i<(array.length-1) && array[i]){
                animation.call(aniContext,array[i],animationParam);
                i++;
            }else{
                if(array[array.length-1]){
                    animation.call(aniContext,array[array.length-1],animationParam,callBack,param,context);
                }else{
                    callBack&&callBack.call(context,param);
                }
            }
        }, time, len-1);
    },
    randomEaseAnimate:function(array,animation,minTime,maxTime,animationParam,callBack,param,context){
        let component=this.getComponent();
        let len=array.length;
        if(len===0){
            callBack&&callBack.call(context,param);
            return;
        }
        let i=0;
        let aniContext=animationParam.context;
        if(aniContext===undefined)aniContext=this;
        let time=0;
        let dt=maxTime-minTime;
        for(let i=0;i<len-1;i++){
            let temp=minTime+Math.random()*dt;
            temp=time+this.getRoundNumber(temp,3);
            time=this.getRoundNumber(temp);
            excuteAnimation(array[i],time);
        }
        excuteAnimation(array[len-1],time,callBack,param,context);
        function excuteAnimation(node,time,callBack,param,context){
            component.scheduleOnce(function() {
                if(node){
                    animation.call(aniContext,node,animationParam,callBack,param,context);
                }
            }, time);
        }
    },
    excuteAnimation:function(array,animation,animationParam,callBack,param,context){
        let component=this.getComponent();
        let len=array.length;
        if(len===0){
            callBack&&callBack.call(context,param);
            return;
        }
        let i=0;
        let aniContext=animationParam.context;
        if(aniContext===undefined)aniContext=this;
        for(let i=0;i<len-1;i++){
            excuteAnimation(array[i]);
        }
        excuteAnimation(array[len-1],callBack,param,context);
        function excuteAnimation(node,callBack,param,context){
            if(node){
                animation.call(aniContext,node,animationParam,callBack,param,context);
            }
        }
    },
    getRoundNumber:function(num,number){
        if(number===undefined)number=2;
        return (Math.round(Math.pow(10,number)*num))/Math.pow(10,number);
    },
    openWindow:function(node,callBack,context){
        node.setScale(0.8);
        let args = [].slice.call(arguments, 3);
        let callFun=cc.callFunc(function(){
            if(typeof callBack == "function"){
                callBack&&callBack.apply(context,args);
            }
        },context);
        var seq = cc.sequence(cc.scaleTo(0.1, 1, 1),callFun);
        seq.easing(cc.easeIn(0.3))
        node.runAction(seq);
    },
    addButtonEventEffect:function(node,config){
        if(!this.checkNodeIsExist(node)){
            return this;
        }
        let button = this.takeComponent(node, cc.Button);
        if (!button) {
            button = node.addComponent(cc.Button);
        }
        button.transition = cc.Button.Transition.SCALE;
        button.duration = 0.1;
        button.zoomScale = 0.8;
        let transition = {};
        if(config){
            if(config.transition!=undefined){
                button.transition = config.transition;
            }
            if(config.duration!=undefined){
                button.duration = config.duration;
            }
            if(config.zoomScale!=undefined){
                button.zoomScale = config.zoomScale;
            }
        }
        return this ;
    },
    /** 
     * 渐隐进入效果
     * target:目标节点
     * data={
     * idx:从哪个方向进入（0,1,2,3）上下左右(默认为上方)
     * time：延时时间(默认为不延时)
     * isTremble:是否有弹性效果(true为具有回弹，默认不具有回弹)
     * }
     */
    fadeInTremble(target,data) {
        let idx = data.idx?data.idx:0;
        let time = data.time?data.time:0;
        let isTremble = data.isTremble?data.isTremble:false;
        let action
        switch (idx) {
            case 0:
            if(isTremble){
                action = cc.sequence(
                cc.callFunc(()=>{target.opacity = 0}),
                cc.moveBy(0, 0, 100),
                cc.delayTime(time),
                cc.spawn(cc.fadeIn(0.3),cc.moveBy(0.3, 0, -110)), 
                cc.moveBy(0.3, 0, 18), 
                cc.moveBy(0.3, 0, -13), 
                cc.moveBy(0.3, 0, 5)
                );
            }else{
                action = cc.sequence(
                cc.callFunc(()=>{target.opacity = 0}), 
                cc.moveBy(0, 0, 100), 
                cc.delayTime(time), 
                cc.spawn(cc.fadeIn(0.3), cc.moveBy(0.3, 0, -100))
                );
            }
                break;
            case 1:
            if(isTremble){
                action = cc.sequence(
                cc.callFunc(()=>{target.opacity = 0}),
                cc.moveBy(0, 0, -100),
                cc.delayTime(time), 
                cc.spawn(cc.fadeIn(0.3), cc.moveBy(0.3, 0, 110)), 
                cc.moveBy(0.3, 0, -18), 
                cc.moveBy(0.3, 0, 13), 
                cc.moveBy(0.3, 0, -5)
                );
            }else{
                action = cc.sequence(
                cc.callFunc(()=>{target.opacity = 0}), 
                cc.moveBy(0, 0, -100), 
                cc.delayTime(time), 
                cc.spawn(cc.fadeIn(0.3), cc.moveBy(0.3, 0, 100))
                );
            }
                break;
            case 2:
            if(isTremble){
                action = cc.sequence(
                cc.callFunc(()=>{target.opacity = 0}),
                cc.moveBy(0, -100, 0),
                cc.delayTime(time), 
                cc.spawn(cc.fadeIn(0.3), cc.moveBy(0.3, 110, 0)), 
                cc.moveBy(0.3, -18, 0), 
                cc.moveBy(0.3, 13, 0), 
                cc.moveBy(0.3, -5, 0)
                );
            }else{
                action = cc.sequence(
                cc.callFunc(()=>{target.opacity = 0}), 
                cc.moveBy(0, -100, 0), 
                cc.delayTime(time),
                cc.spawn(cc.fadeIn(0.3), cc.moveBy(0.3, 100, 0))
                );
            }
                break;
            case 3:
            if(isTremble){
                action = cc.sequence(
                cc.callFunc(()=>{target.opacity = 0}),
                cc.moveBy(0, 100, 0),
                cc.delayTime(time), 
                cc.spawn(cc.fadeIn(0.3), cc.moveBy(0.3, -110, 0)), 
                cc.moveBy(0.3, 18, 0), 
                cc.moveBy(0.3, -13, 0), 
                cc.moveBy(0.3, 5, 0)
                );
            }else{
                action = cc.sequence(
                cc.callFunc(()=>{target.opacity = 0}), 
                cc.moveBy(0, 100, 0), 
                cc.delayTime(time), 
                cc.spawn(cc.fadeIn(0.3), cc.moveBy(0.3, -100, 0))
                );
            }
                break;
            default:
                return;
        }
        target.runAction(action);
    },
    moveUpFadeOut:function(node,config){
        // let position = node.getPosition();
        let time = 1;
        let callBack = null;
        let context = null;
        if(config){
            if(this._isDefined(config.time)){
                time = config.time;
            }
            if(this._isDefined(config.callBack)){
                callBack = config.callBack;
            }
            if(this._isDefined(config.context)){
                context = config.context;
            } 
        }
        let action = cc.sequence(
            cc.spawn(cc.fadeOut(time),cc.moveBy(time, 0, 150)),
            cc.callFunc(function(){
                callBack&&callBack.call(context);
            },context), 
        );
        node.runAction(action);
    },
    fadeOut:function(node,config){
        // let position = node.getPosition();
        let time = 0.2;
        let callBack = null;
        let context = null;
        if(config){
            if(this._isDefined(config.time)){
                time = config.time;
            }
            if(this._isDefined(config.callBack)){
                callBack = config.callBack;
            }
            if(this._isDefined(config.context)){
                context = config.context;
            } 
        }
        let action = cc.sequence(
            cc.fadeOut(time),
            cc.callFunc(function(){
                callBack&&callBack.call(context);
            },context), 
        );
        node.runAction(action);
    },
    fadeIn:function(node,config){
        // let position = node.getPosition();
        let time = 0.2;
        let callBack = null;
        let context = null;
        if(config){
            if(this._isDefined(config.time)){
                time = config.time;
            }
            if(this._isDefined(config.callBack)){
                callBack = config.callBack;
            }
            if(this._isDefined(config.context)){
                context = config.context;
            } 
        }
        let action = cc.sequence(
            cc.fadeIn(time),
            cc.callFunc(function(){
                callBack&&callBack.call(context);
            },context), 
        );
        node.runAction(action);
    },
    easeShake:function(target, duration){
        let component=this.getComponent();
        let x = target.x;
        let y = target.y;
        target.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.moveTo(0.05, cc.v2(x+2, y+1)),
                    cc.moveTo(0.05, cc.v2(x-2, y+1)),
                    cc.moveTo(0.05, cc.v2(x-2, y+1)),
                    cc.moveTo(0.05, cc.v2(x+2, y-1)),
                    cc.moveTo(0.05, cc.v2(x-2, y+1)),
                    cc.moveTo(0.05, cc.v2(x+2, y-1)),
                    cc.moveTo(0.05, cc.v2(x-2, y-1)),
                    cc.moveTo(0.05, cc.v2(x+2, y+1)),
                    cc.moveTo(0.05, cc.v2(x, y))
                )
            )
        );
        component.scheduleOnce(function(){
            target.stopAllActions();
            target.setPosition(x, y);
        }, duration);
    },
    /**
     * 侧向滑动
     * @param {*} target 
     * @param {*} x 
     * @param {*} config 
     */
    lateralSpreads(target, offsetX, config){
        this.setActive(target,true);
        target.stopAllActions();
        let time = 0.3;
        let callBack, context;
        if(config){
            if(this._isDefined(config.time)){
                time = config.time;
            }
            if(this._isDefined(config.callBack)){
                callBack = config.callBack;
            }
            if(this._isDefined(config.context)){
                context = config.context;
            }
        }
        let finished = cc.callFunc(function() {
            if(callBack instanceof Function){
                callBack.call(context);
            }
        }, this);
        let action = cc.sequence(cc.moveTo(time, offsetX, 0), finished);
        target.runAction(action);
    },
    /**
     * 震屏效果
     * target  目标节点
     * duration 震屏时间
     *  */
    shakeEffect: function (target, duration) {
        let component=this.getComponent();
        let x = target.x;
        let y = target.y;
        target.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.moveTo(0.02, cc.v2(x+5, y+7)),
                    cc.moveTo(0.02, cc.v2(x-6, y+7)),
                    cc.moveTo(0.02, cc.v2(x-13, y+3)),
                    cc.moveTo(0.02, cc.v2(x+3, y-6)),
                    cc.moveTo(0.02, cc.v2(x-5, y+5)),
                    cc.moveTo(0.02, cc.v2(x+2, y-8)),
                    cc.moveTo(0.02, cc.v2(x-8, y-10)),
                    cc.moveTo(0.02, cc.v2(x+3, y+10)),
                    cc.moveTo(0.02, cc.v2(x, y))
                )
            )
        );
        component.scheduleOnce(function(){
            target.stopAllActions();
            target.setPosition(x, y);
        }, duration);
    },
    _isDefined: function (property) {
        if (property != undefined && property != null && property != "") {
            return true;
        } else {
            return false;
        }
    },
}
Base.prototype.grant(Base,Animation);
let animation=new Animation();
module.exports=animation;