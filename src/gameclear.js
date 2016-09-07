//gameover.js
var suu = 1;

var gameclear = cc.Layer.extend({
    ctor: function() {
        this._super();
        var size = cc.director.getWinSize();

        /*var pl = cc.Sprite.create(cache.getSpriteFrame("player.png"));
        label.setPosition(size.width / 2, size.height / 2);
        this.addChild(pl);*/

        //var label = cc.LabelTTF.create("GameOver", "Arial", 40);
        //label.setPosition(size.width / 2, size.height / 2);
        //this.addChild(label, 1); //文字つける時はこっち

        var drop01 = cc.Sprite.create(res.clear_png);　
        drop01.setPosition(size.width / 2, size.height * 0.5);　
        this.addChild(drop01);
        /*
        var drop02 = cc.Sprite.create(res.replay_png);　
        drop02.setPosition(size.width / 2, size.height * 0.2);　
        this.addChild(drop02);
        */
        //------------BGM---------

        audioEngine.stopMusic();

        audioEngine = cc.audioEngine;
        audioEngine.playEffect(res.bgm_clear);



        /*
        if (!audioEngine.isMusicPlaying()) {
          audioEngine.playMusic(res.bgm_GO, true);
        }
        */
        //-----------BGM----------
        // タップイベントリスナーを登録する

                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: this.onTouchBegan,
                    onTouchMoved: this.onTouchMoved,
                    onTouchEnded: this.onTouchEnded
                }, this);

        return true;
    },

      onTouchBegan: function(touch, event) {
        return true;
      },
      onTouchMoved: function(touch, event) {},
      onTouchEnded: function(touch, event) {
        // 次のシーンに切り替える
        audioEngine.stopMusic();
        cc.director.runScene(new gameScene ());
      },

});

var GameClearScene = cc.Scene.extend({
    onEnter: function() {
        this._super();

        // 背景レイヤーをその場で作る
        var backgroundLayer = new cc.LayerColor(new cc.Color(39, 38, 24, 128));
        this.addChild(backgroundLayer);

        var layer1 = new gameclear();
        this.addChild(layer1);
    }
});
