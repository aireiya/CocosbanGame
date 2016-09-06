var size;
var level = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 1],
  [1, 1, 3, 0, 2, 0, 1],
  [1, 0, 0, 4, 0, 0, 1],
  [1, 0, 3, 1, 2, 0, 1],
  [1, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1]
];

var level_map = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 1],
  [1, 1, 3, 0, 2, 0, 1],
  [1, 0, 0, 4, 0, 0, 1],
  [1, 0, 3, 1, 2, 0, 1],
  [1, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1]
];
/*
var level02 = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 1],
  [1, 1, 3, 0, 2, 0, 1],
  [1, 0, 0, 4, 0, 0, 1],
  [1, 0, 3, 1, 2, 0, 1],
  [1, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1]
];*/

var kazu = 1;

var playerPosition; //マップ内のプレイやの位置(ｘ、ｙ)を保持する
var playerSprite; //プレイヤーのスプライト
var cratesArray = []; //配置した木箱のスプライトを配列に保持する
var cratesArray_map = []; //バックで戻る方の配列

var startTouch;
var endTouch;
var swipeTolerance = 10;//スワイプかを判断する閾値

var anasuu = 0; //穴の数

var gameScene = cc.Scene.extend({
  onEnter: function() {
    this._super();

    var layer0 = new gameLayer();
    layer0.init();
    this.addChild(layer0);

  }
});

var gameLayer = cc.Layer.extend({
  init: function() {
    this._super();

    //音楽再生エンジン
    audioEngine = cc.audioEngine;
    //bgm再生
    if (!audioEngine.isMusicPlaying()) {
      //audioEngine.playMusic("res/bgm_main.mp3", true);
      audioEngine.playMusic(res.bgm_main, true);
    }

    //init()するとこ

    //スプライトフレームのキャッシュオブジェクトを作成する
    cache = cc.spriteFrameCache;
    //スプライトフレームのデータを読み込む
    cache.addSpriteFrames(res.spritesheet_plist);
    var backgroundSprite = cc.Sprite.create(cache.getSpriteFrame("background.png"));
    //アンチエイリアス処理を止める
    backgroundSprite.getTexture().setAliasTexParameters();

    backgroundSprite.setPosition(240, 160);
    //スプライトがとても小さいので拡大する
    backgroundSprite.setScale(5);
    this.addChild(backgroundSprite);

    var levelSprite = cc.Sprite.create(cache.getSpriteFrame("level.png"));
    levelSprite.setPosition(240, 110);
    levelSprite.setScale(5);
    this.addChild(levelSprite);

    for (i = 0; i < 7; i++) {　　　　　　
      cratesArray[i] = [];　 //配列オブジェクトの生成
      for (j = 0; j < 7; j++) {
        switch (/*("*/level/*0" + kazu)*/[i][j]) {
          case 2:
          anasuu++;
            break;
          case 4:
          case 6:
            playerSprite = cc.Sprite.create(cache.getSpriteFrame("player.png"));
            playerSprite.setPosition(165 + 25 * j, 185 - 25 * i);
            playerSprite.setScale(5);
            this.addChild(playerSprite);
            playerPosition = {
              x: j,
              y: i
            };　　　　　　　　　　　　
            cratesArray[i][j] = null;　 //playerがいるので、その場所には木箱はないのでnullを代入する
            break;
          case 3:
          case 5:
            var crateSprite = cc.Sprite.create(cache.getSpriteFrame("crate.png"));
            crateSprite.setPosition(165 + 25 * j, 185 - 25 * i);
            crateSprite.setScale(5);
            this.addChild(crateSprite);
            cratesArray[i][j] = crateSprite;//(i,j)の位置にcrateSpriteを入れる


            break;
          default:
            cratesArray[i][j] = null;//木箱のコード以外の場合は、その場所に木箱がない値としてnullを代入する
            break;
        }
      }
    }
/*
    var anaSprite = cc.Sprite.extend({
      ctor: function() {
        this._super();
        this.initWithFile(res.clear_png);
      if(anasuu == 0){
        levelSprite.setPosition(240, 110);
        levelSprite.setScale(5);
        this.addChild(anaSprite);
        }
      }
    });*/
    //return true;
    cc.eventManager.addListener(listener, this);
  },
});

