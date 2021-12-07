class EyeView extends ThreeScene {
  constructor(id, showStats, scene, camera) {
    super(id, showStats, scene, camera);
    this.scene = scene;
    this.camera = camera;
  }
}

EyeView.prototype.animate = function(t) {
}
