
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onBeginContact: function (contact, selfCollider, otherCollider) {
        let anim = selfCollider.node.getComponent(cc.Animation);
        if (otherCollider.node.group == 'wall') {//子弹和墙壁碰撞
            // cc.log('子弹销毁')
            this.bulletDestroy(anim,selfCollider);
        } else if (otherCollider.node.group == "enemy") {//敌机碰撞
            //新生成一个enemy在合适的位置
            otherCollider.node.destroy();
            this.bulletDestroy(anim,selfCollider);
        }
    },
    /**
     * 在enemyBullet脚本中也有同样方法，也可以调用该脚本方法
     * @param {*} anim 动画组件
     * @param {*} Collider 碰撞体
     */
    bulletDestroy(anim,Collider) {//子弹销毁方法
        anim.play();
        anim.on('finished', function () {
            Collider.node.destroy();
        }, this);
    },

    start() {

    },

    // update (dt) {},
});
