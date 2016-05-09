function Interactive3dVideo(position, width, height, videoId) {
	this.width = width;
	this.height = height;
	this.videoId = videoId;
	this.player = null;
	this.minVolume = 5;
	this.maxVolume = 100;
	this.createHtml();
	this.create3dObjects(position);
	this.volumeTween = null;
}

Interactive3dVideo.prototype.createHtml = function () {
	// Div to hold everything
	this.divContainer = createElement("div");
	// Div to capture all mouse events
	this.overlayDiv = createElement("div", {
		position: "absolute",
		background: "black",
		opacity: 0,
		zIndex: 1, // Sit on top of iframe
		width: this.width + "px",
		height: this.height + "px"
	}, null, this.divContainer);
	// Create video placeholder with youtube logo
    this.videoPlaceholder = createElement("div", {
    	width: this.width + "px",
    	height: this.height + "px"
    }, {
    	className: "video-placeholder"
    }, this.divContainer);
    createElement("img", null, {
    	src: "images/youtube-loading.gif"
    }, this.videoPlaceholder);
};

Interactive3dVideo.prototype.getVideoPlaceholder = function () {
	return this.videoPlaceholder;
};

Interactive3dVideo.prototype.getVideoId = function () {
	return this.videoId;
};

Interactive3dVideo.prototype.create3dObjects = function (position) {
	this.css3dObject = new THREE.CSS3DObject(this.divContainer);
	this.css3dObject.position.copy(position);
	this.css3dObject.lookAt(new THREE.Vector3(0, 0, 0));
	var randomColor = new THREE.Color(THREE.Math.randFloat(0.25, 1), 0, 1);
	var material = new THREE.MeshBasicMaterial({color: randomColor});
	material.opacity = 0.25;
	this.plane = new THREE.Mesh(new THREE.PlaneGeometry(this.width, this.height, 1, 1), material);
	this.plane.position.copy(position);
	this.plane.rotation.copy(this.css3dObject.rotation);
	if (!isDebug) material.visible = false;
};

Interactive3dVideo.prototype.select = function () {
	this.plane.material.opacity = 0.75;
	this.overlayDiv.style.opacity = 0;
	if (this.player) {
		var currentVolume = this.player.getVolume();
		// If we are already at the max, nothing else needed
		if (currentVolume === this.maxVolume) return;
		// Check if we are already tweening to the max volume
		if (this.volumeTween) {
			if (this.volumeTween.getEndValue() === this.maxVolume) return;
		}
		this.volumeTween = new Tween(this.player.getVolume(), this.maxVolume, 
									 250, "quadInOut");
	}
};

Interactive3dVideo.prototype.deselect = function () {
	this.plane.material.opacity = 0.25;
	this.overlayDiv.style.opacity = 0.6;
	if (this.player) {
		var currentVolume = this.player.getVolume();
		// If we are already at the min, nothing else needed
		if (currentVolume === this.minVolume) return;
		// Check if we are already tweening to the min volume
		if (this.volumeTween) {
			if (this.volumeTween.getEndValue() === this.minVolume) return;
		}
		this.volumeTween = new Tween(this.player.getVolume(), this.minVolume, 
									 250, "quadInOut");
	}
};

Interactive3dVideo.prototype.onPlayerReady = function (event) {
	this.player = event.target;
	this.iframe = this.player.getIframe();
	this.player.setVolume(this.minVolume);
	this.player.playVideo();
};

Interactive3dVideo.prototype.onPlayerStateChange = function (event) {
	// Loop when player ends
	if (event.data === YT.PlayerState.ENDED) {
		this.player.playVideo();
	}
};

Interactive3dVideo.prototype.addToScenes = function (cssScene, glScene) {
	cssScene.add(this.css3dObject);
	glScene.add(this.plane);
};

Interactive3dVideo.prototype.update = function () {
	if (this.volumeTween) {
		if (!this.volumeTween.isRunning) this.volumeTween = null;
		else {
			var volume = this.volumeTween.getValue();
			this.player.setVolume(volume);
			console.log(this.videoId, volume)
		}
	}
};