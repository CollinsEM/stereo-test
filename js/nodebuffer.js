// class NodeBuffer {
//   constructor(numNodes) {
//     this.numNodes = numNodes;
//     this.pos = new Float32Array( 3*this.numNodes );
//     this.col = new Float32Array( 3*this.numNodes );
//     for (var i=0, p=0, c=0; i<this.numNodes; ++i) {
//       for (var j=0; j<3; ++j) {
//         this.pos[p++] = 0.0;
//         this.col[c++] = 1.0;
//       }
//     }
//     this.geom = new THREE.BufferGeometry();
//     this.posAttrib = new THREE.BufferAttribute( this.pos, 3 );
//     this.posAttrib.setDynamic( !true );
//     this.colAttrib = new THREE.BufferAttribute( this.col, 3 );
//     this.colAttrib.setDynamic(  true );
//     this.geom.addAttribute( 'position', this.posAttrib );
//     this.geom.addAttribute(    'color', this.colAttrib );
//     this.geom.setDrawRange( 0, this.numNodes );
//     this.geom.computeBoundingSphere();
//     this.mat = new THREE.PointsMaterial( {
//       vertexColors: THREE.VertexColors,
// 	    //blending: THREE.AdditiveBlending,
// 	    transparent: true,
// 	    size: R/100,
// 	    sizeAttenuation: true
//     } );
// 	  this.mesh = new THREE.Points( this.geom, this.mat );
//   }
// }



class NodeBuffer {
  constructor(I, J, K, x0, y0, z0, R) {
    this.I = ( I !== undefined ? I : 1 );
    this.J = ( J !== undefined ? J : 1 );
    this.K = ( K !== undefined ? K : 1 );
    this.numNodes = this.I*this.J*this.K;
    this.pos = new Float32Array( 3*this.numNodes );
    this.col = new Float32Array( 3*this.numNodes );
    for (var i=0, p=0, c=0; i<this.I; ++i) {
      for (var j=0; j<this.J; ++j) {
        this.pos[p++] = x0 + R*(this.I>1 ? i/(this.I-1) - 0.5 : 0);
        this.pos[p++] = y0 + R*(this.J>1 ? j/(this.J-1) - 0.5 : 0);
        this.pos[p++] = z0 + R*(this.K>1 ? k/(this.K-1) - 0.5 : 0);
        this.col[c++] = 0.0;
        this.col[c++] = 0.0;
        this.col[c++] = 0.0;
      }
    }
    this.geom = new THREE.BufferGeometry();
    this.posAttrib = new THREE.BufferAttribute( this.pos, 3 );
    this.posAttrib.setDynamic( !true );
    this.colAttrib = new THREE.BufferAttribute( this.col, 3 );
    this.colAttrib.setDynamic(  true );
    this.geom.addAttribute( 'position', this.posAttrib );
    this.geom.addAttribute(    'color', this.colAttrib );
    this.geom.setDrawRange( 0, this.numNodes );
    this.geom.computeBoundingSphere();
    this.mat = new THREE.PointsMaterial( {
      vertexColors: THREE.VertexColors,
	    //blending: THREE.AdditiveBlending,
	    transparent: true,
	    size: R/100,
	    sizeAttenuation: true
    } );
	  this.mesh = new THREE.Points( this.geom, this.mat );
  }
}
