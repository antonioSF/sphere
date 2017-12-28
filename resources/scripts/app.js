const THREE = require('three');
import Detector from './core/Detector';

const App = App || {};

const AddEvent = function(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
};

App.init = ((window, document, undefined) => {


	const main = () => {
		function init() {
	  		var scene = new THREE.Scene();

		  	var camera = new THREE.PerspectiveCamera(
		    	45,
		    	window.innerWidth / window.innerHeight,
		    	1,
		    	1000
		  	);
		  	camera.position.z = 100;
		  	camera.position.x = 0;
		  	camera.position.y = 5;
		  	camera.lookAt(new THREE.Vector3(0, 0, 0));

		  	var texture = new THREE.CanvasTexture(generateTexture());
		  	texture.needsUpdate = true;

		  	function generateTexture() {
		    	var size = 4;

		    	var canvas = document.createElement("canvas");
		    	canvas.width = size;
		    	canvas.height = size;

			    var context = canvas.getContext("2d");
			    var gradient = context.createRadialGradient(
			      	canvas.width / 2,
			      	canvas.height / 2,
			      	0,
			      	canvas.width / 2,
			      	canvas.height / 2,
			      	canvas.width / 2
			    );

			    gradient.addColorStop(0, "rgba(150,150,150,1)");
			    //gradient.addColorStop(0.2, "rgba(150,150,150,1)");
			    //gradient.addColorStop(0.4, "rgba(150,150,150,1)");
			    gradient.addColorStop(1, "rgba(33,33,33,0)");


		    	context.fillStyle = gradient;
		    	context.fillRect(0, 0, canvas.width, canvas.height);

		    	return canvas;
		  	}

		  	var material = new THREE.PointsMaterial({
		    	color: "rgb(255, 255, 255)",
		    	size: 0.25,
		    	map: texture,
		    	transparent: true,
		    	blending: THREE.AdditiveBlending,
		    	depthWrite: false
		  	});

		  	var geometry = new THREE.SphereGeometry(10, 80,80);

		  	geometry.vertices.forEach(function(vertex) {
		    	vertex.x += Math.random() - 0.15;
		    	vertex.y += Math.random() - 0.15;
		    	vertex.z += Math.random() - 0.15;
		  	});

		  	var particles = new THREE.Points(geometry, material);
		  	particles.name = "particles";

		  	scene.add(particles);

		  	var renderer = new THREE.WebGLRenderer({ alpha: true });
		  	renderer.setSize(window.innerWidth, window.innerHeight);
		  	renderer.setClearColor(0x1f1f1f, 0);
		  	document.getElementById("webgl").appendChild(renderer.domElement);

		  	update(renderer, scene, camera);

		  	console.clear();
		  	if (scene.getObjectByName('particles')) {
		  		console.log('hello world');
		  	} else {

		  	}
			  	
		  	return scene;
		}

		function update(renderer, scene, camera) {

		  	renderer.render(scene, camera);

		  	var particles = scene.getObjectByName("particles");
		  	particles.rotation.y += 0.005;

		  	requestAnimationFrame(function() {
		    	update(renderer, scene, camera);
		    	var updateScene = setInterval(() => {
		    		if (camera.position.z > 7) {
		    			camera.position.z -= 0.005;
		    		} else {
		    			camera.position.z = 7;
		    		}

		    	}, 200);
		    	
		    	//memory leek!!
		  		/*let zoomSphere = (() => {
		  			camera.position.z -= 0.005;
		  		});
		  		let handle = null;

		  		if (camera.position.z > 7) {
		    		handle = setInterval(zoomSphere, 200);
		    	} else {
		    		camera.position.z = 7;
		    		clearInterval(handle);
		    		handle = 0;
		    	}*/

		  	});

		  	AddEvent(window, "resize", function(event) {
		  		camera.aspect = window.innerWidth / window.innerHeight;
		    	camera.updateProjectionMatrix();
		    	renderer.setSize( window.innerWidth, window.innerHeight );
		  	});

		};


		var scene = Detector.webgl ? init() : console.log('webgl not supported');

	};

	return {
		main: main
	}

})(window, document);

App.init.main();