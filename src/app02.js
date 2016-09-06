/*var size;
var level02 = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 3, 0, 1],
  [1, 0, 3, 4, 2, 0, 1],
  [1, 0, 0, 1, 2, 0, 1],
  [1, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1]
];
var playerPosition02; //マップ内のプレイやの位置(ｘ、ｙ)を保持する
var playerSprite02; //プレイヤーのスプライト
var cratesArray02 = []; //配置した木箱のスプライトを配列に保持する

var startTouch02;
var endTouch02;
var swipeTolerance02 = 10;//スワイプかを判断する閾値

var anasuu02 = 0; //穴の数

var gameScene02 = cc.Scene.extend({
  onEnter: function() {
    this._super();

    var layer0 = new gameLayer02();
    layer0.init();
    this.addChild(layer0);

  }
});

var gameLayer02 = cc.Layer.extend({
  init: function() {
    this._super();
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

    var levelSprite02 = cc.Sprite.create(cache.getSpriteFrame("level.png"));
    levelSprite.setPosition(240, 110);
    levelSprite.setScale(5);
    this.addChild(levelSprite02);

    for (i = 0; i < 7; i++) {　　　　　　
      cratesArray02[i] = [];　 //配列オブジェクトの生成
      for (j = 0; j < 7; j++) {
        switch (level02[i][j]) {
          case 2:
            anasuu02 += 1;
            break;
          case 4:
          case 6:
            playerSprite02 = cc.Sprite.create(cache.getSpriteFrame("player.png"));
            playerSprite02.setPosition(165 + 25 * j, 185 - 25 * i);
            playerSprite02.setScale(5);
            this.addChild(playerSprite02);
            playerPosition02 = {
              x: j,
              y: i
            };　　　　　　　　　　　　
            cratesArray02[i][j] = null;　 //playerがいるので、その場所には木箱はないのでnullを代入する
            break;
          case 3:
          case 5:
            var crateSprite = cc.Sprite.create(cache.getSpriteFrame("crate.png"));
            crateSprite.setPosition(165 + 25 * j, 185 - 25 * i);
            crateSprite.setScale(5);
            this.addChild(crateSprite);
            cratesArray02[i][j] = crateSprite;//(i,j)の位置にcrateSpriteを入れる


            break;
          default:
            cratesArray02[i][j] = null;//木箱のコード以外の場合は、その場所に木箱がない値としてnullを代入する
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
    /*
    cc.eventManager.addListener(listener, this);
  },
});

var listener = cc.EventListener.create({
event: cc.EventListener.TOUCH_ONE_BY_ONE,
swallowTouches: true,
onTouchBegan:function (touch,event) {
startTouch02 = touch.getLocation();
return true;
},
onTouchEnded:function(touch, event){
endTouch02 = touch.getLocation();
swipeDirection();
}
});
//スワイプ方向を検出する処理
function swipeDirection(){


    var distX02 = endTouch02.x - startTouch02.x ;
    var distY02 = endTouch02.y - startTouch02.y ;
    if(Math.abs(distX02)+Math.abs(distY02)>swipeTolerance02){
        if(Math.abs(distX02)>Math.abs(distY02)){
            if(distX02>0){//右方向移動
              //playerSprite.setPosition(playerSprite.getPosition().x+25,playerSprite.getPosition().y);
                move02(1,0);
            }
            else{//左方向移動
              //playerSprite.setPosition(playerSprite.getPosition().x-25,playerSprite.getPosition().y);
                move02(-1,0);
            }
        }
        else{
        //  console.log("endTouch.y "+endTouch.y );
        //  console.log("startTouch.y "+startTouch.y );
        //  console.log("distY "+ distY );
            if(distY02>0){ //上方向移動
            //  playerSprite.setPosition(playerSprite.getPosition().x,playerSprite.getPosition().y+25);
               console.log("上 move(0,-1) distY "+ distY02 );
              move02(0,-1);

            }
            else{ //下方向移動
              //playerSprite.setPosition(playerSprite.getPosition().x,playerSprite.getPosition().y-25);
              console.log("下 move(0,1) distY "+ distY02 );
              move02(0,1);
            }
        }
    }
}

function move02(deltaX02,deltaY02){ //deltaはmoveの中身
  //var size = cc.director.getWinSize();
switch(level02[playerPosition02.y+deltaY02][playerPosition02.x+deltaX02]){ //もしもプレイヤーの場所+move=移動先がcaseの数字なら
    case 0:
    case 2: //ただの移動
        level02[playerPosition02.y][playerPosition02.x]-=4;
        playerPosition02.x+=deltaX02;
        playerPosition02.y+=deltaY02;
        level02[playerPosition02.y][playerPosition02.x]+=4;
        playerSprite02.setPosition(165+25*playerPosition02.x,185-25*playerPosition02.y);
    break;
    case 5:
        anasuu02++;
    case 3: //木箱と当たった時
        if(level02[playerPosition02.y+deltaY02*2][playerPosition02.x+deltaX02*2]==0 ||
           level02[playerPosition02.y+deltaY02*2][playerPosition02.x+deltaX02*2]==2){ //もしも木箱の先が床か穴だった場合
             if(level02[playerPosition02.y+deltaY02*2][playerPosition02.x+deltaX02*2]==2){
               anasuu02--;
             }

            level02[playerPosition02.y][playerPosition02.x]-=4; //プレイヤーが居座ってたとこを床に
            playerPosition02.x+=deltaX02; //x移動
            playerPosition02.y+=deltaY02; //y移動
            level02[playerPosition02.y][playerPosition02.x]+=1; //木箱[3]が居座ってるので3+1=4
            playerSprite02.setPosition(165+25*playerPosition02.x,185-25*playerPosition02.y);//プレイヤー移動
            level02[playerPosition02.y+deltaY02][playerPosition02.x+deltaX02]+=3; //木箱移動
            var movingCrate02 = cratesArray02[playerPosition02.y][playerPosition02.x]; //画像移動
            movingCrate02.setPosition(movingCrate02.getPosition().x+25*deltaX02,movingCrate02.
            getPosition().y-25*deltaY02);
            cratesArray02[playerPosition02.y+deltaY02][playerPosition02.x+deltaX02]=movingCrate02;
            cratesArray02[playerPosition02.y][playerPosition02.x]=null; //木箱移動させたので消す

            if(anasuu02 == 0){
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
