const THREE = require('three');
import Detector from './Detector';

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

const isMobile = () => window.matchMedia('(max-width: 64rem)').matches;

const Sphere = ((window, document, undefined) => {
	let winWidth = window.innerWidth, winHeight = window.innerHeight;
	
	let windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2;
	
	let mouseX = 0, mouseY = 0;

	let scene, camera, renderer;

	const _generateTexture = () => {
    	let size = 4;

    	let canvas = document.createElement("canvas");
    	canvas.width = size;
    	canvas.height = size;

	    let context = canvas.getContext("2d");
	    let gradient = context.createRadialGradient(
	      	canvas.width / 2,
	      	canvas.height / 2,
	      	0,
	      	canvas.width / 2,
	      	canvas.height / 2,
	      	canvas.width / 2
	    );

	    gradient.addColorStop(0, "rgba(150,150,150,1)");
	    gradient.addColorStop(0.2, "rgba(150,150,150,1)");
	    gradient.addColorStop(0.4, "rgba(150,150,150,1)");
	    gradient.addColorStop(1, "rgba(31,31,31,1)");


    	context.fillStyle = gradient;
    	context.fillRect(0, 0, canvas.width, canvas.height);

    	return canvas;
  	};

  	const _texture = new THREE.CanvasTexture(_generateTexture());

	const _particlesMaterial = new THREE.PointsMaterial({
		color: 0xe0e0e0,
		size: 0.25,
		map: _texture,
		transparent: true,
		blending: THREE.AdditiveBlending,
		depthWrite: false
	});

	const _linesMaterial = new THREE.LineBasicMaterial({ 
		color: 0xe0e0e0,
		transparent: true,
		blending: THREE.AdditiveBlending,
		depthWrite: false, 
		opacity: (!isMobile()) ? 0.5 : 0.2
	});

	const _render = () => {
		let time = Date.now() * 0.0001;

		camera.position.x += ((mouseX / 10) - camera.position.x) * .05;
		camera.position.y += (- (mouseY / 10) - camera.position.y) * .05;
		
		let thisParticles = scene.getObjectByName('particles');
		thisParticles.rotation.y += 0.0010;
	  	thisParticles.rotation.y += (- (mouseY / 10) - camera.position.y) * .0010;
	  	
	  	for (let i = 0; i < scene.children.length; i++ ) {
	  		let thisLines = scene.children[i];
			
			if ( thisLines instanceof THREE.Line ) {
				thisLines.rotation.y += 0.0010;
				thisLines.rotation.y += (- (mouseY / 10) - camera.position.y) * .0010;
				if (i < 5) {
					thisLines.scale.x = thisLines.scale.y = thisLines.scale.z = 0.25 * (i / 5 + 1) * (1 + 0.5 * Math.sin( 7 * time));
				}
			}
		}

		camera.lookAt(new THREE.Vector3(0, 0, 0));
		renderer.render( scene, camera );
	};

	const _onWindowResize = () => {
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	};
	
	const _onDocumentMouseMove = (event) => {
		mouseX = event.clientX - windowHalfX;
		mouseY = event.clientY - windowHalfY;
	};

	const _onDocumentTouchStart = (event) => {
		if (event.touches.length > 1) {
			event.preventDefault();
			mouseX = event.touches[0].pageX - windowHalfX;
			mouseY = event.touches[0].pageY - windowHalfY;
		}
	};

	const _onDocumentTouchMove = (event) => {
		if ( event.touches.length == 1 ) {
			event.preventDefault();
			mouseX = event.touches[0].pageX - windowHalfX;
			mouseY = event.touches[0].pageY - windowHalfY;
		}
	};

	const init = (container) => {
		
		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(75, winWidth / winHeight, 1, 1000);
		camera.position.z = (!isMobile()) ? 100 : 125;

		renderer = new THREE.WebGLRenderer({ alpha: true });
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize(winWidth, winHeight);
		renderer.setClearColor(0x222222, 1);
		container.appendChild(renderer.domElement);

		_texture.needsUpdate = true;


		//particles
		const particlesGeometry = new THREE.SphereGeometry(40, 100, 100);

		particlesGeometry.vertices.forEach(function(vertex) {
	    	vertex.x += Math.random() * 2 - 1;
	    	vertex.y += Math.random() * 2 - 1;
	    	vertex.z += Math.random() * 2 - 1;
	    });
	    
	    const particles = new THREE.Points(particlesGeometry, _particlesMaterial);
	  	particles.name = 'particles';
	  	scene.add(particles);

	  	//lines
		for (let i = 0; i < 300; i++) {
			let linesGeometry = new THREE.Geometry();

			let vertex = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
			vertex.normalize();
			vertex.multiplyScalar(40);
			linesGeometry.vertices.push( vertex );

			let vertex2 = vertex.clone();
			vertex2.multiplyScalar(Math.random() * 0.3 + 1);
			linesGeometry.vertices.push(vertex2);

			let lines = new THREE.Line(linesGeometry, _linesMaterial);
			lines.name = 'lines';
			lines.rotation.y = Math.random() * Math.PI;
			lines.updateMatrix();
			scene.add(lines);
		};

		const animate = () => {
			requestAnimationFrame(animate);
			_render();
			
			/**
			 * TODO: fix issue on orientation device
			 */
			AddEvent(window, 'resize', _onWindowResize);
			AddEvent(document, 'mousemove', _onDocumentMouseMove);
			AddEvent(document, 'touchstart', _onDocumentTouchStart);
			AddEvent(document, 'touchmove', _onDocumentTouchMove);
		};


		Detector.webgl ? animate() : console.log('webgl not supported');
	};


	return {
		init: init
	}

})(window, document);

export default Sphere;