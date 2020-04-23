let stringUtil = require("../baseUtil/StringUtil");
let EventModel = require("./EventModel");

function Base() {
    EventModel.call(this);
};
Base.prototype = {
    constructor: Base,
    /**
     * 继承方法
     * @argments：
     *  parent：父类, 对象;
     *  son:子类 ，为Fuction 对象
     * 注意该继承只能实现多层次的类属性继承，不能继承实例化属性，若要实现像java那样的继承，
     * 需在之类的构造函数中，调用的父类的构造函数方法如：parent.call(this,...参数);
     * 
     */
    grant: function (parent, son, reveseInherit) {
        let parentP = parent.prototype;
        if (!parentP) {
            parentP = parent;
        }
        let prototype = son.prototype;
        if (!prototype) {
            prototype = son;
        }
        let keys = Object.keys(parentP);
        let len = keys.length;
        let key = null;
        for (let i = 0; i < len; i++) {
            key = keys[i];
            if (reveseInherit && key != "constructor") {
                prototype[key] = parentP[key];
            } else {
                if (!prototype[key]) {
                    prototype[key] = parentP[key];
                }
            }
        }
    },
    /**
     * 查找结点,从传入的node节点开始向它的子孙节点查找。
     * @argments
     * node:开始查找的节点，搜所范围不包含本身，只包含它的子孙节点；为cc.Node类型
     * path:节点路径:如:"/child/son",查找node节点下的child节点下的son节点，为String类型
     */
    find: function (path, node) {
        var _newTargetNode = node;
        if (node === undefined) {
            //node= cc.director._scene.getChildByName("Canvas");
            _newTargetNode = cc.find("Canvas");
        }
        // node = cc.find(path, node);
        // return node;

        if (path) {
            let realPath = "";
            if (/^\//.test(path)) {
                realPath = path.substr(1);
            } else {
                realPath = path;
            }
            let array = realPath.split('/');
            let first = array[0];
            if (first == "Canvas" && !node) {
                array.splice(0, 1);
            }
            let len = array.length;
            let item = "";
            for (let i = 0; i < len; i++) {
                item = array[i];
                if (item) {
                    _newTargetNode != null && (_newTargetNode = _newTargetNode.getChildByName(item));
                }
            }
        }
        if (_newTargetNode == null) {
            cc.warn('getNodeByPath - 目标节点未找到', node, path);
        }
        return _newTargetNode;
    },
    /**
     * 设置节点是否可见，这里的可见包含是否渲染,意思是是否占用界面的空间。
     * @param
     * node:要设置的节点；为cc.Node类型
     * path:是否可见，为boolen类型
     */
    setActive: function (node, state) {
        if (node && node._components) {
            node.active = state;
        }
    },
    /**
     * 设置带有cc.Label组件的节点的该组件的string值。
     * @param
     * labelNode:要设置的节点；为cc.Node类型
     * str:显示的文字，为Stirng类型
     */
    setLabelStr: function (labelNode, str,config) {
        if (labelNode && labelNode._components) {
            let label = this.takeComponent(labelNode, cc.Label);
            if (!label) {
                label = labelNode.addComponent(cc.Label);
            }
            label.string = str + "";
            if(config){
                if(this.isDefined(config.font)){
                    label.font = config.font;
                }
                if(this.isDefined(config.spacingX)){
                    label.spacingX = config.spacingX;
                }
                if(this.isDefined(config.fontSize)){
                    label.fontSize = config.fontSize;
                }
            }
        }
    },
    getLabelStr: function (labelNode) {
        if (labelNode && labelNode._components) {
            let label = this.takeComponent(labelNode, cc.Label);
            if (!label) {
                console.log("节点", labelNode, "还未添加cc.Label组件");
                return "";
            }
            return label.string;
        }
        return null;
    },
    /**
     * 设置带有cc.Label组件的节点的该组件的string值。
     * @param
     * labelNode:要设置的节点；为cc.Node类型
     * str:显示的文字，为Stirng类型
     */
    editBoxStr: function (editBoxNode, str) {
        if (editBoxNode && editBoxNode._components) {
            let com = this.takeComponent(editBoxNode, cc.EditBox);
            if (!com) {
                com = editBoxNode.addComponent(cc.EditBox);
            }
            if (str != undefined) {
                com.string = str + "";
            } else {
                return com.string;
            }
        }
    },
    /**
     * 设置带有cc.RichText组件的节点的该组件的string值。
     * @param
     * labelNode:要设置的节点；为cc.Node类型
     * str:显示的文字，为Stirng类型
     */
    setRichTextStr: function (richTextNode, str) {
        if (richTextNode && richTextNode._components) {
            let label = this.takeComponent(richTextNode, cc.RichText);
            if (!label) {
                label = labelNode.addComponent(cc.RichText);
            }
            label.string = str;
        }
    },
    /**
     * 设置带有cc.Sprite组件的节点的spriteFrame
     * @param
     * node:要设置的节点；为cc.Node类型
     * spriteFrame:显示的文字，为Stirng类型
     */
    setSpriteFrameNode: function (node, spriteFrame) {
        if (node && node._components) {
            let com = node.getComponent(cc.Sprite);
            if (com) {
                com.spriteFrame = spriteFrame;
            } else {
                //console.error(node,"节点没有cc.Sprite组件，将自动添加该组件");
                com = node.addComponent(cc.Sprite);
                com.spriteFrame = spriteFrame;
            }

        }
    },
    /**
     * 设置带有cc.Button组件的节点的interactable交互属性，
     * @param
     * node:要设置的节点；为cc.Node类型
     * state:true,该button可以响应用户的交互事件，false,该button可以不能响应用户的交互事件,为boolean类型
     */
    setButtonNodeInteractable: function (node, state) {
        if (node && node._components) {
            let btn = node.getComponent(cc.Button);
            if (btn) {
                btn.interactable = state;
            }
        }
    },
    /**
    *截取小数位，
    *注意：为避免8.0在js中显示成7.9999999,截取时截取两位小数时直接截取成7.99，在调用该方法前
       最好调用getRoundNumber进行比要截取的小数位位数大的四舍五入，如要截取2两位小数，可先进行4~5位的小数位的
       四舍五入，然后再调用该方法进行截取，以避免出现上述情况。
    * @param
    * num:被截取的数字；为Number类型
    * number:要截取的位数,为Number类型
    */
    getFixedNumber: function (num, number) {
        if (number === undefined) number = 0;
        let str = num + "";
        let index = str.indexOf(".");
        if (index >= 0) {
            let numberStr = str.substr(0, index + 1 + number);
            return Number(numberStr);
        } else {
            return num;
        }
        //return (Math.floor(Math.pow(10,number)*num))/Math.pow(10,number);
    },
    /**
     * 四舍五入方法
     * @param
     * num:被四舍五入的数字；为Number类型
     * number:小数位的位数,为Number类型
     */
    getRoundNumber: function (num, number, isStr) {
        if (number === undefined) number = 0;
        let roundNum = (Math.round(Math.pow(10, number) * num)) / Math.pow(10, number);
        if (isStr === true) {
            roundNum = roundNum + "";
            let index = roundNum.indexOf(".");
            if (index < 0) {
                if (number > 0) {
                    roundNum = roundNum + ".";
                    for (var i = 0; i < number; i++) {
                        roundNum = roundNum + "0";
                    }
                }
            } else {
                let pointNum = roundNum.substr(index + 1, );
                if (pointNum.length < number) {
                    let subfixLen = number - pointNum.length;
                    for (var i = 0; i < subfixLen; i++) {
                        roundNum = roundNum + "0";
                    }
                }
            }
        }
        return roundNum;
    },
    /**
     * 节点与节点之间的坐标转换
     * @param
     * node:需要被转换坐标的节点 ，为cc.Node类型
     * aginastNode:上述node节点要转换的目标坐标系下的节点，为cc.Node类型
     */
    getRelativePosition: function (node, aginastNode) {
        if (node && node._components) {
            let parent = aginastNode._parent;
            let worldPosition = node.parent.convertToWorldSpaceAR(node.position);
            let pos = parent.convertToNodeSpaceAR(worldPosition);
            return pos;
        } else {
            return null;
        }
    },
    /**
     * 设置需要运行时动态加载图片
     * @param
     * portraitNode:需要被改变其下的cc.sprite属性值的节点，为cc.Node类型
     * 
     */
    setRemoteSpriteFrame: function (portraitNode, url, callBack,context,config) {
        let me = this;
        cc.loader.load(url, function (err, texture) {
            if (!err && texture instanceof cc.Texture2D) {
                let spriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, texture.width, texture.height));
                // spriteFrame.setTexture(texture);
                me.setSpriteFrameNode(portraitNode, spriteFrame);
                if(callBack instanceof Function){
                    callBack && callBack.call(context,true);
                }
            } else { 
                console.error("加载远程图片报错", url, err);
                if(callBack instanceof Function){
                    callBack && callBack.call(context,false);
                }
            }
        });
    },
    /**
     * 加载本地resources文件夹下的资源
     */
    setLocalSpriteFrame: function (portraitNode, url, callBack,caontext,config) {
        let me = this;
        cc.loader.loadRes(url, function (err, texture) {
            if (!err && texture instanceof cc.Texture2D) {
                let spriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, texture.width, texture.height));
                // spriteFrame.setTexture(texture);
                me.setSpriteFrameNode(portraitNode, spriteFrame);
                if(callBack instanceof Function){
                    callBack && callBack.call(context,true);
                }
            } else {
                console.error("加载resources文件夹下图片报错", url, err);
                if(callBack instanceof Function){
                    callBack && callBack.call(context,false);
                }
            }
        });
    },
    /**
     * 设置名字等宽度有限制的节点的值
     * @param
     * node:需要被改变其下的cc.sprite属性值的节点，为cc.Node类型
     * name:先对于asset目录下的名字
     */
    setName: function (node, name) {
        if (node && node._components) {
            let _name = stringUtil.substr(name, 8, true);
            this.setLabelStr(node, _name);
        }
    },
    /**
     * 控制节点的所有有关显示的属性，
     * @param
     * node:需要设置的节点，为cc.Node类型
     * state:true,可见，false，不可见 为boolean类型
     */
    mustShowNode: function (node, state) {
        if (node && node._components) {
            if (state === true) {
                node.opacity = 255;
            } else {
                node.opacity = 0;
            }
            this.setActive(node, state);
            //2.0.6已被移除
            // if(node._sgNode&&node._sgNode.setVisible){
            //     node._sgNode.setVisible(state);
            // }
        }
    },
    /**
     * 随机偏移位置，
     * @param
     * pos:原始的坐标，为cc.v2类型
     * dtX,:x坐标的偏移幅度，Number类型
     * dtY：y坐标的偏移幅度,Number类型，
     * notRandomSignX：x轴偏移的正负项，true,偏移值只会为正值，false,正负偏移 boolean类型
     * notRandomSignY：y偏移的正负值，true,偏移值只会为正值，false,正负偏移 boolean类型
     */
    randomPosition: function (pos, dtX, dtY, notRandomSignX, notRandomSignY) {
        let wScope = 30;
        let hScope = 30;
        let clone = new cc.v2(0, 0);
        if (dtX != undefined) {
            wScope = dtX;
        }
        if (dtY != undefined) {
            hScope = dtY;
        }
        let randomW = Math.random() * wScope;
        let randomH = Math.random() * hScope;
        let randomSign = Math.random();
        if (randomSign > 0.5) {
            if (notRandomSignX != true) {
                randomW = -randomW;
            }
            if (notRandomSignY != true) {
                randomH = -randomH;
            }
        }
        clone.x = pos.x + randomW;
        clone.y = pos.y + randomH;
        return clone;
    },
    //刷新边距设置
    updateWidget: function (node) {
        if (node && node._components) {
            let self = this;
            let com = node.getComponent(cc.Widget);
            if (com) {
                com.alignMode = cc.Widget.AlignMode.ALWAYS;
                com.updateAlignment();
                com.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
            }
            node.children.forEach(function (child) {
                self.updateWidget(child);
            });
        }
    },
    trim: function (str) {
        return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '');
    },
    stopEvent: function (e) {
        if (e && e.stopPropagation) {
            e.stopPropagationImmediate();
            e.stopPropagation();
        }
    },
    takeComponent: function (node, componentName) {
        if (node && node._components) {
            return node.getComponent(componentName);
        } else {
            return null;
        }
    },
    deleteComponent: function (node, componentName) {
        if (node && node._components) {
            let com = node.getComponent(componentName);
            if (com) {
                node.removeComponent(componentName);
            }
        }
    },
    //该方法仅供类方法内部使用
    checkNodeIsExist: function (node) {
        if (node && node._components && cc.isValid(node,true)) {
            return true;
        }
        return false;
    },
    /**
     * node 要添加button事件的节点
     * eventName:事件名如：click
     * callBack：事件触发时的回调函数
     * context:回调函数执行的上下文对象
     * params:回调函数触发时函数的执行参数。是一个数组
     * config：详细配置如{
     * }
     * 
     */
    addButtonEvent: function (node, eventName, callBack, context, params, config) {
        if (!this.checkNodeIsExist(node)) {
            return;
        }
        let button = this.takeComponent(node, cc.Button);
        if (!button) {
            button = node.addComponent(cc.Button);
            button.enableAutoGrayEffect = true;
            button.interactable = true;
        }
        button.antiMulticlick = true;
        if (!(params instanceof Array)) {
            let array = [];
            if (params != undefined && params != null) {
                array.push(params);
            }
            params = array;
        }
        let once = false;
        if (config) {
            if (config.hasTransition) {
                button.transition = cc.Button.Transition.SCALE;
                button.duration = 0.1;
                button.zoomScale = 0.8;
            }
            if (config.transition != undefined) {
                button.transition = config.transition;
            }
            if (config.duration != undefined) {
                button.duration = config.duration;
            }
            if (config.zoomScale != undefined) {
                button.zoomScale = config.zoomScale;
            }
            if (config.enableAutoGrayEffect != undefined) {
                button.enableAutoGrayEffect = config.enableAutoGrayEffect;
            }
            if (config.interactable != undefined) {
                button.interactable = config.interactable;
            }
            if (config.antiMulticlick === false) {
                button.antiMulticlick = config.antiMulticlick;
            }
            if (config.once) {
                once = config.once;
            }
        }
        if (!config || config.notRemoveEvent != true) {
            node.off(eventName);
        }
        let self = this;
        let methodName = once?"once":"on";
        node[methodName](eventName, function (button) {
            let clone = params.slice(0);
            clone.push(button);
            if (button.antiMulticlick) {
                self.setButtonNodeInteractable(button.target, false);
            }
            callBack && callBack.apply(this, clone);
            if (button.antiMulticlick) {
                self.setButtonNodeInteractable(button.target, true);
            }
        }, context);
    },
    addNodeEvent: function (node, eventName, callBack, context, params, config) {
        if (!this.checkNodeIsExist(node)) {
            return;
        }
        if (!(params instanceof Array)) {
            let array = [];
            if (params != undefined && params != null) {
                array.push(params);
            }
            params = array;
        }
        let once = false;
        if (config) {
            if (config.once) {
                once = config.once;
            }
        }
        if (!config || config.notRemoveEvent != true) {
            node.off(eventName);
        }
        let self = this;
        let methodName = once?"once":"on";
        node[methodName](eventName, function (e) {
            let clone = params.slice(0);
            clone.push(e);
            callBack && callBack.apply(this, clone);
            self.stopEvent(e);
        }, context);
    },
    deleteAllChildren: function (node) {
        if (node && node._components) {
            node.destroyAllChildren();
            node.removeAllChildren();
        }
    },
    changeScreenDirection(dir,notUpdateUI) {
        if(cc.view._orientation == cc.macro.ORIENTATION_PORTRAIT&&dir == "V"){
           return ;
        }
        if(cc.view._orientation == cc.macro.ORIENTATION_LANDSCAPE&&dir != "V"){
            return ;
         }
        let frameSize = cc.view.getFrameSize();
        let resolutionSize = cc.view.getDesignResolutionSize();
        cc.view.setFrameSize(frameSize.height, frameSize.width);
        cc.view.setDesignResolutionSize(resolutionSize.height, resolutionSize.width);
        if (dir == "V") {
            cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
        } else {
            cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
        }
        if(notUpdateUI){
            return ;
        }
        if (window.jsb || cc.sys.isMobile) { //手动调用触发 Wdiget 组件重新布局
            window.dispatchEvent(new cc.Event.EventCustom('resize', true));
        } else {
            cc.view.emit("canvas-resize");
        }
    },
    detectNetworkStatus:function(){
        if(cc.sys.isBrowser){
            if(window.navigator&&window.navigator.onLine===false){
                return false;
            }else{
                return true;
            }
        }
    },
    //设置节点相对于父节点的坐标
    setNodePosition: function (node, archorX, archorY, x, y) {
        if (this.checkNodeIsExist(node)) {
            if (archorX != undefined) {
                node.anchorX = archorX;
            }
            if (archorY != undefined) {
                node.archorY = archorY;
            }
            if (x != undefined) {
                node.x = x;
            }
            if (y != undefined) {
                node.y = y;
            }
        }
        return this;
    },
    setNodeWidget: function (node, config) {
        if (this.checkNodeIsExist(node)&&config) {
            let com = this.takeComponent(node, cc.Widget);
            if (!com) {
                com = node.addComponent(cc.Widget);
            }
            com.alignMode = cc.Widget.AlignMode.ALWAYS; 
            if (config.left != undefined) {
                com.left = config.left;
            }
            if (config.right != undefined) {
                com.right = config.right;
            }
            if (config.top != undefined) {
                com.top = config.top;
            }
            if (config.bottom != undefined) {
                com.bottom = config.bottom;
            }
            if(config.isAbsoluteLeft!= undefined){
                com.isAbsoluteLeft = config.isAbsoluteLeft;
            }
            if(config.isAbsoluteRight!= undefined){
                com.isAbsoluteRight = config.isAbsoluteRight;
            }
            if(config.isAbsoluteTop!= undefined){
                com.isAbsoluteTop = config.isAbsoluteTop;
            }
            if(config.isAbsoluteBottom!= undefined){
                com.isAbsoluteBottom = config.isAbsoluteBottom;
            }
            if(config.isAbsoluteLeft!= undefined){
                com.isAbsoluteLeft = config.isAbsoluteLeft;
            }
            if(config.isAlignLeft!= undefined){
                com.isAlignLeft = config.isAlignLeft;
            }
            if(config.isAlignRight!= undefined){
                com.isAlignRight = config.isAlignRight;
            }
            if(config.isAlignTop!= undefined){
                com.isAlignTop = config.isAlignTop;
            }
            if(config.isAlignBottom!= undefined){
                com.isAlignBottom = config.isAlignBottom;
            }
            if (node.parent) {
                this.updateWidget(node.parent);
            } else {
                this.updateWidget(node);
            }
        }
    },
    playDragonBoneAnimation:function(node,animationName,playTimes,callBack,context,config){
        let params=[];
        if(arguments.length>4){
            params=Array.prototype.slice.call(arguments,5);
        }
        try {
            this.setActive(node,true);
            let armatureDisplay=node.getComponent(dragonBones.ArmatureDisplay);
            armatureDisplay.removeEventListener(dragonBones.EventObject.COMPLETE);
            armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE,function(){
                callBack&&callBack.apply(context,params);
            },this);
            armatureDisplay.playAnimation(animationName,playTimes);
            return ;
        } catch (error) {
            console.log(error);
            callBack&&callBack.apply(context,params);
        }

    },
    walkArray: function (array, handler, context) {
        if (array && array.length) {
            let len = array.length;
            for (let i = 0; i < len; i++) {
                if (handler) {
                    let isStop = handler.call(context, array[i], i, array);
                    if (isStop) {
                        return isStop;
                    }
                }

            }
        }
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
    isDefined: function (obj) {
        if (obj != undefined && obj != null) {
            return true;
        } else {
            return false;
        }
    },
    
    //转换字符
    conversionCharacter(reg, string, replaceCharacter){
        let resultsStr = '';
        replaceCharacter = replaceCharacter || '';
        for (let i = 0; i < string.length; i ++){
            let tempStr = string.substr(i, 1);
            resultsStr += reg.test(tempStr) ? tempStr : replaceCharacter;
        }  
        return resultsStr;
    },
    //转换成两位小数
    conversionToDecimalTwoNumber(string){
        let resultsStr = '';
        resultsStr = string.replace(/[^\d.]/g, '');//清除“数字”和“.”以外的字符
        resultsStr = resultsStr.replace(/\.{2,}/g, '.'); //只保留第一个. 清除多余的
        resultsStr = resultsStr.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
        resultsStr = resultsStr.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
        if(resultsStr.indexOf('.') < 0 && resultsStr != ''){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
            resultsStr = parseFloat(resultsStr); 
        } 
        return resultsStr+'';
    },
    //屏蔽键盘上可见的符号
    shieldingAllVisibleCharacters(string){
        let reg = /[^`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;
        return this.conversionCharacter(reg, string); 
    },
    //不能输入中文
    conversionDontInputChineseCharacters(string){
        let reg = /^[^\u4e00-\u9fa5]+$/;
        return this.conversionCharacter(reg, string); 
    },
    //转换成纯数字
    conversionOnlyNumber(string){
        let reg = /^[0-9]*$/;
        return this.conversionCharacter(reg, string); 
    },
    //转换成英文和数字
    conversionToEnglishAndNumbers(string){
        let reg = /^[A-Za-z0-9]+$/;
        return this.conversionCharacter(reg, string); 
    },
    //转换成纯英文
    conversionToOnlyEnglish(string){
        let reg = /^[A-Za-z]+$/;
        return this.conversionCharacter(reg, string); 
    },
    //过滤Script标签
    FilterScriptTag(string){
        let reg = /^[^<>]*$/;
        return this.conversionCharacter(reg, string); 
    },
    //不能输入某些字符，慢慢加
    conversionCanInputSomeCharacters(string){
        // let reg = /[^\x20-\x29\x2A-\x2F\x3A-\x3F\x40\x5B-\x5F\x60\x7B-\x7E]+/i;
        let reg = /[\w\s]+/;
        return this.conversionCharacter(reg, string); 
    },

};
Base.prototype.grant(EventModel, Base);
module.exports = Base;