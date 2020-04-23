/*
    基本的cc.Component组件
*/
let Base = require("./Base");
let BaseComponent = cc.Class({
    extends: cc.Component,
    properties: {},
});
Base.prototype.grant(Base, BaseComponent);
module.exports = BaseComponent;