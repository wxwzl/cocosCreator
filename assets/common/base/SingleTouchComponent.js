
cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    _touchStart(event) {
        if (this._touchID >= 0) {
            event.stopPropagation();
        } else {
            this._touchID = event.getID();
        }
    },
     _touchMove(event) {
        if (this._touchID !== event.getID()) {
            event.stopPropagation();
        }
    },
    _touchEnd(event) {
        if (this._touchID !== event.getID()) {
            event.stopPropagation();
        } else if (!event.simulate) {
            this._touchID = -1;
        }
    },
    onLoad () {
        this._touchID = -1;
        this.node.on(cc.Node.EventType.TOUCH_START, this._touchStart, this, true);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMove, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, this._touchEnd, this, true);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchEnd, this, true);
    },
    // onEnable() {
        
    // },

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._touchStart, this, true);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._touchMove, this, true);
        this.node.off(cc.Node.EventType.TOUCH_END, this._touchEnd, this, true);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._touchEnd, this, true);
    },
    start () {

    },

    // update (dt) {},
});
