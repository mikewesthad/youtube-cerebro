// -- GLOBALS ------------------------------------------------------------------

var cssScene, glScene, camera, glRenderer, css3dRenderer, controls, raycaster;
var isDebug = false;
var interactiveVideos = [];


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
	var radius = 600;
	var sideLength = 2 * radius / Math.sqrt(4 + 2 * Math.sqrt(2));

	// Outer loop generates positions along a ring in the YZ plane
	var i = 0;
	for (var r = 0; r < 8; r += 1) {
		var angle = r * Math.PI / 4;
		var x = 0;
		var y = radius * Math.sin(angle);
		var z = radius * Math.cos(angle);

		// Inner loop creates multiple rings so that we end up with a sphere
		for (var a = 0; a < 3; a += 1) {
			// Top of the sphere and bottom of the sphere only need to be
			// generated once.
			if ((a !== 0) && (r === 2 || r === 6)) continue;

			var id = videoIds[i];
			var pos = new THREE.Vector3(x, y, z);
			pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), a * 45);
			// TODO: Miscalculated something small here - remove smudge factor
			var interactive3dVideo = new Interactive3dVideo(pos, 750, sideLength + 40, id);
			interactive3dVideo.addToScenes(cssScene, glScene);
			interactiveVideos.push(interactive3dVideo);

			i += 1;
			if (i >= videoIds.length) i = 0;
		}
	}
}

initScene();


// -- LOAD VIDEOS --------------------------------------------------------------

// Use YouTube iframe API to load videos.  This allows the app to adjust video
// volume, playback speed, etc.
// 	https://developers.google.com/youtube/player_parameters#Manual_IFrame_Embeds

// This global function is what the YouTube API hooks into
function onYouTubeIframeAPIReady() {
	// Leave spinning loading wheel on screen for a second before starting
	window.setTimeout(loadVideos, 1000);
}

function loadVideos() {
	delayedForEach(interactiveVideos, 0, function (interactiveVideo) {	
		var placeholder = interactiveVideo.getVideoPlaceholder();
		var player = new YT.Player(placeholder, {
			width: "480",
			height: "360",
			videoId: interactiveVideo.getVideoId(),
			playerVars: {
				autoplay: 0,
				controls: 0,
				disablekb: 1,
				enablejsapi: 1,
				showinfo: 0,
				cc_load_policy: 1,
				fs: 0,
				iv_load_policy: 1,
				modestbranding: 1
			},
			events: {
				"onReady": interactiveVideo.onPlayerReady.bind(interactiveVideo),
				"onStateChange": interactiveVideo.onPlayerStateChange.bind(interactiveVideo)
			}
		});
	});
}


// -- LOOP & RENDER ------------------------------------------------------------

var mouse = {x: 0, y: 0};

function render() {
	// Set up next iteration
	window.requestAnimationFrame(render);
	// Update the youtube video objects	
	for (var i = 0; i < interactiveVideos.length; i += 1) {
		interactiveVideos[i].update();
	}
	// Update controls
	controls.update();
	// Update the raycaster using the camera and mouse position	
	raycaster.setFromCamera(mouse, camera);
	// Find the objects that intersect with the raycaster
	var intersects = raycaster.intersectObjects(glScene.children);
	if (intersects.length) {
		var firstMatch = intersects[0];
		for (var i = 0; i < interactiveVideos.length; i += 1) {
			if (interactiveVideos[i].plane.uuid === firstMatch.object.uuid) {
				interactiveVideos[i].select();
			}
			else {
				interactiveVideos[i].deselect();
			}
		}
	}
	css3dRenderer.render(cssScene, camera);
	glRenderer.render(glScene, camera);
}

function onMouseMove(event) {
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;		
}

window.addEventListener( 'mousemove', onMouseMove, false );
render();