var size;
/*
var level01 = [
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
*/
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

var level;
var level_map;

var stage = 1;

var kazu = 1;

var playerPosition; //マップ内のプレイやの位置(ｘ、ｙ)を保持する
var playerSprite; //プレイヤーのスプライト
var cratesArray = []; //配置した木箱のスプライトを配列に保持する
var cratesArray_map = []; //バックで戻る方の木箱配列
var backlevel_map = []; //バックで戻る時の配列
var def_crates = []; //初期する木箱配列

var startTouch;
var endTouch;
var swipeTolerance = 10;//スワイプかを判断する閾値

var anasuu = 0; //穴の数

var gameScene = cc.Scene.extend({
  onEnter: function() {
    this._super();

    stagesel(); //ステージ変える
    stagesel_map(); //ステージのバックアップ

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
      def_crates[i] = []; //リセット用生成
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
            var def = cratesArray[i][j];
            def_crates[i][j] = def;
            break;
          case 3:
          case 5:
            var crateSprite = cc.Sprite.create(cache.getSpriteFrame("crate.png"));
            crateSprite.setPosition(165 + 25 * j, 185 - 25 * i);
            crateSprite.setScale(5);
            this.addChild(crateSprite);
            cratesArray[i][j] = crateSprite;//(i,j)の位置にcrateSpriteを入れる

            var def = cratesArray[i][j];
            def_crates[i][j] = def;

            break;
          default:
            cratesArray[i][j] = null;//木箱のコード以外の場合は、その場所に木箱がない値としてnullを代入する

            var def = cratesArray[i][j];
            def_crates[i][j] = def;
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
    //-------------↓キーボード↓-------------
    cc.eventManager.addListener({
      event: cc.EventListener.KEYBOARD,
      onKeyPressed: function(keyCode, event) {
        if(keyCode == 82){
          console.log("r押した" );
          resetmap();
        }
        if(keyCode == 66){
          console.log("b押した" );
          backmap();
        }
      },
    }, this);
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

function move(deltaX,deltaY){ //deltaはmoveの中身
  //var size = cc.director.getWinSize();
    //-------------------【↓１個まえに戻るためのバックアップ↓】--------------------------
    for (var i = 0; i < 7; i++){
          cratesArray_map[i] = [];
          backlevel_map[i] = [];
        for (var j = 0; j < 7; j++){
          var back1 = level[i][j];
                 backlevel_map[i][j] = back1;
          var back2 = cratesArray[i][j];
                 cratesArray_map[i][j] = back2;
        }
      }
      //-------------------【↑バックアップ↑】--------------------------
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
                stage += 1;

                if(stage > 3){
                    stage = 1;
                }
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


function resetmap(){
  for (i = 0; i < 7; i++) {　　　　　　
    for (j = 0; j < 7; j++) {

      var mapsuu = level_map[i][j];
      level[i][j] = mapsuu;

      //★★★switchでlevelをlevel_mapに更新(1つ前に戻る)
          switch (level[i][j]) {
            case 2:　//穴
              break;
            case 4: //プレイヤー
            case 6:
              playerSprite.setPosition(165 + 25 * j, 185 - 25 * i);
              playerPosition = {

                x: j,
                y: i
              };　　　　　　　　　　　　
              var def = def_crates[i][j];
              cratesArray[i][j] = def;
              break;
            case 3: //木箱
            case 5:
            var def = def_crates[i][j];
            cratesArray[i][j] = def;
              var crateSprite = cratesArray[i][j];
              crateSprite.setPosition(165 + 25 * j, 185 - 25 * i);

              break;
            default:
            var def = def_crates[i][j];
            cratesArray[i][j] = def;
              break;
          }
    }
  }
}

function backmap() {

  for (i = 0; i < 7; i++) {　　　　　　
    for (j = 0; j < 7; j++) {

      var mapsuu = backlevel_map[i][j];
      level[i][j] = mapsuu;

      //★★★switchでlevelをlevel_mapに更新(1つ前に戻る)
          switch (level[i][j]) {
            case 2:　//穴
              break;
            case 4: //プレイヤー
            case 6:
              playerSprite.setPosition(165 + 25 * j, 185 - 25 * i);
              playerPosition = {

                x: j,
                y: i
              };　　　　　　　　　　　　
              var back02 = cratesArray_map[i][j];
              cratesArray[i][j] = back02;
              break;
            case 3: //木箱
            case 5:
              var back02 = cratesArray_map[i][j];
              cratesArray[i][j] = back02;
              var crateSprite = cratesArray[i][j];
              crateSprite.setPosition(165 + 25 * j, 185 - 25 * i);

              break;
            default:
              var back02 = cratesArray_map[i][j];
              cratesArray[i][j] = back02;
              break;
          }
    }
  }

}

function stagesel (){
    switch(stage){
      case 1:
          level = [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 0, 0, 0, 0, 1],
            [1, 1, 3, 0, 2, 0, 1],
            [1, 0, 0, 4, 0, 0, 1],
            [1, 0, 3, 1, 2, 0, 1],
            [1, 0, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1]
          ];
        break;

      case 2:
        level = [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 0, 0, 0, 0, 1],
          [1, 1, 0, 3, 2, 0, 1],
          [1, 0, 3, 4, 0, 0, 1],
          [1, 0, 0, 1, 2, 0, 1],
          [1, 0, 0, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1]
      ];
        break;

      case 3:
        level = [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 0, 0, 0, 0, 1],
          [1, 1, 3, 0, 2, 0, 1],
          [1, 0, 0, 4, 0, 0, 1],
          [1, 0, 3, 1, 2, 0, 1],
          [1, 0, 0, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1]
        ];
        break;
    }
}

function stagesel_map(){
  switch(stage){
    case 1:
        level_map = [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 0, 0, 0, 0, 1],
          [1, 1, 3, 0, 2, 0, 1],
          [1, 0, 0, 4, 0, 0, 1],
          [1, 0, 3, 1, 2, 0, 1],
          [1, 0, 0, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1]
        ];
      break;

    case 2:
      level_map = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 0, 0, 0, 0, 1],
        [1, 1, 0, 3, 2, 0, 1],
        [1, 0, 3, 4, 0, 0, 1],
        [1, 0, 0, 1, 2, 0, 1],
        [1, 0, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
      break;

    case 3:
      level_map = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 0, 0, 0, 0, 1],
        [1, 1, 3, 0, 2, 0, 1],
        [1, 0, 0, 4, 0, 0, 1],
        [1, 0, 3, 1, 2, 0, 1],
        [1, 0, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
      break;
  }
}

//----------------【↑キーボード↑】------------------