var listener = cc.EventListener.create({
event: cc.EventListener.TOUCH_ONE_BY_ONE,
swallowTouches: true,
onTouchBegan:function (touch,event) {
startTouch = touch.getLocation();
return true;
},
onTouchEnded:function(touch, event){
endTouch = touch.getLocation();
swipeDirection();
keybord();
}
});
//スワイプ方向を検出する処理
function swipeDirection(){


    var distX = endTouch.x - startTouch.x ;
    var distY = endTouch.y - startTouch.y ;
    if(Math.abs(distX)+Math.abs(distY)>swipeTolerance){
        if(Math.abs(distX)>Math.abs(distY)){
            if(distX>0){//右方向移動
              //playerSprite.setPosition(playerSprite.getPosition().x+25,playerSprite.getPosition().y);
                move(1,0);
            }
            else{//左方向移動
              //playerSprite.setPosition(playerSprite.getPosition().x-25,playerSprite.getPosition().y);
                move(-1,0);
            }
        }
        else{
        //  console.log("endTouch.y "+endTouch.y );
        //  console.log("startTouch.y "+startTouch.y );
        //  console.log("distY "+ distY );
            if(distY>0){ //上方向移動
            //  playerSprite.setPosition(playerSprite.getPosition().x,playerSprite.getPosition().y+25);
               console.log("上 move(0,-1) distY "+ distY );
              move(0,-1);

            }
            else{ //下方向移動
              //playerSprite.setPosition(playerSprite.getPosition().x,playerSprite.getPosition().y-25);
              console.log("下 move(0,1) distY "+ distY );
              move(0,1);
            }
        }
    }
}
//----------------【↓キーボード↓】------------------
function keybord(){

  if ('keyboard' in cc.sys.capabilities) {
cc.eventManager.addListener({
  event: cc.EventListener.KEYBOARD,
  onKeyPressed: function(key, event) {
    switch (key) {
      //...
      case 66:
      for (i = 0; i < 7; i++) {　　　　　　
        for (j = 0; j < 7; j++) {

          var mapsuu = 0

          mapsuu = level_map[i][j];
          level[i][j] = mapsuu;

          //★★★switchでlevelをlevel_mapに更新(1つ前に戻る)
              switch (level[i][j]) {
                case 2:
                  break;
                case 4:
                case 6:
                  playerSprite.setPosition(165 + 25 * j, 185 - 25 * i);
                  playerPosition = {

                    x: j,
                    y: i
                  };　　　　　　　　　　　　
                  cratesArray_map[i][j] = null;　 //playerがいるので、その場所には木箱はないのでnullを代入する
                  break;
                case 3:
                case 5:
                var crateSprite = cc.Sprite.create(cache.getSpriteFrame("crate.png"));
                  crateSprite.setPosition(165 + 25 * j, 185 - 25 * i);
                  cratesArray_map[i][j] = crateSprite;//(i,j)の位置にcrateSpriteを入れる

                  break;
                default:
                  cratesArray_map[i][j] = null;//木箱のコード以外の場合は、その場所に木箱がない値としてnullを代入する
                  break;
              }
        }
      }
    }
  },
  /*
  onKeyReleased: function(key, event) {
    //...
  },*/
}, this);
}

}

//----------------【↑キーボード↑】------------------

function move(deltaX,deltaY){ //deltaはmoveの中身
  //var size = cc.director.getWinSize();
    //-------------------【↓バックで戻るやつ↓】--------------------------
      for (i = 0; i < 7; i++) {　　　　　　
        cratesArray_map[i] = [];　 //配列オブジェクトの生成
        for (j = 0; j < 7; j++) {
          switch (/*("*/level/*0" + kazu)*/[i][j]) {
            case 2:
              break;
            case 4:
            case 6:
              playerSprite.setPosition(165 + 25 * j, 185 - 25 * i);
              playerPosition = {
                x: j,
                y: i
              };　　　　　　　　　　　　
              cratesArray_map[i][j] = null;　 //playerがいるので、その場所には木箱はないのでnullを代入する
              break;
            case 3:
            case 5:
            var crateSprite = cc.Sprite.create(cache.getSpriteFrame("crate.png"));
              crateSprite.setPosition(165 + 25 * j, 185 - 25 * i);
              cratesArray_map[i][j] = crateSprite;//(i,j)の位置にcrateSpriteを入れる

              break;
            default:
              cratesArray_map[i][j] = null;//木箱のコード以外の場合は、その場所に木箱がない値としてnullを代入する
              break;
          }
        }
      }
      console.log("anasuu" + anasuu );
      //-------------------【↑バックで戻るやつ↑】--------------------------
switch(/*("*/level/*0" + kazu)*/[playerPosition.y+deltaY][playerPosition.x+deltaX]){ //もしもプレイヤーの場所+move=移動先がcaseの数字なら
    case 0:
    case 2: //ただの移動
        /*("*/level/*0" + kazu)*/[playerPosition.y][playerPosition.x]-=4;
        playerPosition.x+=deltaX;
        playerPosition.y+=deltaY;
        /*("*/level/*0" + kazu)*/[playerPosition.y][playerPosition.x]+=4;
        playerSprite.setPosition(165+25*playerPosition.x,185-25*playerPosition.y);
    break;
    case 5:
        anasuu++;
    case 3: //木箱と当たった時
        if(/*("*/level/*0" + kazu)*/[playerPosition.y+deltaY*2][playerPosition.x+deltaX*2]==0 ||
           /*("*/level/*0" + kazu)*/[playerPosition.y+deltaY*2][playerPosition.x+deltaX*2]==2){ //もしも木箱の先が床か穴だった場合
             if(/*("*/level/*0" + kazu)*/[playerPosition.y+deltaY*2][playerPosition.x+deltaX*2]==2){
               anasuu--;
             }

            /*("*/level/*0" + kazu)*/[playerPosition.y][playerPosition.x]-=4; //プレイヤーが居座ってたとこを床に
            playerPosition.x+=deltaX; //x移動
            playerPosition.y+=deltaY; //y移動
            /*("*/level/*0" + kazu)*/[playerPosition.y][playerPosition.x]+=1; //木箱[3]が居座ってるので3+1=4
            playerSprite.setPosition(165+25*playerPosition.x,185-25*playerPosition.y);//プレイヤー移動
            /*("*/level/*0" + kazu)*/[playerPosition.y+deltaY][playerPosition.x+deltaX]+=3; //木箱移動
            var movingCrate = cratesArray[playerPosition.y][playerPosition.x]; //画像移動
            movingCrate.setPosition(movingCrate.getPosition().x+25*deltaX,movingCrate.
            getPosition().y-25*deltaY);
            cratesArray[playerPosition.y+deltaY][playerPosition.x+deltaX]=movingCrate;
            cratesArray[playerPosition.y][playerPosition.x]=null; //木箱移動させたので消す

            if(anasuu == 0){
              //cc.director.runScene(new GameClearScene());
              //var label = cc.LabelTTF.create("GameClear", "Arial", 40);
              //label.setPosition(200, 200);
              //this.addChild(label, 1);
             // GameClear();
             cc.director.runScene(new GameClearScene());
            }

        }
        break;
    }
}
/*
function clearGame(){
  anasuu--;
  if(anasuu)

}
*/
