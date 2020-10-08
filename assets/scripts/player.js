let range = 0;
var joystick = require("joystick");

cc.Class({
    extends: cc.Component,

    properties: {
        stick: {
            type: joystick,
            default: null,
        },
        speed: 200,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sprite = this.node.getChildByName("tracks").getComponent(cc.Sprite);
    },
    start() {

    },
    update(dt) {
        if (this.stick.dir.x === 0 && this.stick.dir.y === 0) {
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);//刚体停止移动
            if(range>0){
                range-=0.005;
            }
            this.sprite.fillRange = range;
            return;
        }
        this.vx = this.speed * this.stick.dir.x;
        this.vy = this.speed * this.stick.dir.y;
        var sx = this.vx * dt;
        var sy = this.vy * dt;
        var r = Math.atan2(this.stick.dir.y, this.stick.dir.x);
        var degree = r * 180 / Math.PI;
        
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(sx*100,sy*100);//刚体移动方式
        
        degree = 360 - degree;
        degree = degree - 90;
        this.node.angle = -degree;
        if(range<0.2){//range限制（调试最佳为0.2左右）
            range+=0.005;
        }
        this.sprite.fillRange = range;
        // cc.log(this.sprite);
    },

});
