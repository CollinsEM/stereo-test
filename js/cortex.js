var sqrt3 = Math.sqrt(3);

var lineMaterial = new THREE.LineBasicMaterial( {
	vertexColors: THREE.VertexColors,
	//blending: THREE.AdditiveBlending,
	transparent: true
} );

class CortexView extends ThreeScene {
  constructor(id, showStats) {
    super(id, showStats);
    var R = 20;
    var RHalf = R / 2;
    var RSq = R*R;
    var mi = 10, mj = 10;       // dims of motor control layers
    var ri = 128, rj = 128;     // dims of retina sensor layers
    var li = 4, lj = 4, lk = 2; // dims of internal layers
    var nl = 1;                 // number of internal layers
    var ni = 1, nj=1;           // dims of retinal encoder
    this.mi = mi; this.mj = mj;
    this.ri = ri; this.rj = rj;
    this.li = li; this.lj = lj, this.lk = lk;
    this.nl = nl;
    this.ni = ni; this.nj = nj;

    console.log("Motor layers:    (" + mi + "x" + mj + ")");
    console.log("Retina layers:   (" + ri + "x" + rj + ")");
    console.log("Internal layers: (" + li + "x" + lj + "x" + lk + ")");
    console.log("Number of internal layers: " + nl);
    console.log("Dimension of retinal encoder: (" + ni + "x" + nj + ")");
    console.log("Total number of nodes: " + this.numNodes);

	  this.group = new THREE.Group();

    var box = new THREE.BoxGeometry( R, R, R );
	  var helper = new THREE.BoxHelper( new THREE.Mesh( box ) );
	  helper.material.color.setHex( 0x444444 );
	  helper.material.blending = THREE.AdditiveBlending;
	  helper.material.transparent = true;
	  this.group.add( helper );

    //------------------------------------------------------------------
    this.rL = new NodeBuffer(ni*ri, nj*rj, 1, 0, 0, -1.05*RHalf, R);
    this.gL = new NodeBuffer(ni*ri, nj*rj, 1, 0, 0, -1.00*RHalf, R);
    this.bL = new NodeBuffer(ni*ri, nj*rj, 1, 0, 0, -0.95*RHalf, R);
    this.rR = new NodeBuffer(ni*ri, nj*rj, 1, 0, 0,  1.05*RHalf, R);
    this.gR = new NodeBuffer(ni*ri, nj*rj, 1, 0, 0,  1.00*RHalf, R);
    this.bR = new NodeBuffer(ni*ri, nj*rj, 1, 0, 0,  0.95*RHalf, R);


	  //------------------------------------------------------------------
    // Renderable node geometry
	  this.group.add( this.rL.mesh );
	  this.group.add( this.gL.mesh );
	  this.group.add( this.bL.mesh );
	  this.group.add( this.rR.mesh );
	  this.group.add( this.gR.mesh );
	  this.group.add( this.bR.mesh );

    //------------------------------------------------------------------
    // Renderable edge geometry
	  // this.edges = new THREE.LineSegments( edges, lineMaterial );
	  // this.group.add( this.edges );

    //------------------------------------------------------------------
    // Prepare buffers for rendering to the retina nodes
    this.eyeL = new THREE.WebGLRenderTarget(ri, rj);
    this.eyeBuffL = new Uint8Array(4*ri*rj);
    this.eyeR = new THREE.WebGLRenderTarget(ri, rj);
    this.eyeBuffR = new Uint8Array(4*ri*rj);

    //------------------------------------------------------------------
	  this.scene.add( this.group );

	  this.camera.position.z = -5*R;
  }
}

function encode(val, sz, buff, idx, ri, rj, ni, nj, c) {
  // var set = new Set();
  // var count = Math.floor(val/sz);
  // while (set.size < count) {
  //   set.add(parseInt(Math.floor(sz*Math.random())));
  // }
  // set.forEach( function(idx) {
  //   var i = parseInt(idx/nj);
  //   var j = parseInt(idx%nj);
  //   buff.col[off + (i*ri + j)*3 + c] = 255;
  // } );
  var off = c;
  for (var i=0; i<ni; ++i, off+=nj*(rj-1)) {
    for (var j=0; j<nj; ++j, off+=3) {
      buff.col[idx + off] = val;
    }
  }
}

CortexView.prototype.animate = function(t) {
  this.renderer.render(sceneView.scene, sceneView.stereo.cameraL, this.eyeL, true);
  this.renderer.render(sceneView.scene, sceneView.stereo.cameraR, this.eyeR, true);
  this.renderer.readRenderTargetPixels(this.eyeL, 0, 0, this.ri, this.rj, this.eyeBuffL);
  this.renderer.readRenderTargetPixels(this.eyeR, 0, 0, this.ri, this.rj, this.eyeBuffR);

  var offset = 0;
  var sz = this.ni*this.nj; // encoder size
  var numRet = this.ri*this.rj;
  var i0 = 0, i1 = 1, i2 = 2;
  var off = 0;
  for (var i=0; i<this.ri; ++i, off+=3*this.rj*this.nj*(this.ni-1)) {
    for (var j=0; j<this.rj; ++j, i0+=4, i1+=4, i2+=4, off+=3*this.nj) {
      var rL = encode(this.eyeBuffL[i0], sz, this.rL, off, this.ri, this.rj, this.ni, this.nj, 0);
      var gL = encode(this.eyeBuffL[i1], sz, this.gL, off, this.ri, this.rj, this.ni, this.nj, 1);
      var bL = encode(this.eyeBuffL[i2], sz, this.bL, off, this.ri, this.rj, this.ni, this.nj, 2);
    
      var rR = encode(this.eyeBuffR[i0], sz, this.rR, off, this.ri, this.rj, this.ni, this.nj, 0);
      var gR = encode(this.eyeBuffR[i1], sz, this.gR, off, this.ri, this.rj, this.ni, this.nj, 1);
      var bR = encode(this.eyeBuffR[i2], sz, this.bR, off, this.ri, this.rj, this.ni, this.nj, 2);
    }
  }
  this.rL.colAttrib.needsUpdate = true;
  this.gL.colAttrib.needsUpdate = true;
  this.bL.colAttrib.needsUpdate = true;
  this.rR.colAttrib.needsUpdate = true;
  this.gR.colAttrib.needsUpdate = true;
  this.bR.colAttrib.needsUpdate = true;
}

CortexView.prototype.getMotorOutput = function(dt) {
  // Left Eye Azimuth / Declination
  var eyeL = { x: 0, y: 0 };
  // Right Eye Azimuth / Declination
  var eyeR = { x: 0, y: 0 };
  // Head Azimuth / Declination
  var head = { x: 0, y: 0 };
  // var dx = 2.0/(this.ri-1);
  // var dy = 2.0/(this.rj-1);
  // for (var j=0, y=-1, p=0; j<this.rj; ++j, y+=dy, p+=4) {
  //   for (var i=0, x=-1; i<this.ri; ++i, x+=dx) {
  //     var rSq = x*x + y*y;
  //     for (var k=0; k<3; ++k) {
  //       eyeL.x += x*this.eyeBuffL[p+k]/rSq;
  //       eyeL.y += y*this.eyeBuffL[p+k]/rSq;
  //       eyeR.x += x*this.eyeBuffR[p+k]/rSq;
  //       eyeR.y += y*this.eyeBuffR[p+k]/rSq;
  //     }
  //   }
  // }
  return {
    eyeL: eyeL,
    eyeR: eyeR,
    head: { x: 0.0, y: 0.0 }
  };
}
