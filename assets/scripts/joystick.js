
cc.Class({
    extends: cc.Component,

    properties: {
        stick: cc.Node,
        max_R: 90,
        // R:150,
        
    },
    start() {
        this.dir = cc.v2(0, 0);
        this.stick.setPosition(cc.v2(0, 0));
        this.stick.on(cc.Node.EventType.TOUCH_START, function (e) {
            //开始触摸
        }.bind(this), this);
        this.stick.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
            //移动
            var screen_pos = e.getLocation();
            var pos = this.node.convertToNodeSpaceAR(screen_pos);
            //最大边距
            var len = pos.mag();
            this.dir.x = pos.x / len;// x cos
            this.dir.y = pos.y / len;// y sin 
            if (len > this.max_R) {
                pos.x = pos.x * this.max_R / len;
                pos.y = pos.y * this.max_R / len;
            }
            this.stick.setPosition(pos);
        }.bind(this), this);
        this.stick.on(cc.Node.EventType.TOUCH_END, function (e) {
            //结束
            this.dir = cc.v2(0, 0);
            this.stick.setPosition(cc.v2(0, 0));
        }.bind(this), this);
        this.stick.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
            //触摸弹起
            this.stick.setPosition(cc.v2(0, 0));
            this.dir = cc.v2(0, 0);
        }.bind(this), this);
    },
    update(dt) { },
});
