import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';
import { ColladaLoader } from './lib/ColladaLoader.js';

var camera, controls, scene, renderer; 
const mouse = new THREE.Vector2();


var ecrouCentre ;
var childrens = [];
var aiguilles = []; var cadrans = []; var ecrouLaitons = []; var tirettes = [];
var objectMove = [];
var objetchargee = 0;
var raycaster = new THREE.Raycaster();

init();
renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
animate();

function init() {

     // Scene
     scene = new THREE.Scene();
     scene.background = new THREE.Color( 0xD9EFFF );
     //scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

     // Rendu sur la page
     renderer = new THREE.WebGLRenderer( { antialias: true } );
     renderer.setPixelRatio( window.devicePixelRatio );
     renderer.setSize( window.innerWidth, window.innerHeight );
     document.body.appendChild( renderer.domElement );

     //Camera
     camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
     camera.position.set( 20, 20, 0 );

     // Controles
     controls = new OrbitControls( camera, renderer.domElement );
     controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
     controls.dampingFactor = 0.05;
     controls.screenSpacePanning = false;
     controls.minDistance = 5;
     controls.maxDistance = 30;

   // instantiate a loader 
   var loader = new ColladaLoader();
   // instancie une roue
   loader.load( 'modeles_3D/arithmaurel.dae',

       // Function when resource is loaded

       function (collada) {
         
          for(var i = 0 ; i < collada.scene.children.length  ; i++){ childrens.push(collada.scene.children[i]); }
          // affichage de la scene
          childrens = collada.scene.children;
           scene.add(collada.scene);
           console.log(collada.scene.children)
          console.log("ok")
          // recuperations des elements
         stockeObject(childrens)
        //   scene.add(collada.scene.children[2]);
		   
       },
       // Function called when download progresses
       function (xhr) {
           console.log((xhr.loaded / xhr.total * 100) + '% loaded');
       }
   );
   // charger et positionner les autres éléments en dupliquant le code précédent

     // Lumiere
     /*
     var light = new THREE.DirectionalLight( 0xffffff );
     light.position.set( 1, 1, 1 );
     scene.add( light );

     var light = new THREE.DirectionalLight( 0x002288 );
     light.position.set( - 1, - 1, - 1 );
     scene.add( light );

     var light = new THREE.AmbientLight( 0x222222 );
     scene.add( light );
     */
     var lightAmb = new THREE.AmbientLight (0xffffff)
     scene.add(lightAmb)
     
     window.addEventListener( 'resize', onWindowResize, false );
}

// fonction qui initialise les objets mobiles
function stockeObject(childrens){
     ecrouCentre = childrens[24];
     objectMove.push(ecrouCentre.children[0])
     objectMove.push(ecrouCentre.children[1])
     objectMove.push(ecrouCentre.children[2])


     //childrenList(childrens[24])
     //console.log(ecrouCentre)
     for(let i = 0; i <= 7; i++){
          cadrans.push(childrens[i])
     }
     //console.log(cadrans)

     for(let i = 12 ;i <= 19; i++){
          tirettes.push(childrens[i])
          objectMove.push(childrens[i].children[12])
          objectMove.push(childrens[i].children[10])
          
     }
     console.log(tirettes)
     for(let i = 8 ;i <= 11; i++){
          aiguilles.push(childrens[i])
     }
     aiguilles.reverse()
     //console.log(aiguilles)
     for(let i = 20 ;i <= 23; i++){
          ecrouLaitons.push(childrens[i])
         objectMove.push(childrens[i].children[0])
        
     }
     ecrouLaitons.reverse()
    //console.log(ecrouLaitons)
     objetchargee = 1
     console.log("object")
     console.log(objectMove)
}

function onWindowResize() {
     camera.aspect = window.innerWidth / window.innerHeight;
     camera.updateProjectionMatrix();
     renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
     requestAnimationFrame( animate );
  
     controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
     render();
}




function render() {
  
    renderer.render( scene, camera );
  
}    


/**
 * Lorsque la souris bouge, met a jour coordonnee de la souris
 */
function onDocumentMouseMove(event){
     //console.log(event)
     //console.log("move")
     // recupere position de la souris quand on bouge
     mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
     //console.log(mouse)


     // si on a le bouton down et que un objet a ete selectionne, on peut bouger l'objet
     raycaster.setFromCamera( mouse, camera );


}


function onDocumentMouseUp(event){
     console.log("up")
     controls.enabled = true;
}


function onDocumentMouseDown(event){
     console.log("down")
     raycaster.setFromCamera( mouse, camera );
    // console.log("o")
     // quand on appuie sur la souris, teste si on intercepte un objet mobile
     // puis on traite les différents cas en fonction de l'objet selectionné
     // ecrou laiton, ecrouCentre, tirette
	const intersects = raycaster.intersectObjects(objectMove);
    // console.log(ecrouCentre.children[0])
     // on a intercepté avec une image
     if ( intersects.length > 0 ) {
         console.log(intersects)
         // stoppe le controle sur les deplacements pour pouvoir bouger l'objet
         controls.enabled = false;

     }

     // on stoppe le control pour la position de l'arithmmaurel
    // controls.enabled = false;
}

