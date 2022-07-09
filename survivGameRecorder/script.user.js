// ==UserScript==
// @name         Surviv.io input replay recorder
// @namespace    https://github.com/notKaiAnderson/
// @version      1.0.0
// @description   Records lightweight game recordings, which can be reviewed with any custom mods applied
// @author       garlic
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @grant        none
// @icon         https://i.imgur.com/jgHdTYA.png
// @run-at       document-end
// @license      MIT
// ==/UserScript==

/*** contributors
 * garlic
 * samer kizi
 * preacher
 ***/

var ifsurviv = false;
if (window.zzpseudoalert && window.log) {
	window.zzpseudoalert("already active");
	return;
}
try {
	document.getElementsByClassName("ftue-header")[0].style.backgroundColor =
		"violet";
	document.getElementsByClassName("ftue-body")[0].style.backgroundColor = "red";
	ifsurviv = true;
} catch (e) {}
window.zzpseudoalert = function (e) {
	var x = document.createElement("div");
	x.style =
		"zIndex:255;position:absolute;left:30%; width:40%;top:10%;height:25%;opacity:0.5;background-color:blue;color:yellow;text-align:center;";
	x.innerHTML = e;
	document.body.append(x);
	x.style.fontSize = "20px";
	setTimeout(() => {
		x.style.opacity = 1;
	}, 200);
	setTimeout(() => {
		x.style.opacity = 0.7;
	}, 700);
	setTimeout(() => {
		x.style.opacity = 0.3;
	}, 850);
	setTimeout(() => document.body.removeChild(x), 1000);
};
window.zzpseudoalert.small = function (e) {
	var x = document.createElement("div");
	x.style =
		"zIndex:255;position:absolute;left:45%; width:10%;top:10%;height:14%;opacity:0.4;background-color:blue;color:yellow;text-align:center;";
	x.innerHTML = e;
	document.body.append(x);
	x.style.fontSize = "20px";
	setTimeout(() => document.body.removeChild(x), 1000);
};
zzpseudoalert("wsrapper init");

function arrayBufferToBase64(buffer) {
	let binary = "";
	let bytes = new Uint8Array(buffer);
	let len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
}
window.logentries = [];
window.log = {
	log: {
		version: "1.2",
		creator: {
			name: "wswrapperallium",
			version: "0.0031",
		},
		entries: window.logentries,
	},
};

var lastgameforunlink;

class RecordingWebSocket extends WebSocket {
	constructor(...args) {
		super(...args);
	}

	unlinkfromclient() {
		if (this.readyState != this.OPEN) return false;

		let seq = 0;
		let wso = this.__lientry._webSocketMessages;

		for (let i = wso.length - 1; i >= 0; i--) {
			if (wso[i].type == "send") {
				let msgab = from_base64s_ab(wso[i].data);
				let msgbytes = new Uint8Array(msgab);
				if (msgbytes[0] == 3) {
					seq = msgbytes[1];
					break;
				}
			}
		}

		var oldsend = this.send;
		Object.defineProperty(this, "send", {
			configurable: true,
			get: function () {
				return () => {};
			},
			set: function () {},
		});
		Object.defineProperty(this, "close", {
			configurable: true,
			get: function () {
				return () => {};
			},
			set: function () {},
		});

		var thisArg = this;
		function keepAlive() {
			seq = (seq + 1) & 255;
			let a;

			if (window.spectatepinginsteadofinput) {
				a = new Uint8Array(4);
				("C90bAA==");
				a[0] = 11;
				a[1] = 0;
				a[2] = 0;
				a[3] = 2;
			} else {
				a = new Uint8Array(9);

				a[0] = 3;
				a[1] = seq;
				a[3] = 255;
				a[4] = 3;
				a[5] = 8;
			}
			oldsend.apply(thisArg, [a]);
			console.info("tick", seq);
		}

		var keepAliveIt = setInterval(() => keepAlive(), 1017);
		console.info("unlink toggled", seq);
		this.onerror = () => {};
		this.onclose();
		this.onclose = () => {
			clearInterval(keepAliveIt);
			console.info("unlinked conn closed");
		};
		this.__spy_onmessage = () => {};
		return true;
	}

