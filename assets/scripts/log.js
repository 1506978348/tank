
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // cc.sys.localStorage.removeItem('gold');//擦除存档数据
        this.goldNum = cc.find('Canvas/Bg/bg/gold/goldLabel').getComponent(cc.Label)
        this.goldCheck();
    },
    goldCheck(){
        let a = cc.sys.localStorage.getItem('gold');
        if(!a){
            a = 0;
            cc.sys.localStorage.setItem('gold',a);
        }
        this.goldNum.string = a;
    },

    start () {

    },
    onBtnClick(sender,str){
        if(str == 'game1'){
            cc.director.loadScene('game');
        }else if(str == 'game2'){

        }
    }

    // update (dt) {},
});
