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
        this.goldLabel = cc.find('Canvas/BG/gameItem/gold/goldLabel');
        this.gameScript = cc.find("Canvas/BG").getComponent('game');//拿到BG节点上面挂载的game脚本

        this.goldNum = 0;
    },
    start() {

    },
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.group == 'gold') {//与金币碰撞
            this.goldNum++;
            this.goldLabel.getComponent(cc.Label).string = this.goldNum;
            otherCollider.node.destroy();
        } else if (otherCollider.node.group == 'skill') {
            let skillNode = this.gameScript.skillNode;
            skillNode.active = true;//显示skillNode节点
            skillNode.getComponent(cc.Sprite).fillRange = 1
            otherCollider.node.destroy();
            this.gameScript.fireTime = 10;
            this.schedule(function () {
                //一条或多条执行语句
                skillNode.getComponent(cc.Sprite).fillRange -= 1 / 30;
                if(skillNode.getComponent(cc.Sprite).fillRange <= 0){
                    skillNode.active = false;
                }
            }, 0.1, 29, 0); //(function(){},间隔时间，次数，多久后开始)
            this.scheduleOnce(function () {
                this.gameScript.fireTime = 20;
            },3)
        }
    },
    update(dt) {
        if (this.stick.dir.x === 0 && this.stick.dir.y === 0) {
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);//刚体停止移动
            if (range > 0) {
                range -= 0.005;
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

        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(sx * 100, sy * 100);//刚体移动方式

        degree = 360 - degree;
        degree = degree - 90;
        this.node.angle = -degree;
        if (range < 0.2) {//range限制（调试最佳为0.2左右）
            range += 0.005;
        }
        this.sprite.fillRange = range;
        // cc.log(this.sprite);
    },

});
