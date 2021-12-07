// var pngFiles = [ 'zero.png', 'one.png', 'two.png',
//                  'three.png', 'four.png', 'five.png',
//                  'six.png', 'seven.png', 'eight.png',
//                  'nine.png' ];
// pngFiles.forEach( function( fname ) {
//   loader.load( fname, function ( texture ) {
// 		imgMats.push( new THREE.MeshBasicMaterial( { map: texture,
//                                                  side: THREE.DoubleSide,
//                                                  visible: true } ) ) ;
//   } ) ;
// } ) ;

var objectURLs = [] ;
var imgMats = [] ;

var manager = new THREE.LoadingManager() ;

manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' ) ;
} ; 

manager.onLoad = function ( ) {
	console.log( 'Loading complete!' );
} ;


manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' ) ;
} ;

manager.onError = function ( url ) {
	console.log( 'There was an error loading ' + url ) ;
} ;

var loader = new THREE.TextureLoader( manager ) ;

// draw a cirlce
function drawCircle(ctx, obj) {
  ctx.strokeStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(
    obj.x, // x
    obj.y, // y
    obj.radius, // radius
    0, // start radian
    Math.PI * 2 // end radian
  );
  ctx.stroke();
} ;
 
function createWallPaper(W, H) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = W;
  canvas.height = H;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // ctx.strokeStyle = '#ff00ff';
  // ctx.fillStyle = '#ff00ff';
  // ctx.fillRect(10, 10, canvas.width-20, canvas.height-20);
  for (let i=0; i<10; ++i) {
    drawCircle(ctx, { x: Math.floor(W*Math.random()),
                      y: Math.floor(H*Math.random()),
                      radius: 10*Math.random() } );
  }
  var texture = new THREE.CanvasTexture(canvas);
	imgMats.push( new THREE.MeshBasicMaterial( { map: texture,
                                               side: THREE.DoubleSide,
                                               visible: true } ) ) ;
} ;

class SceneView extends ThreeScene {
  
  constructor(id, showStats) {
    super(id, showStats);
    var sqrt3 = Math.sqrt(3);
    
    // Small moving sphere that the saccades should be tracking
    this.sphere1 = new THREE.Mesh(new THREE.SphereGeometry(0.1),
                                  new THREE.MeshLambertMaterial({color: 0xaaffaa}));
    this.sphere1.position.x = 10;
    this.sphere1.position.y =  0;
    this.sphere1.position.z = 10;
    this.scene.add(this.sphere1);

    // Create texture for the wall
    createWallPaper(256, 256);

    // Background plane
    var num = parseInt(Math.floor(imgMats.length*Math.random()));
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 10, 10), imgMats[num]);
                               // new THREE.MeshBasicMaterial({ color: 0xff0000,
                               //                               wireframe: true,
                               //                               visible: true }));
    plane.translateZ(50);
    plane.rotateOnAxis(yAxis, Math.PI);
    this.scene.add(plane);
    
    // Head object
    // head = new THREE.Object3D();
    this.head = new THREE.Mesh(new THREE.SphereGeometry(1.0, 32, 16),
                               new THREE.MeshLambertMaterial({color: 0x00ffff,
                                                              wireframe: true}));
    this.head.translateZ(1);
    this.scene.add(this.head);

    this.headCam = new THREE.PerspectiveCamera(20, this.aspect, 0.5, 50.0);
    this.headCam.rotateOnAxis(yAxis, Math.PI);
    this.headCam.rotateOnAxis(zAxis, Math.PI);
    this.headCam.translateZ(-sqrt3/2);
    this.head.add(this.headCam);
     
    //--------------------------------------
    // Geometric representation of each eye
    var eyeL = new THREE.Mesh( new THREE.SphereGeometry(0.2, 16, 8),
                               new THREE.MeshBasicMaterial( { color: 0xffff00,
                                                              wireframe: !true } ) );
    eyeL.translateX(-0.5);
    this.headCam.add(eyeL);

    var eyeR = new THREE.Mesh( new THREE.SphereGeometry(0.2, 16, 8),
                               new THREE.MeshBasicMaterial( { color: 0xff00ff,
                                                              wireframe: !true } ) );
    eyeR.translateX( 0.5);
    this.headCam.add(eyeR);

    //--------------------------------------
    // Attached cameras
    this.stereo = new THREE.StereoCamera();
    this.stereo.eyeSep = 1.0;
  }
  
}

SceneView.prototype.animate = function(t, dt) {
  // Move the target sphere
  this.sphere1.position.x = 2*Math.cos(t);
  this.sphere1.position.y = 1*Math.sin(t);

  // Update head tracking
  this.updateHead(t, dt);
}

SceneView.prototype.updateHead = function(t, dt) {
  var motor = cortexView.getMotorOutput(dt);
  // this.head.lookAt(this.sphere1.position);
  this.head.rotateOnAxis(xAxis, motor.head.x*dt);
  this.head.rotateOnAxis(yAxis, motor.head.y*dt);
  this.stereo.update(this.headCam);
}
