// -- THREEJS SETUP ------------------------------------------------------------
// -- GLOBALS ------------------------------------------------------------------

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
		autoplay: 0,
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
var cssScene, glScene, camera, glRenderer, css3dRenderer, controls, raycaster;
var isDebug = false;
var interactiveVideos = [];

var radius = 600;
var sideLength = 2 * radius / Math.sqrt(4 + 2 * Math.sqrt(2));
for (var i = 0; i < 8; i += 1) {
	var angle = i * Math.PI / 4;

	// Circle in YZ plane
	var x = 0;
	var y = radius * Math.sin(angle);
	var z = radius * Math.cos(angle);

	for (var a = 0; a < 3; a += 1) {
		var id = videoIds[THREE.Math.randInt(0, videoIds.length)];
		var pos = new THREE.Vector3(x, y, z);
		pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), a * 45);
		// TODO: Miscalculated something small here - remove smudge factor
		var object = createYouTubeObject(750, sideLength + 40, id);
		object.position.copy(pos);
		object.lookAt(new THREE.Vector3(0, 0, 0));
		scene.add(object);	
	}



}






}



function render() {
}

