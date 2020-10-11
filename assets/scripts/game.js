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
        tiledMap: cc.TiledMap,
        gold: cc.Prefab,
        skill: cc.Prefab,
        fireTime: 20,//开火时间间隔(dt)
        skillNode:cc.Node,
        playerHp:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let p = cc.director.getPhysicsManager();
        p.enabled = true;//物理属性开启
        // p.debugDrawFlags = true;//开启物理区域显示
        this.enemyNode = cc.find("Canvas/BG/TiledMap1/gameItem/enemyNode");//拿到这个节点
        cc.find('Canvas/gameMask/gameOver').active = false;
        cc.find('Canvas/gameMask/ready').active = true;
        this.gameState = 0;
        this.fireNode.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.fireNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.curretTime = 0;
        this.shootFire.active = false;
        this.skillNode.active = false;
        cc.director.pause();//游戏暂停
    },

    start() {
        for (let i = 0; i < 5; i++) {
            // this.mathPosition();
            let a = this.mathPosition();
            // cc.log(a);
            this.createEnemy(a[0], a[1]);
        }
        for (let m = 0; m < 10; m++) {
            let n = this.mathPos()
            this.createEnemy(n[0], n[1]);
        }
    },
    onBtnClick(sender,str){
        if(str == 'gameOver_leftBtn'){
            cc.director.loadScene('game');
        }else if(str == 'gameOver_rightBtn'){
            cc.director.loadScene('log')
        }else if(str == 'readyBtn'){
            cc.director.resume();
            cc.find('Canvas/gameMask/ready').active = false;
        }
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
    worldConvertLocalPoint(node, worldPoint) {
        if (node) {
            return node.convertToNodeSpaceAR(worldPoint);
        }
        return null;
    },
    mathPosition() {//玩家附近生成敌人
        let playerPos = this.localConvertWorldPointAR(this.player);
        let pos = this.worldConvertLocalPoint(this.tiledMap.node, playerPos);
        let winWidth = cc.winSize.width;
        let winHeight = cc.winSize.height;
        let x = pos.x - winWidth / 2 - 1000 + Math.random() * (winWidth / 2 + 1000) * 2;
        let y = pos.y - winHeight / 2 - 800 + Math.random() * (winHeight / 2 + 800) * 2;
        let arr = [x, y];
        return arr;
    },
    mathPos() {
        let x = Math.random() * this.tiledMap.node.width;
        let y = Math.random() * this.tiledMap.node.height;
        let arr = [x, y]
        return arr;
    },
    createEnemy(x, y) {
        let enemy = cc.instantiate(this.enemyPrefab);
        let anim = enemy.getComponent(cc.Animation);
        enemy.setPosition(x, y)
        anim.play();

        this.enemyNode.addChild(enemy);
        let enemyScripts = enemy.getComponent('enemy')
        /**脚本动态添加刚体属性，注意这里的位置**/
        let body = enemy.addComponent(cc.RigidBody);
        body.enabledContactListener = true;
        body.bullet = true;
        body.gravityScale = 0;
        body.fixedRotation = true;
        body.type = cc.RigidBodyType.Dynamic;
        let collider = enemy.addComponent(cc.PhysicsBoxCollider);
        collider.apply();
        enemyScripts.gameInit();
    },
    /**
     * @param {*} posX 
     * @param {*} posY 
     */
    createGold(posX, posY) {
        let gold = cc.instantiate(this.gold);
        this.enemyNode.addChild(gold);
        gold.setPosition(posX, posY);

        let body = gold.addComponent(cc.RigidBody)
        body.bullet = true;
        body.gravityScale = 0;
        body.fixedRotation = true;
        body.type = cc.RigidBodyType.Static;
        let collider = gold.addComponent(cc.PhysicsBoxCollider);
        collider.apply();
    },
    /**
     * @param {*} posX 
     * @param {*} posY 
     */
    createSkill(posX, posY) {
        let skill = cc.instantiate(this.skill);
        this.enemyNode.addChild(skill);
        skill.setPosition(posX, posY);

        let body = skill.addComponent(cc.RigidBody)
        body.bullet = true;
        body.gravityScale = 0;
        body.fixedRotation = true;
        body.type = cc.RigidBodyType.Static;
        let collider = skill.addComponent(cc.PhysicsBoxCollider);
        collider.apply();
    },
    update(dt) {
        // cc.log(this.player.angle);
        if (this.gameState == 1) {//判断是fire按钮按下
            if (this.curretTime > this.fireTime) {
                let bullet = cc.instantiate(this.bullet);
                //坐标系变化(子弹发射)
                let shootPos = this.localConvertWorldPointAR(this.shootFire);
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
