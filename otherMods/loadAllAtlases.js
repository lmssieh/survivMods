let xo = document.createElement("div");
xo.style = "position:absolute; left:0px; right:0px";

/*6e13f3b7.atlas_hires*/
/*aaf70d05.atlas_lowres*/

function getlistfromobjs(param) {
	let sprites = [];
	for (var e of param) {
		for (var e1 in e) {
			for (var e2 in e[e1]) {
				var ux = e[e1][e2].meta.image;
				sprites.push(ux);
			}
		}
	}
	return sprites;
}

var get = webpackR || funcxyz.get;
var rr = getlistfromobjs([get("6e13f3b7"), get("aaf70d05")]);

for (let ea of rr) {
	xo.innerHTML += `<img src="assets/${ea}">\n`;
}

document.body.append(xo);
