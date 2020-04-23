/**还未增加分帧加载功能
 * 建议采用迭代器形式实现分帧，可参考jsmodule-IteratorGenerator,函数分帧执行器待写
 */
cc.Class({
    extends: cc.Component,
    editor:{
        requireComponent: cc.ScrollView,
        disallowMultiple: false,
    },
    properties: {
        prefabCell: {
            type: cc.Prefab,
            default: null,
            tooltip: "content节点不需添加Layout组件",
        },
        spacing: cc.Integer,
    },
    setUpdateItemUIRenderer: function (method) {
        this.updateItemUIRenderer = method;
    },
    init: function (data, config) {
        if (config) {
            if (config.itemUIRenderer) {
                this.updateItemUIRenderer = config.itemUIRenderer;
            }
        }
        this.updateData(data);
    },
    pushData: function (data) {
        this.data.concat(data);
    },
    updateData: function (data) {
        this._prepare();
        this._initialize();
        this.contentNode.active = false;
        this.data = data;
        let len = this._spawnCount;
        let i = 0;
        if (data.length < this._spawnCount) {
            len = data.length;
            for (i = this._spawnCount - 1; i >= len; --i) {
                let item = this.contentNode.children[i];
                if (item) {
                    this.itemNodePool.put(item);
                }
            }
            this._isTop = true;
            this._isBottom = true;
        }

        for (i = 0; i < len; i++) {
            let item = this.contentNode.children[i];
            if (!this.checkNodeIsExist(item)) {
                item = this.itemNodePool.get();
                this.contentNode.addChild(item);
            }
            if (this.scrollView.vertical) {
                item.setPosition(0, this.getPoistion(this.prefabCellHeight, i,1-this.prefabCellAnchorY));
                // item._scrollViewIndex = i;
            } else if (this.scrollView.horizontal) {
                item.setPosition(-this.getPoistion(this.prefabCellWidth, i,this.prefabCellAnchorX), 0);
            }
            this.itemNodes.push(item);
            this.updateItemUI(item, i);
        }

        this._totalCount = data.length;
        if (this.scrollView.vertical) {
            this.contentNode.height = this._totalCount * (this.prefabCellHeight + this.spacing) + this.spacing;
            this.contentNode.y = this._viewZone / 2;
            // console.log("this.contentNode.height :", this.contentNode.height, "this.prefabCellHeight:", this.prefabCellHeight, "_totalCount:",  this._totalCount,
            //     "this.spacing:", this.spacing, "this.contentNode.y :", this.contentNode.y);
            this.lastContentPosY = this.contentNode.y;
        } else {
            this.contentNode.width = this._totalCount * (this.prefabCellWidth + this.spacing) + this.spacing;
            this.contentNode.x = -this._viewZone / 2;
            // console.log("this.contentNode.width :", this.contentNode.width, "this.prefabCellWidth:", this.prefabCellWidth, "_totalCount:",  this._totalCount,
            //     "this.spacing:", this.spacing, "this.contentNode.x :", this.contentNode.x);
            this.lastContentPosX = this.contentNode.x;
        }
        this._startEvent();
        this.contentNode.active = true;
    },
    _initialize: function () {
        // console.log("初始化SingleTypeBaseScrollView组件相关属性");
        this.itemNodes = [];
        this.dataLoaded = true;
        this._pointer = 0;
        this._isTop = true;
        this._isBottom = false;
        this.data = [];
        this.node.off("scrolling");
    },
    _startEvent: function () {
        this.node.on("scrolling", this.updateUI, this);
    },
    _prepare: function () {
        if (this._prepared) {
            return;
        }
        if (!this._checkValidation()) {
            return;
        }
        // console.log("初始化SingleTypeBaseScrollView组件");
        this.dataLoaded = false;
        this._prepared = true;
        this.itemNodes = [];
        this.data = [];
        this.itemNodePool = new cc.NodePool();
        this.contentNode = this.scrollView.content;
        this.updateUIMethod = null;
        this.lastDirection = null;
        let item = cc.instantiate(this.prefabCell);
        this.itemNodePool.put(item);
        this.prefabCellHeight = item.height;
        this.prefabCellWidth = item.width;
        this.prefabCellAnchorX = item.anchorX;
        this.prefabCellAnchorY = item.anchorY;
        if (this.scrollView.horizontal) {
            this._viewZone = this.scrollView.node.width;
            this.contentNode.anchorX = 0;
            this.contentNode.anchorY = 0.5;

            this._spawnCount = Math.floor(this._viewZone / (this.prefabCellWidth + this.spacing)) + 1;
            let offset = (this.prefabCellWidth + this.spacing) * this._spawnCount;
            this._dt = offset - this._viewZone;
            this.updateUIMethod = this.updateHorizontal;
        } else {
            this._viewZone = this.scrollView.node.height;
            this.contentNode.anchorX = 0.5;
            this.contentNode.anchorY = 1;
            this.lastContentPosY = 0;
            this._spawnCount = Math.floor(this._viewZone / (this.prefabCellHeight + this.spacing)) + 1;
            let offset = (this.prefabCellHeight + this.spacing) * this._spawnCount;
            this._dt = offset - this._viewZone;
            this.updateUIMethod = this.updateVertical;
        }
        for (let i = 1; i < this._spawnCount; ++i) { // spawn items, we only need to do this once
            item = cc.instantiate(this.prefabCell);
            this.itemNodePool.put(item);
        }
        let node = this.node;
        let svLeftBottomPoint = node.parent.convertToWorldSpaceAR(
            cc.v2(
                node.x - node.anchorX * node.width,
                node.y - node.anchorY * node.height
            )
        );
        // 求出 ScrollView 可视区域在世界坐标系中的矩形（碰撞盒）
        this._svBBoxRect = cc.rect(svLeftBottomPoint.x, svLeftBottomPoint.y, node.width, node.height);
    },
    _checkValidation() {
        this.scrollView = this.node.getComponent(cc.ScrollView);
        if (!this.scrollView || this.checkNodeIsExist(this.node) != true) {
            console.error("节点未绑定cc.ScrollView组件或组件已销毁！");
            return false;
        }
        if (this.scrollView.vertical && this.scrollView.horizontal) {
            console.error("请指定scrollView组件的方向");
            return false;
        }
        return true;
    },
    onLoad() {
        this._prepare();
    },
    updateItemUI: function (itemNode, index) {
        let item = this.data[index];
        this.updateItemUIRenderer && this.updateItemUIRenderer(itemNode, item,index);
    },
    updateHorizontal: function () {
        if (this._isTop && this._isBottom) {
            return;
        }
        let isDown = this.scrollView.content.x > this.lastContentPosX; // scrolling direction
        let node = null;
        let items = this.itemNodes;
        let nodeLen = this._spawnCount;
        if (isDown) {
            if (this._isTop) {
                this._pointer = 0;
                return;
            }
        } else {
            if (this._isBottom) {
                this._pointer = this._totalCount - 1 - nodeLen;
                return;
            }
        }
        if (!this._isBottom && !this._isTop) {
            if (this.lastDirection != isDown) {
                if (this.lastDirection) {
                    this._pointer++;
                } else {
                    this._pointer--;
                }
            }
        }
        this.lastDirection = isDown;
        for (let i = 0; i < nodeLen; ++i) {
            node = items[i];
            if (!node) {
                continue;
            }
            let childNodeBBox = node.getBoundingBoxToWorld();
            if (!childNodeBBox.intersects(this._svBBoxRect)) {
                if (isDown) {
                    childNodeBBox.x = childNodeBBox.x + this._dt;
                    if (!childNodeBBox.intersects(this._svBBoxRect)) {
                        // node.y + offset < 0
                        // node.y = node.y + offset;
                        let newIndex = this._pointer;
                        if (newIndex <= 0) {
                            if (this._isTop) {
                                return;
                            } else {
                                this._isTop = true;
                            }
                        }
                        node.x = -this.getPoistion(this.prefabCellWidth, newIndex,this.prefabCellAnchorX);
                        // console.log("当前动态索引：", this._pointer, "节点:", i, "方向:", isDown, "要替换的索引:", newIndex, "要填充的位置", node.x,
                        //     "this.contentNode.width:", this.contentNode.width, "this._isTop", this._isTop);
                        this.updateItemUI(node, newIndex);
                        this._pointer--;
                        this._isBottom = false;
                    }
                } else {
                    childNodeBBox.x = childNodeBBox.x - this._dt;
                    if (!childNodeBBox.intersects(this._svBBoxRect)) {
                        // node.y = node.y - offset;
                        // node.y - offset>-this.contentNode.height
                        let newIndex = this._pointer + nodeLen;
                        if (newIndex >= this._totalCount - 1) {
                            if (this._isBottom) {
                                return;
                            } else {
                                this._isBottom = true;
                            }
                        }
                        node.x = -this.getPoistion(this.prefabCellWidth, newIndex,this.prefabCellAnchorX);
                        // console.log("当前动态索引：", this._pointer, "节点:", i, "方向:", isDown, "要替换的索引:", newIndex, "要填充的位置", node.x,
                        //     "this.contentNode.width:", this.contentNode.width, "this._isBottom ", this._isBottom);
                        this.updateItemUI(node, newIndex);
                        this._pointer++;
                        this._isTop = false;
                    }
                }
            }
        }
        // update lastContentPosX
        this.lastContentPosX = this.scrollView.content.x;
    },
    updateVertical: function () {
        if (this._isTop && this._isBottom) {
            return;
        }
        let isDown = this.scrollView.content.y < this.lastContentPosY; // scrolling direction
        let node = null;
        let items = this.itemNodes;
        let nodeLen = this._spawnCount;
        if (isDown) {
            if (this._isTop) {
                this._pointer = 0;
                return;
            }
        } else {
            if (this._isBottom) {
                this._pointer = this._totalCount - 1 - nodeLen;
                return;
            }
        }
        if (!this._isBottom && !this._isTop) {
            if (this.lastDirection != isDown) {
                if (this.lastDirection) {
                    this._pointer++;
                } else {
                    this._pointer--;
                }
            }
        }
        this.lastDirection = isDown;
        for (let i = 0; i < nodeLen; ++i) {
            node = items[i];
            if (!node) {
                continue;
            }
            let childNodeBBox = node.getBoundingBoxToWorld();
            if (!childNodeBBox.intersects(this._svBBoxRect)) {
                if (isDown) {
                    childNodeBBox.y = childNodeBBox.y - this._dt;
                    if (!childNodeBBox.intersects(this._svBBoxRect)) {
                        // node.y + offset < 0
                        // node.y = node.y + offset;
                        let newIndex = this._pointer;
                        if (newIndex <= 0) {
                            if (this._isTop) {
                                return;
                            } else {
                                this._isTop = true;
                            }
                        }
                        node.y = this.getPoistion(this.prefabCellHeight, newIndex,1-this.prefabCellAnchorY);
                        // console.log("当前动态索引：", this._pointer, "节点:", i, "方向:", isDown, "要替换的索引:", newIndex, "要填充的位置", node.y,
                        //     "this.contentNode.height:", this.contentNode.height, "this._isTop", this._isTop);
                        this.updateItemUI(node, newIndex);
                        this._pointer--;
                        this._isBottom = false;
                    }
                } else {
                    childNodeBBox.y = childNodeBBox.y + this._dt;
                    if (!childNodeBBox.intersects(this._svBBoxRect)) {
                        // node.y = node.y - offset;
                        // node.y - offset>-this.contentNode.height
                        let newIndex = this._pointer + nodeLen;
                        if (newIndex >= this._totalCount - 1) {
                            if (this._isBottom) {
                                return;
                            } else {
                                this._isBottom = true;
                            }
                        }
                        node.y = this.getPoistion(this.prefabCellHeight, newIndex,1-this.prefabCellAnchorY);
                        // console.log("当前动态索引：", this._pointer, "节点:", i, "方向:", isDown, "要替换的索引:", newIndex, "要填充的位置", node.y,
                        //     "this.contentNode.height:", this.contentNode.height, "this._isBottom ", this._isBottom);
                        this.updateItemUI(node, newIndex);
                        this._pointer++;
                        this._isTop = false;
                    }
                }
            }
        }
        // update lastContentPosY
        this.lastContentPosY = this.scrollView.content.y;
    },
    // getPositionInView(item) { // get item position in scrollview's node space
    //     let worldPos = item.parent.convertToWorldSpaceAR(item.position);
    //     let viewPos = this.scrollView.node.parent.convertToNodeSpaceAR(worldPos);
    //     return viewPos;
    // },
    getPoistion: function (cellWidth, index, anchor) {
        if (anchor === undefined) {
            anchor = 0.5;
        }
        return -cellWidth * (anchor + index) - this.spacing * (index + 1);
        // return -cellWidth * (index) - this.spacing * (index + 1);
    },
    updateUI: function () {
        this.updateUIMethod();
    },
    // update(dt) {
    //     if (!this.dataLoaded) {
    //         return;
    //     }
    //     this.updateTimer += dt;
    //     if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
    //     this.updateTimer = 0;
    //     this.updateUIMethod();
    // },
    checkNodeIsExist: function (node) {
        if (node && node._components && cc.isValid(node, true)) {
            return true;
        }
        return false;
    },
});