	send(...args) {
		let thisArg = this;
		let e = args[0];
		if (thisArg.__lientry == undefined) {
			thisArg.__lientry = {
				startedTime: new Date().toISOString(),
				time: 0,
				request: {
					method: "GET",
					url: thisArg.url,
				},
				_webSocketMessages: [],
			};
			if (ifsurviv) {
				thisArg.__lientry.__survivio = {};
				thisArg.onEach = function () {};
				if (thisArg.url.includes("/play?game")) lastgameforunlink = thisArg;
			}

			window.logentries.push(thisArg.__lientry);
			let wsa = thisArg.__lientry._webSocketMessages;
			let tos = /*thisArg.__lientry.time.toString=  */ () => {
				let t1 = 0;
				if (wsa.length > 1) {
					t1 = wsa.slice(-1)[0].time - wsa[0].time;
				}
				return t1 + "";
			};
			thisArg.__lientry.time = {
				toString: tos,
			};
			zzpseudoalert(thisArg.url.replace("wss://", "").replace("/", "<p>"));
			thisArg.__spy_onmessage = thisArg.onmessage;
			let recvHandler = function (...args) {
				let e = args[0];
				{
					let temp = {
						type: "receive",
						time: new Date().getTime() / 1e3,
						opcode: 2,
					};
					this.__lientry._webSocketMessages.push(temp);
					if (typeof e.data !== "string") {
						temp.opcode = 2;
						new Response(e.data)
							.arrayBuffer()
							.then((ifAblob) => (temp.data = arrayBufferToBase64(ifAblob)));
					} else {
						temp.opcode = 1;
						temp.message = e.data;
					}
					return this.__spy_onmessage.apply(this, args);
				}
			};
			thisArg.onmessage = recvHandler;
		}
		let temp = {
			type: "send",
			time: new Date().getTime() / 1e3,
			opcode: 2,
		};
		thisArg.__lientry._webSocketMessages.push(temp);
		if (typeof e !== "string") {
			temp.opcode = 2;
			temp.data = arrayBufferToBase64(e);
		} else {
			temp.opcode = 1;
			temp.message = e;
		}
		return super.send(...args);
	}
}
RecordingWebSocket.unlink = function () {
	let msg = "";
	if (lastgameforunlink) {
		if (lastgameforunlink.unlinkfromclient()) msg = "unlink function activated";
		else msg = "unlink function not activated";
	} else msg = "nothing";
	window.zzpseudoalert(msg);
};

window.WebSocket = RecordingWebSocket;

void "surviv .har repeat script. new103. open up at surviv.io, load .har file. f1f2f3f6 -- change replay speed";
{
	let cconsole = console.log;
	Object.defineProperty(console, "log", {
		configurable: true,
		get: function () {
			return cconsole;
		},
		set: function (e) {},
	});
}
(function () {
	"use strict";
	let cycle = (x) => (x == false ? undefined : x == undefined);
	let cycle2 = (x, y, z) => (x == y ? z : y);
	const keys = ["F1", "F2", "F3", "F4", "F6", "F7", "F8", "F9", "F10"];
	const disableKey = (key) => keys.push(key);
	["keypress", "keydown", "keyup"].forEach((type) => {
		document.addEventListener(type, (e) => {
			if (keys.indexOf(e.key) !== -1) {
				if (e.type == "keydown") {
					if (e.key == "F1") window.slowmo = 0.33;
					if (e.key == "F2") window.slowmo = 1;
					if (e.key == "F3") window.slowmo = 2;
					if (e.key == "F4") window.slowmo = 2.5;
					if (e.key == "F6") window.slowmo = 16;
					window.slowmor = window.slowmo;
				}
				return e.preventDefault();
			}
		});
	});
})();

