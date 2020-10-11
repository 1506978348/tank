
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
            this.bulletDestroy(anim, selfCollider);
        } else if (otherCollider.node.group == "enemy") {//敌机碰撞
            let hp = otherCollider.node.getComponent('enemy').hp;
            hp--;
            if(hp==0){//敌机生命归零
                // let enemyAnim = otherCollider.node.getComponent(cc.Animation);
                //新生成一个enemy在合适的位置
                let gameScripts = cc.find("Canvas/BG").getComponent('game');
                let a = gameScripts.mathPosition();
                gameScripts.createEnemy(a[0], a[1]);//挂载的game脚本生成一个新敌人
                gameScripts.createGold(otherCollider.node.x,otherCollider.node.y);//金币生成
                if(Math.random()<0.2){
                    gameScripts.createSkill(otherCollider.node.x,otherCollider.node.y);//随机生成技能物品
                }
                otherCollider.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
                // this.bulletDestroy(enemyAnim, otherCollider);//敌机销毁
                otherCollider.node.destroy();//直接销毁敌机
            }
            otherCollider.node.getComponent('enemy').hp = hp;//重新赋值给enemy
            this.bulletDestroy(anim, selfCollider);
            // cc.log(hp);
        }
    },
    /**
     * 在enemyBullet脚本中也有同样方法，也可以调用该脚本方法
     * @param {*} anim 动画组件
     * @param {*} Collider 碰撞体
     */
    bulletDestroy(anim, Collider) {//子弹销毁方法
        anim.play();
        anim.on('finished', function () {
            Collider.node.destroy();
        }, this);
    },

    start() {

    },

    // update (dt) {},
});
