PIXI.utils.TextureCache["player-base-01.img"]= PIXI.Texture.fromImage("https://errmeow.000webhostapp.com/imgcrap/rot520X269.png");
let rr=2;
setTimeout(()=> {
PIXI.utils.TextureCache["player-base-01.img"].baseTexture.resolution=1/rr;
PIXI.utils.TextureCache["player-base-01.img"].baseTexture.update();

PIXI.utils.TextureCache["player-base-01.img"].frame.width=64*rr|0;
PIXI.utils.TextureCache["player-base-01.img"].frame.height=64*rr|0;
PIXI.utils.TextureCache["player-base-01.img"].rotate=0;

setInterval( eek,100);
},500);

let tick=0;

function eek() {
tick = (tick+1)%32;
let x = tick %8 * 64;
let y = (tick>>3) * 64;

PIXI.utils.TextureCache["player-base-01.img"].frame.y=y*rr|0;
PIXI.utils.TextureCache["player-base-01.img"].frame.x=x*rr|0;
PIXI.utils.TextureCache["player-base-01.img"].frame.width=64*rr|0;
PIXI.utils.TextureCache["player-base-01.img"].frame.height=64*rr|0;
PIXI.utils.TextureCache["player-base-01.img"].rotate=0;

}
