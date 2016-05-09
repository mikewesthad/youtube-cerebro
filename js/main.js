// -- GLOBALS ------------------------------------------------------------------

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

// -- THREEJS SETUP ------------------------------------------------------------

function initScene() {	
	cssScene = new THREE.Scene();
	glScene = new THREE.Scene();

	raycaster = new THREE.Raycaster();

	var fov = 80;
	var w = window.innerWidth;
	var h = window.innerHeight;
	var aspectRatio = w / h;
	var nearClip = 0.1;
	var farClip = 2000;
	camera = new THREE.PerspectiveCamera(fov, aspectRatio, nearClip, farClip);
	camera.position.z = 400;

	css3dRenderer = new THREE.CSS3DRenderer();
	css3dRenderer.setSize(w, h);
	css3dRenderer.domElement.style.position = "absolute";
	css3dRenderer.domElement.style.top = "0";
	document.body.appendChild(css3dRenderer.domElement);

	glRenderer = new THREE.WebGLRenderer({ alpha:true });
	glRenderer.setSize(w, h);
	glRenderer.domElement.style.position = "absolute";
	glRenderer.domElement.style.top = "0";
	glRenderer.domElement.style.zIndex = 1;
	document.body.appendChild(glRenderer.domElement);

	controls = new THREE.TrackballControls(camera);
	controls.rotateSpeed = 6.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = true;
	controls.noPan = true;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;

	createVideoSphere();
}

function createVideoSphere() {
}

initScene();





}



function render() {
}
