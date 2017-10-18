requirejs(['domReady!', 'es6'],
	function (doc, es6) {
	
	/**
	 * On Load
	 */
	function onLoad() {
		if (!es6.supported()) {
			document.getElementById('nosupport').className = '';
			return;
		}

		requirejs(['mandelbrot'], function (mandelbrot) {
			mandelbrot.start();
		});
	}
	
	onLoad();
});