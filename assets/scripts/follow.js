
cc.Class({
    extends: cc.Component,

    properties: {
        player: cc.Node,
        tiledMap: cc.TiledMap,
        camera: cc.Camera,
    },
    start() {
        let tiledSize = this.tiledMap.getTileSize();
        let layer = this.tiledMap.getLayer('wall');
        let layerSize = layer.getLayerSize();

        for (let i = 0; i < layerSize.width; i++) {
            for (let j = 0; j < layerSize.height; j++) {
                let tiled = layer.getTiledTileAt(i, j, true);
                if (tiled.gid != 0) {
                    tiled.node.group = 'wall';

                    let body = tiled.node.addComponent(cc.RigidBody);
                    body.type = cc.RigidBodyType.Static;
                    let collider = tiled.node.addComponent(cc.PhysicsBoxCollider);
                    collider.offset = cc.v2(tiledSize.width / 2, tiledSize.height / 2);
                    collider.size = tiledSize;
                    collider.apply();
                }
            }
        }
    },
    update(dt) {
        //简单的算出摄像头区域，防止黑边
        this._cameraMaxX = this.tiledMap.node.width - cc.winSize.width;
        this._cameraMaxY = this.tiledMap.node.height - cc.winSize.height;

        let playerPos = this.player.position;
        //摄像头区域设置
        if (playerPos.x > this._cameraMaxX) {
            playerPos.x = this._cameraMaxX;
        }
        if (playerPos.x < 0) {
            playerPos.x = 0;
        }
        if (playerPos.y > 0) {
            playerPos.y = 0;
        }
        if (playerPos.y < -this._cameraMaxY) {
            playerPos.y = -this._cameraMaxY;
        }
        this.camera.node.position = playerPos;
    },
});