window.slowmo = 1;
window.harRead = {
	files: [],
	games: {},
	alert: window.alert.bind(window),
};
window.foo = function () {
	function unlinkfromUI() {
		RecordingWebSocket.unlink();
	}

	function tabuntab() {
		if (!xpassblock) return;
		if (x.parentElement.id == "pass-block") {
			window.zzpseudoalert("FUG");
			x.otherwindow = window.open("", "");
			x.otherwindow.document.body.append(x);
		} else {
			xpassblock.insertBefore(x, xpassblock.firstElementChild);
			x.otherwindow.close();
		}
	}

	function saveharlog() {
		0,
			(function (filename, data) {
				try {
					var blob = new Blob([data], { type: "text/plain" });
				} catch (e) {
					alert("whoops, doesnt work");
				}

				if (window.navigator.msSaveOrOpenBlob) {
					window.navigator.msSaveBlob(blob, filename);
				} else {
					var elem = window.document.createElement("a");
					elem.href = window.URL.createObjectURL(blob);
					elem.download = filename;
					document.body.appendChild(elem);
					elem.click();
					document.body.removeChild(elem);
				}
			})(
				document.location.host +
					new Date().toISOString().slice(0, 10) +
					Date.now() +
					".har",
				JSON.stringify(log)
			);
	}

	function selmodech(tt, event, ename) {
		if (ename == "change") {
			if (tt.value == "Tab/untab") {
				('prompt("wha")');
			}
			if (tt.selectedIndex == 5) {
				saveharlog();
			}
			if (tt.selectedIndex == 0) {
				if (window.WebSocket.name == "ReplayWebSocket")
					window.WebSocket = RecordingWebSocket;
			} else {
				if (window.WebSocket.name == "RecordingWebSocket")
					window.WebSocket = ReplayWebSocket;
			}
			if (tt.selectedIndex == 1) {
				applyParsedHarFile(log);
			}
			if (tt.value == "Replay from prompt") {
				let pp = prompt("input har file, or http/file address");
				let done = false;
				if (
					pp.startsWith("file://") ||
					pp.startsWith("http") ||
					!pp.startsWith('{"log"')
				) {
					window.zzpseudoalert("trying to fetch file");
					fetch(pp)
						.then((r) => r.json())
						.then((e) => applyParsedHarFile(e));
				} else doa(pp);
				function doa(pp) {
					if (pp.startsWith('{"log"')) {
						try {
							let yi = JSON.parse(pp);
							applyParsedHarFile(yi);
						} catch (e) {
							window.zzpseudoalert("could not read/parse... failed");
						}
					}
				}
			}
		}
	}

	var xpassblock = document.getElementById("pass-block");
	("var ifsurviv=true");
	var xwin, x;
	if (!xpassblock) {
		xwin = window.open("", "");
		x = xwin.document.createElement("div");
		xwin.document.body.append(x);
		("ifsurviv=false");
	} else {
		x = document.createElement("div");
		xpassblock.insertBefore(x, xpassblock.firstElementChild);
	}

	var tt = document.createElement("select");
	tt.id = "modepl";
	tt.style =
		"background: rgb(122, 122, 122); box-shadow: rgb(62, 62, 62) 0px -3px inset; color: rgb(255, 255, 255); cursor: pointer; width: 45%; border: none; border-radius: 5px; font-size: 18px; padding: 10px 20px; text-align: center;";
	tt.innerHTML =
		"<option>Record</option><option>Replay recent</option><option>Replay from file</option><option>Replay from prompt</option><option>Tab/untab</option><option>save har log</option>";
	let captt = tt;
	tt.onchange = (e) => selmodech(captt, e, "change");
	tt.onclick = (e) => selmodech(captt, e, "click");
	x.appendChild(tt);

	var tt = document.createElement("input");
	tt.type = "button";
	tt.value = "Tab/untab";
	tt.style =
		"background: rgb(230, 80, 79); box-shadow: rgb(140, 40, 40) 0px -3px inset; color: rgb(255, 255, 255); cursor: pointer; width: 45%; border-top: none; border-radius: 5px; border-right: none; border-left: none; font-size: 18px; padding: 11px 20px; position: absolute; right: 20px;";
	tt.onclick = tabuntab;
	x.appendChild(tt);

	var tt = document.createElement("button");
	tt.value = "Unlink last game";
	tt.onclick = unlinkfromUI;
	x.appendChild(tt);

	var tt = document.createElement("select");
	tt.id = "xyz";
	tt.style =
		"background: rgb(122, 122, 122); box-shadow: rgb(62, 62, 62) 0px -2px inset; color: rgb(255, 255, 255); cursor: pointer; width: 100%; border: none; border-radius: 5px; font-size: 18px; padding: 5px 20px; margin: 5px 0px;";
	x.appendChild(tt);
	var t = document.createElement("input");
	t.type = "file";
	t.style = "position: absolute;margin-top: -35px;opacity: 0;cursor: pointer;";
	t.multiple = true;
	t.accept = ".har";
	t.id = "ssk";
	x.appendChild(t);
	if (ifsurviv) {
		document.getElementById("missions-name").style = "display:none";
		document.getElementById("pass-quest-wrapper").style = "display:none";
	}
	var skk = document.createElement("button");
	skk.id = "skk";
	skk.onclick = function () {
		document.getElementById("ssk").click();
	};
	skk.innerHTML = "Choose file";
	skk.style =
		"background: rgb(30, 144, 255);box-shadow: rgb(24, 113, 200) 0px -5px inset;color: rgb(255, 255, 255);cursor: pointer;text-shadow: rgba(0, 0, 0, 0.25) 0px 1px 2px;font-weight: 700;width: 100%;border: none;border-radius: 5px;padding: 12px 20px;font-size: 18px;";
	x.appendChild(skk);
	tt.onchange = function () {
		harRead.selected = tt.value;
	};
	let applySVGtext = function (nam, jo) {
		let ii = nam.indexOf("---");
		if (ii >= 0) nam = nam.slice(0, ii);
		let blob1 = new Blob([jo], {
			type: "image/svg+xml",
		});
		let url1 = URL.createObjectURL(blob1);
		nam = nam.replace(".svg", ".img");
		PIXI.utils.TextureCache[nam] = PIXI.Texture.fromImage(
			url1,
			undefined,
			undefined,
			2
		);
	};
	let applyParsedHarFile = function (jo) {
		window.harRead.games = {};

		window.harRead.files.push(jo);
		tt.innerHTML = "";
		if (1) {
			var ectr = 0;
			jo.log.entries.forEach((x) => {
				if (x.request.url.slice(0, 2) == "ws") {
					if (x._webSocketMessages.length < 2) return;
					var time =
						x._webSocketMessages.slice(-1)[0].time -
						x._webSocketMessages[0].time;
					time =
						((time / 60) | 0) +
						":" +
						String((time | 0) % 60).padStart(2, "0") +
						" ";
					console.log(time, x._webSocketMessages.length, x.request.url);
					var ww = x.request.url;
					var w0 = ww.lastIndexOf("=");
					var wi = ww.lastIndexOf("=");
					if (w0 >= 0 || wi >= 0) {
						var output = time + " " + ww.slice(6, 6 + 9) + ww.slice(wi);
						var qi = document.createElement("option");
						qi.value = ectr;
						qi.innerHTML = output + "";
						tt.appendChild(qi);
						harRead.games[ectr] = x;
					}
				}
				ectr += 1;
			});
		}
	};
	t.onchange = function handleFileSelect1(evt) {
		var filesreset = false;
		tt.innerHTML = "<option>loading...</option>";
		var files = evt.target.files;
		var output = [];
		for (var i = 0, f; (f = files[i]); i++) {
			if (f.name.slice(-4) == ".har" && !filesreset) {
				window.harRead.files = [];
				window.harRead.games = {};
				filesreset = true;
			}
			var fr = new FileReader();
			harRead.files.push(f);
			if (f.name.slice(-4) == ".har")
				fr.onload = function (evt) {
					if (evt.loaded == evt.total) {
						tt.innerHTML = "<option>parsing...</option>";
						try {
							var jo = JSON.parse(evt.currentTarget.result);
						} catch (e) {
							harRead.alert(
								"This file is not a valid .har file, or gabled/truncated"
							);
						}
						applyParsedHarFile(jo);
					}
				};
			else if (f.name.slice(-4) == ".svg") {
				let fname_temp = f.name;
				fr.onload = function (evt) {
					if (evt.loaded == evt.total) {
						applySVGtext(fname_temp, evt.currentTarget.result);
					}
				};
			} else
				harRead.alert(
					"I do not know what to do with " +
						f.name +
						"\nI expect .har or .svg files"
				);
			fr.readAsText(f);
		}
		console.log(output);
	};
};
if (document.readyState === "complete" || document.readyState === "interactive")
	foo();
