import Sphere from './core/Sphere'

// TODO: Promise polyfill
const fadeInScene = () => {
  let animWrapper = document.getElementById('js-anim')

  let initScene = new Promise((resolve, reject) => {
    resolve(setTimeout(() => {
      Sphere.init(animWrapper)
    }))
  })

  initScene.then(setTimeout(() => {
    	if (animWrapper.classList.contains('is--hidden')) {
    		animWrapper.classList.remove('is--hidden')
       	 	animWrapper.classList.add('is--visible')
    	}
  }, 1000))
}

fadeInScene()