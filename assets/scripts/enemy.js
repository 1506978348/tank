const bulletSpeed = 5;
const fireTime = 20;//开火时间间隔
cc.Class({
    extends: cc.Component,

    properties: {
        enemyBullet: cc.Prefab,
        hp:3,
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.bulletNode = this.node.getChildByName("bulletNode");//拿到bulletNode节点 
        this.gameScript = cc.find("Canvas/BG").getComponent('game');//拿到BG节点上面挂载的game脚本
        this.tiledMap = cc.find("Canvas").getComponent('follow').tiledMap;//拿到瓦片地图tiledMap
        this.countTime = 0;
    },
    start() {
        this.areaCheck();
    },
    gameInit(){//需要在game脚本中拿到，然后调用的方法
        this.enemyInit();//enemy初始化
        this.enemyRotate();
        this.bulletShoot();//子弹发射控制
    },
    areaCheck(){//场景区域检测
        this.schedule(function () {
            if(this.node.x<0||this.node.x>this.tiledMap.node.width||this.node.y<0||this.node.y>this.tiledMap.node.height){
                // cc.log("超出场景范围");
                let a = this.gameScript.mathPosition();
                this.gameScript.createEnemy(a[0],a[1]);//生成敌人
                this.node.destroy();
            }
        },2)
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
        this.schedule(function () {
            this.enemyInit();
        }, 1.5);
    },
    bulletShoot() {
        this.schedule(function () {
            Math.random() > 0.5 ? this.gameState = 1 : this.gameState = 0;
        }, 1);
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
        } else if (otherCollider.node.group == 'enemy') {
            this.changeState();
        }
    },
    changeState() {
        this.enemyState = 0;
        this.scheduleOnce(function () {
            this.enemyState = 1;
        }, 0.1); //(function(){},时间（s）)
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
