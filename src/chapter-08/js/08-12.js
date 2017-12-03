function init() {

  // setup the scene for rendering
  var loaderScene = new BaseLoaderScene();
  var camera = initCamera(new THREE.Vector3(10, 10, 10));
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var loader = new THREE.PDBLoader();

  // also possible to use diamond.pdb
  loader.load("../../assets/models/molecules/aspirin.pdb", function (geometries) {

    var group = new THREE.Object3D();

    // create the atoms
    var geometryAtoms = geometries.geometryAtoms;
    var sphere = new THREE.SphereGeometry(0.2);
    for (i = 0; i < geometryAtoms.attributes.position.count; i++) {
      var startPosition = new THREE.Vector3();
      startPosition.x = geometryAtoms.attributes.position.getX(i);
      startPosition.y = geometryAtoms.attributes.position.getY(i);
      startPosition.z = geometryAtoms.attributes.position.getZ(i);

      var color = new THREE.Color();
      color.r = geometryAtoms.attributes.color.getX(i);
      color.g = geometryAtoms.attributes.color.getY(i);
      color.b = geometryAtoms.attributes.color.getZ(i);

      var material = new THREE.MeshPhongMaterial({
        color: color
      });

      var mesh = new THREE.Mesh(sphere, material);
      mesh.position.copy(startPosition);
      group.add(mesh);
    }

    // create the bindings
    var geometryBonds = geometries.geometryBonds;

    for (var j = 0; j < geometryBonds.attributes.position.count; j += 2) {
      var startPosition = new THREE.Vector3();
      startPosition.x = geometryBonds.attributes.position.getX(j);
      startPosition.y = geometryBonds.attributes.position.getY(j);
      startPosition.z = geometryBonds.attributes.position.getZ(j);

      var endPosition = new THREE.Vector3();
      endPosition.x = geometryBonds.attributes.position.getX(j + 1);
      endPosition.y = geometryBonds.attributes.position.getY(j + 1);
      endPosition.z = geometryBonds.attributes.position.getZ(j + 1);

      // use the start and end to create a curve, and use the curve to draw
      // a tube, which connects the atoms
      var path = new THREE.CatmullRomCurve3([startPosition, endPosition]);
      var tube = new THREE.TubeGeometry(path, 1, 0.04);
      var material = new THREE.MeshPhongMaterial({
        color: 0xcccccc
      });
      var mesh = new THREE.Mesh(tube, material);
      group.add(mesh);
    }

    // for (var j = 0; j < geometryBonds.vertices.length; j += 2) {
    //   var path = new THREE.SplineCurve3([geometryBonds.vertices[j], geometryBonds.vertices[j + 1]]);
    //   var tube = new THREE.TubeGeometry(path, 1, 0.04);
    //   var material = new THREE.MeshPhongMaterial({
    //     color: 0xcccccc
    //   });
    //   var mesh = new THREE.Mesh(tube, material);
    //   group.add(mesh);
    // }

    loaderScene.render(group, camera);
  });
}