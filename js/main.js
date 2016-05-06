// -- THREEJS SETUP ------------------------------------------------------------

var scene = new THREE.Scene();

var fov = 75;
var w = window.innerWidth;
var h = window.innerHeight;
var aspectRatio = w / h;
var nearClip = 0.1;
var farClip = 1000;
var camera = new THREE.PerspectiveCamera(fov, aspectRatio, nearClip, farClip);
camera.position.z = 5; // So we can see things that are placed at (0, 0, 0)

var renderer = new THREE.CSS3DRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

var controls = new THREE.TrackballControls( camera );
controls.rotateSpeed = 6.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;
controls.keys = [ 65, 83, 68 ];
controls.addEventListener( 'change', render );


// -- ADD YOUTUBE VIDEOS -------------------------------------------------------

function createYouTubeObject(width, height, videoId) {
	// Div to hold everything
	var divContainer = document.createElement("div");
	// Div to capture all mouse events
	var pointerCaptureDiv = document.createElement("div");
	pointerCaptureDiv.style.position = "absolute";
	pointerCaptureDiv.style.background = "transparent";
	pointerCaptureDiv.style.zIndex = 1; // Sit on top of iframe
	pointerCaptureDiv.style.width = width + "px";
	pointerCaptureDiv.style.height = height + "px";
	// YouTube video iframe
	var iframe = document.createElement("iframe");
	iframe.style.width = width + "px";
	iframe.style.height = height + "px";
	iframe.style.border = "0px";
	// https://developers.google.com/youtube/player_parameters?playerVersion=HTML5#Parameters
	var parameters = {
		autoplay: 1,
		controls: 0,
		disablekb: 1,
		enablejsapi: 1,
		loop: 1,
		showinfo: 0,
		cc_load_policy: 1
	};
	var url = "https://www.youtube.com/embed/" + videoId + "?";
	for (var key in parameters) {
		url += key + "=" + parameters[key] + "&";
	}
	url = url.slice(0, -1); // Remove trailing "&"
	iframe.src = url;
	// Put the DOM elements together
	divContainer.appendChild(pointerCaptureDiv);
	divContainer.appendChild(iframe);
	// Return a CSS3DObject
	return new THREE.CSS3DObject(divContainer);
}

var videoIds = [
	"K5A-xPxr5L8",
	"NtSgWZbL_kE",
	"rLy-AwdCOmI",
	"q2pBM3pbN8M",
	"8jmQ6wCDZiY",
	"38PPxQMVPA0",
	"seMCsnyNRBE",
	"NzyhVMr9i7o",
	// "EvQL0lSNprw"
];
var radius = 600;
var sideLength = 2 * radius / Math.sqrt(4 + 2 * Math.sqrt(2));
for (var i = 0; i < videoIds.length; i += 1) {
	var id = videoIds[i];
	var angle = i * Math.PI / 4;

	// Circle in YZ plane
	var x = 0;
	var y = radius * Math.sin(angle);
	var z = radius * Math.cos(angle);

	// TODO: Miscalculated something small here - remove smudge factor
	var object = createYouTubeObject(1000, sideLength + 40, id);
	object.position.set(x, y, z);
	object.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add(object);	
}


// -- LOOP & RENDER ------------------------------------------------------------

function createGameLoop(loopFunction) {
	var totalTime = 0;
	var elapsedTime = 0;
	var previousTimestamp = 0;

	function wrappedLoopFunction(currentTimestamp) {
		currentTimestamp /= 1000; // Convert time to seconds
		elapsedTime = currentTimestamp - previousTimestamp;
		previousTimestamp = currentTimestamp;
		// Cap the elapsed time at 1 second - useful if the user switches tabs
		elapsedTime = Math.min(elapsedTime, 1);
		totalTime += elapsedTime;

		// Call the game logic function
		loopFunction(elapsedTime, totalTime);

		requestAnimationFrame(wrappedLoopFunction);
	}
	requestAnimationFrame(wrappedLoopFunction);
	
}

createGameLoop(loop);

function loop(elapsedSeconds, currentTime) {
	controls.update();
	render();	
}

function render() {
	renderer.render(scene, camera);
}



// TODO: Use youtube iframe API to control videos and their volume
// 	https://developers.google.com/youtube/player_parameters#Manual_IFrame_Embeds
// var tag = document.createElement("script");
// tag.src = "https://www.youtube.com/iframe_api";
// document.body.appendChild(tag);

// var player;
// function onYouTubeIframeAPIReady() {
// 	player = new YT.Player("player", {
// 		width: "480",
// 		height: "360",
// 		videoId: "LeBiXBic3sE",
// 		events: {
// 			"onReady": onPlayerReady,
// 			"onStateChange": onPlayerStateChange
// 		}
// 	})
// }

// function onPlayerReady(event) {
// 	console.log("event:", event);
// }

// function onPlayerStateChange(event) {
// 	console.log("event:", event);	
// }
