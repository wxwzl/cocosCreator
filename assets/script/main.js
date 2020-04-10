// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },
    isDefined: function (obj) {
        if (obj != undefined && obj != null) {
            return true;
        } else {
            return false;
        }
    },
    takeComponent: function (node, componentName) {
        if (node && node._components) {
            return node.getComponent(componentName);
        } else {
            return null;
        }
    },
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
    // LIFE-CYCLE CALLBACKS:

    
    onLoad () {
        let self =this;
        let scrollViewNode = cc.find("Canvas/scrollView");
        let scrollView = scrollViewNode.getComponent(cc.Component);
        scrollView.setUpdateItemUIRenderer(function(itemNode,number,index){
            console.log("number:",number,index);
            self.setLabelStr(itemNode,number);
        });
        let array = [];
        for(let i = 0;i<100;i++){
            array.push(i);
        }
        scrollView.updateData(array);
        scrollViewNode = cc.find("Canvas/scrollViewH");
        scrollView = scrollViewNode.getComponent(cc.Component);
        scrollView.setUpdateItemUIRenderer(function(itemNode,number,index){
            console.log("number:",number,index);
            self.setLabelStr(itemNode,number);
        });
        scrollView.updateData(array);
        // scrollView.updateData([0,1,2,3,4,5]);
    },

    start () {

    },

    // update (dt) {},
});
