
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },
    onBeginContact: function (contact, selfCollider, otherCollider) {
        let anim = selfCollider.node.getComponent(cc.Animation);//拿到动画组件
        if (otherCollider.node.group == 'wall') {//敌方子弹与wall碰撞
            this.bulletDestroy(anim,selfCollider);//敌方子弹销毁
        } else if (otherCollider.node.group == 'bullet') {//两方子弹相互碰撞
            let otherAnim = otherCollider.node.getComponent(cc.Animation);//拿到对方子弹的动画组件
            this.bulletDestroy(anim,selfCollider);
            this.bulletDestroy(otherAnim,otherCollider);
        }else if(otherCollider.node.group == 'player'){//敌方子弹与玩家碰撞
            this.bulletDestroy(anim,selfCollider);
            /**注意玩家血量，控制玩家生命 */
        }
    },
    /**
     * 在bullet脚本中也有同样方法，也可以调用该脚本方法
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

    // update (dt) {    },
});
