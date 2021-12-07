function Cone(x, y) {
  this.x = x;
  this.y = y;
};

function GaussianDistribution(sigma) {
  var s2 = sigma*sigma;
  var rs2 = 1/s2;
  var den = 1/Math.sqrt(2*Math.PI*s2);
  return function(x) {
    return Math.exp(-0.5*x*x*rs2)*den;
  }
}
// radius: maximum size of retina
// count:  number of retina cells
// sigma:  standard deviation for distribution of retina cells
function Retina(radius, count, sigma) {
  this.maxRadius = radius;
  this.cellCount = count;
  this.density = GaussianDistribution(sigma);
  this.R = [];
  this.G = [];
  this.B = [];
  for (var i=0; i<this.cellCount; ++i) {
    var theta = 2*Math.PI*Math.random();
    var r = this.maxRadius*this.density(Math.random());
    var x = r*Math.cos(theta);
    var y = r*Math.sin(theta);
    this.R.push(new Cone(0, 0));
    this.G.push(new Cone( rSqrt3, 0));
    this.G.push(new Cone(-rSqrt3*Math.cos(Math.PI/3),
                         rSqrt3*Math.sin(Math.PI/3)));
    this.G.push(new Cone(-rSqrt3*Math.cos(Math.PI/3),
                         -rSqrt3*Math.sin(Math.PI/3)));
    this.B.push(new Cone(-rSqrt3, 0));
    this.B.push(new Cone( rSqrt3*Math.cos(Math.PI/3),
                          rSqrt3*Math.sin(Math.PI/3)));
    this.B.push(new Cone( rSqrt3*Math.cos(Math.PI/3),
                          -rSqrt3*Math.sin(Math.PI/3)));
  }
  // for (y=-this.rHalf; y<=this.rHalf; y+=dy) {
  //   var off = (bump ? 0.5 : 0);
  //   for (var x=off-this.rHalf; x<=this.rHalf; x+=dx, ++count) {
  //     var offset = count*3;
  //     this.nodePos[offset+0] = x;
  //     this.nodePos[offset+1] = y;
  //     this.nodePos[offset+2] = this.rHalf;

  //     this.nodeColors[offset+0] = 1;
	// 		this.nodeColors[offset+1] = 0;
	// 		this.nodeColors[offset+2] = 0;

	// 		this.nodesData.push( {
  //       i: Math.floor((x+this.rHalf)*this.ni/this.r),
  //       j: Math.floor((y+this.rHalf)*this.nj/this.r),
  //       k: 0,
  //       numConnections: 0
  //     } );
  //   }
  //   off = (bump ? 5.0/6.0 : 1.0/3.0);
  //   for (var x=off-this.rHalf; x<=this.rHalf; x+=dx, ++count) {
  //     var offset = count*3;
  //     this.nodePos[offset+0] = x;
  //     this.nodePos[offset+1] = y;
  //     this.nodePos[offset+2] = this.rHalf;

  //     this.nodeColors[offset+0] = 0;
	// 		this.nodeColors[offset+1] = 1;
	// 		this.nodeColors[offset+2] = 0;

	// 		this.nodesData.push( {
  //       i: Math.floor((x+this.rHalf)*this.ni/this.r),
  //       j: Math.floor((y+this.rHalf)*this.nj/this.r),
  //       k: 1,
  //       numConnections: 0
  //     } );
  //   }
  //   off = (bump ? 1.0/6.0 : 2.0/3.0);
  //   for (var x=off-this.rHalf; x<=this.rHalf; x+=dx, ++count) {
  //     var offset = count*3;
  //     this.nodePos[offset+0] = x;
  //     this.nodePos[offset+1] = y;
  //     this.nodePos[offset+2] = this.rHalf;

  //     this.nodeColors[offset+0] = 0;
	// 		this.nodeColors[offset+1] = 0;
	// 		this.nodeColors[offset+2] = 1;

	// 		this.nodesData.push( {
  //       i: Math.floor((x+this.rHalf)*this.ni/this.r),
  //       j: Math.floor((y+this.rHalf)*this.nj/this.r),
  //       k: 2,
  //       numConnections: 0
  //     } );
  //   }
  //   bump = !bump;
  // }
  // this.numRGB = this.cellCount;
}
