var sceneView, cortexView, leftView, rightView;
var xAxis = new THREE.Vector3(1,0,0);
var yAxis = new THREE.Vector3(0,1,0);
var zAxis = new THREE.Vector3(0,0,1);
var clock = new THREE.Clock();

function init() {
  var showStats = true;
  
  // Create the THREE.JS rendering context
  sceneView = new SceneView( "scene-view", showStats );

  // Visualization of the cortex network attached to the eyes
  cortexView = new CortexView( "cortex-view", showStats );
  
  // Visualization of the retina attached to the left eye
  leftView = new EyeView( "left-view", showStats, sceneView.scene,
                          sceneView.stereo.cameraL );
  
  // Visualization of the retina attached to the right eye
  rightView = new EyeView( "right-view", showStats, sceneView.scene,
                           sceneView.stereo.cameraR );
  
  render();
}

function render() {
  var t = Date.now()*0.0001;
  var dt = clock.getDelta();
  
  requestAnimationFrame( render );
  
  sceneView.animate(t, dt);
  sceneView.render();
  
  cortexView.animate(t, dt);
  cortexView.render();
  
  leftView.animate(t, dt);
  leftView.render();
  
  rightView.animate(t, dt);
  rightView.render();
}

function renderEyeViews() {
  stereo.update( headCam );
	sceneView.renderer.render( sceneView.scene, stereo.cameraL );
	sceneView.renderer.render( sceneView.scene, stereo.cameraR );
}

function renderCortex() {
	sceneView.renderer.render( cortex.scene, cortex.camera );
}
