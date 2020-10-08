const fireTime = 10;//开火时间间隔(dt)
const bulletSpeed = 15;
cc.Class({
    extends: cc.Component,

    properties: {
        fireNode: cc.Node,//按钮位置
        shootNode: cc.Node,//生成位置
        shootFire: cc.Node,//炮管火焰位置
        bullet: cc.Prefab,
        player: cc.Node,
        enemyPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let p = cc.director.getPhysicsManager();
        p.enabled = true;//物理属性开启
        // p.debugDrawFlags = true;//开启物理区域

        this.gameState = 0;
        this.fireNode.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.fireNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.curretTime = 0;
        this.shootFire.active = false;
    },

    start() {
        //生成敌人
        // for (let i = 0; i < 10; i++) {
            this.createEnemy();
        // }
    },
    touchStart() {//fireBtn按下
        this.gameState = 1;
        this.shootFire.active = true;
    },
    touchEnd() {//fireBtn抬起
        this.gameState = 0;
        this.shootFire.active = false;
    },
    localConvertWorldPointAR(node) {
        if (node) {
            return node.convertToWorldSpaceAR(cc.v2(0, 0));
        }
        return null;
    },
    createEnemy() {
        let enemyNode = cc.find("Canvas/BG/TiledMap1/gameItem/enemyNode");//拿到这个节点
        let enemy = cc.instantiate(this.enemyPrefab);
        let winWidth = cc.winSize.width;
        let winHeight = cc.winSize.height;
        cc.log(winWidth,winHeight);
        let x = this.player.x - winWidth / 2 - 300 + Math.random() * (winWidth / 2 + 300) * 2;
        let y = this.player.y - winHeight / 2 - 300 + Math.random() * (winHeight / 2 + 300) * 2;
        enemy.setPosition=cc.v2(x, y);
        enemy.parent = enemyNode;
    },
    update(dt) {
        // cc.log(this.player.angle);
        if (this.gameState == 1) {//判断是fire按钮按下
            if (this.curretTime > fireTime) {
                let bullet = cc.instantiate(this.bullet);
                //坐标系变化(子弹发射)
                let shootPos = this.localConvertWorldPointAR(this.shootNode);
                let playerNode = this.localConvertWorldPointAR(this.player);
                /**
                 * bullet移动
                 */
                let bulletMove = cc.v2((shootPos.x - playerNode.x) * bulletSpeed, (shootPos.y - playerNode.y) * bulletSpeed);
                bullet.getComponent(cc.RigidBody).linearVelocity = bulletMove;

                bullet.parent = this.shootNode;
                this.curretTime = 0;
            }
            this.curretTime++;
            // cc.log(this.curretTime)
        }
    },

});