else window.addEventListener("DOMContentLoaded", foo);

function from_base64s(base64) {
	var raw = atob(base64);
	var rawLength = raw.length;
	var array = new Uint8Array(new ArrayBuffer(rawLength));
	for (let i = 0; i < rawLength; i++) {
		array[i] = raw.charCodeAt(i);
	}
	return array;
}

function from_base64s_ab(base64) {
	var raw = atob(base64);
	var rawLength = raw.length;
	var arrayb = new ArrayBuffer(rawLength);
	var array = new Uint8Array(arrayb);
	for (let i = 0; i < rawLength; i++) {
		array[i] = raw.charCodeAt(i);
	}
	return arrayb;
}
if (1 && "weboverload") {
	("var RecordingWebSocket");
	var oldWebSocket = window.WebSocket;
	var ReplayWebSocket = function (a) {
		console.info("ws creating:", a);
		if (a) a = a.replace("wss://", "ws://");
		this.sndwo = 0;
		if (a.indexOf("-p1.surviv.io") >= 0) {
			this.binaryType = "blob";
			this.stupidsum = this.static_counter + 4;
			this.static_counter = (this.static_counter + 3) % 19;
			this.url = a;
			this.__type = "echo";
			setTimeout(() => this.__onopen(), 100);
		} else if (a.indexOf("?gameId=") >= 0) {
			this.__type = "game";
			this.wsh = harRead.games[document.getElementById("xyz").value];
			this.wso = this.wsh["_webSocketMessages"];
			this.wslen = this.wso.length;
			this.wsi = 0;
			this.binaryType = "blob";
			this.url = a;
			setTimeout(() => this.__onopen(), 100);
		}
	};
	ReplayWebSocket.name = "ReplayWebSocket";
	ReplayWebSocket.prototype = {
		OPEN: 1,
		CLOSED: 3,
		static_counter: 10,
		__onopen: function () {
			this.readyState = this.OPEN;
			this.onopen && this.onopen();
		},
		__onclose: function () {
			this.readyState = this.CLOSED;
			this.onclose && this.onclose();
		},
		__onmessage: function () {
			if (this.readyState != this.OPEN) return;
			this.onmessage &&
				this.onmessage({
					data: new Uint8Array(1),
				});
		},
		__onharmessage: function (e) {
			if (this.readyState != this.OPEN || !this.onmessage) return;
			try {
				this.onmessage(this.wsmsg);
			} catch (e) {
				console.error("onharmessage error");
				console.error(this.wsi);
				console.error(this.wsmsg);
				console.error(e);
			}
			if (this.nextmsg()) {
			} else "todo:close";
		},
		nextmsg: function () {
			while (++this.wsi < this.wslen) {
				if (this.wso[this.wsi].type == "receive") break;
			}
			if (this.wsi >= this.wslen) return false;
			var a1 = this.wso[this.wsi];
			var datat = a1.data;
			this.wsmsg = {
				data: from_base64s_ab(datat),
			};
			time =
				this.wso[this.wsi].time * 1000 +
				this.__timediff -
				new Date().getTime() * slowmo;
			if (time < -1000 || time > 4000) {
				this.__timediff =
					30 - this.wso[this.wsi].time * 1000 + new Date().getTime() * slowmo;
				time = 30;
			}
			if (time > 1) setTimeout(() => this.__onharmessage(), time);
			else this.__onharmessage();
			return true;
		},
		send: function (a) {
			this.sndwo = 0;
			if (this.__type == "echo")
				setTimeout(() => this.__onmessage(), this.stupidsum);
			if (this.__type == "game")
				if (this.__starttime == undefined) {
					this.__starttime = new Date().getTime() + 100;
					this.__timediff = this.__starttime * slowmo - this.wso[0].time * 1000;
					this.nextmsg();
				}
		},
		close: function () {
			this.readyState = this.CLOSED;
		},
	};
	("window.WebSocket = ReplayWebSocket");
}