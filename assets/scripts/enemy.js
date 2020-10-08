const bulletSpeed = 5;
const fireTime = 15;//开火时间间隔
cc.Class({
    extends: cc.Component,

    properties: {
        enemyBullet: cc.Prefab,

    },
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.bulletNode = this.node.getChildByName("bulletNode");//拿到bulletNode节点 
        this.gameScript = cc.find("Canvas/BG").getComponent('game');//拿到BG节点上面挂载的game脚本
        this.tiledMap = cc.find("Canvas").getComponent('follow').tiledMap;//拿到瓦片地图tiledMap
        this.enemyInit();//enemy初始化
        this.enemyRotate();
        this.countTime = 0;
        this.bulletShoot();//子弹发射控制
    },
    start() {
        // this.areaCheck();//场景检测
    },
    /**
     * enemy初始化朝向，移动
     */
    enemyInit() {
        let a = Math.random() * 360;
        this.node.angle = a;
        let bulletPos = this.gameScript.localConvertWorldPointAR(this.bulletNode);
        let thisPos = this.gameScript.localConvertWorldPointAR(this.node)
        let enemyMove = cc.v2((bulletPos.x - thisPos.x) * bulletSpeed, (bulletPos.y - thisPos.y) * bulletSpeed);
        this.node.getComponent(cc.RigidBody).linearVelocity = enemyMove;
    },
    enemyRotate() {
        setInterval(() => {
            this.enemyInit()
        }, 1500);//调试转向速度
    },
    bulletShoot() {
        setInterval(() => {//子弹发射定时器(1为发射状态，0为不发射状态)
            Math.random() > 0.5 ? this.gameState = 1 : this.gameState = 0;
        }, 1000);
    },
    /**
     * @param {*} contact 
     * @param {*} selfCollider 
     * @param {*} otherCollider 
     */
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.group == 'wall') {
            this.changeState();
        } else if (otherCollider.node.group == 'player') {
            this.changeState();
        }
    },
    changeState() {
        this.enemyState = 0;
        setTimeout(() => {
            this.enemyState = 1;
        }, 100);
    },

    areaCheck() {
        setInterval(() => {
            //判断敌机的位置，超出屏幕范围就销毁(非每帧判断，节约部分性能)
            //场景限制
            if (this.node.x < 0 || this.node.x > this.tiledMap.node.width || this.node.y < 0 || this.node.y > this.tiledMap.node.height) {
                cc.log("超出屏幕");
                //新生成一个新的enemy在合适的位置
                this.node.destroy();
            }
        }, 3000);
    },
    update(dt) {
        let rigidBody = this.node.getComponent(cc.RigidBody)
        if (this.gameState == 1) {
            if (this.countTime > fireTime) {
                let bulletPos = this.gameScript.localConvertWorldPointAR(this.bulletNode);
                let thisPos = this.gameScript.localConvertWorldPointAR(this.node)
                let bullet = cc.instantiate(this.enemyBullet);
                this.bulletNode.addChild(bullet);
                //子弹发射的路径速度
                let bulletMove = cc.v2((bulletPos.x - thisPos.x) * (bulletSpeed + 10), (bulletPos.y - thisPos.y) * (bulletSpeed + 10));
                bullet.getComponent(cc.RigidBody).linearVelocity = bulletMove;
                this.countTime = 0;
            }
            this.countTime++;
        }
        if (this.enemyState == 0) {
            rigidBody.gravityScale = 1;
            rigidBody.linearVelocity = cc.v2(0, 0);
        } else {
            rigidBody.gravityScale = 0;
        }
    },
});
