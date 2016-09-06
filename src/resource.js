var res = {
    spritesheet_plist : "res/spritesheet.plist",
    spritesheet_png : "res/spritesheet.png",
    clear_png:"res/game_clear.png",
    bgm_main : "res/view.mp3",            //BGM
    bgm_clear : "res/Clear.mp3"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
