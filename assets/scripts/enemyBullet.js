
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.gameScript = cc.find("Canvas/BG").getComponent('game');//拿到BG节点上面挂载的game脚本
        this.goldLabel = cc.find('Canvas/BG/gameItem/gold/goldLabel');
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
            this.gameScript.playerHp.getComponent(cc.Sprite).fillRange+=0.2;
            if(this.gameScript.playerHp.getComponent(cc.Sprite).fillRange>=0){
                // cc.log('死亡逻辑')
                otherCollider.node.destroy();
                // cc.director.pause();
                cc.find('Canvas/gameMask/gameOver').active = true;
                cc.find('Canvas/gameMask/gameOver/gold/goldLabel').getComponent(cc.Label).string = this.goldLabel.getComponent(cc.Label).string;
                this.goldLabel.getComponent(cc.Label).string = 0;//游戏场景中的金币置0
                let goldNum = cc.sys.localStorage.getItem('gold');
                let a = Number(cc.find('Canvas/gameMask/gameOver/gold/goldLabel').getComponent(cc.Label).string)+Number(goldNum);
                cc.sys.localStorage.setItem('gold',a);//存储金币数量
                cc.director.pause();//游戏暂停
            }

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
