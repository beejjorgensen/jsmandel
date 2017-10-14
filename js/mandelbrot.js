requirejs(['domReady!', 'es6', 'mandelbrot-bitmap', 'progressbar'],
	function (doc, es6, MandelbrotBitmap, ProgressBar) {

	let mandelBitmap;

	let viewWidth;

	let percentBar;

	const heightToWidthRatio = 2.0/3.0;
	const zoomFactor = 2.0;

	let curZoom;
	let curCR;
	let curCI;

	let zoomStack;
	
	let zoomText;

	let started;

	let canvas;

	/**
	 * On Load
	 */
	function onLoad() {
		if (!es6.supported()) {
			document.getElementById('nosupport').className = '';
			return;
		}

		document.querySelector('#app').classList.remove('nodisp');

		started = false; // set to true when user begins work

		canvas = document.querySelector('#mandelbrot');

		setCanvas();

		canvas.addEventListener('click', mouseClick);

		// Buttons
		document.querySelector('#restart').addEventListener('click', restartClicked);
		document.querySelector('#undo').addEventListener('click',undoZoomClicked);

		zoomText = document.querySelector('#zoomlevel > span');

		zoomStack = [];

		restartClicked();
	}

	/**
	 * Set the canvas size
	 */
	function setCanvas() {
		let app = document.querySelector('#app');
		let sw = app.clientWidth;
		let sh = app.clientHeight;
		let mbmwidth;
		let mbmheight;
		
		mbmwidth = sw * 1.0;
		mbmheight = mbmwidth * heightToWidthRatio;
		if (mandelBitmap) {
			mandelBitmap.cancelAnim();
		}

		mandelBitmap = new MandelbrotBitmap(canvas, mbmwidth, mbmheight);

		// Percent bar
		percentBar = new ProgressBar(document.querySelector("#progress-bar"));
		mandelBitmap.addEventListener("progress", bitmapProgress);
	}

	/**
	 * Handle the restart command
	 */
	function restartClicked(event) {
		started = true;

		curCR = -0.5;
		curCI = 0;
		viewWidth = 3.6;
		zoomStack.length = 0;
		
		curZoom = 0;

		startRender();
	}

	/**
	 * Handle resize
	 */
	function onResize() {
		setCanvas();
		startRender();
	}

	/**
	 * Handle the undo zoom
	 */
	function undoZoomClicked(event) {
		if (!started) {
			restartClicked(event);
			return;
		}

		if (zoomStack.length == 0) { return; }

		let a = zoomStack.pop();
		curCR = a[0];
		curCI = a[1];
		viewWidth = a[2];

		curZoom--;

		startRender();
	}

	/**
	 * Handle clicks on the bitmap
	 */
	function mouseClick(event) {
		if (!started) {
			restartClicked(event);
			return;
		}

		zoomStack.push([curCR, curCI, viewWidth]);

		curCR = mandelBitmap.bitmapToComplexReal(event.clientX);
		curCI = mandelBitmap.bitmapToComplexImaginary(event.clientY);

		viewWidth /= zoomFactor;
		curZoom++;

		startRender();

		event.preventDefault();
	}

	/**
	 * Helper function to pass all proper params to mandelBitmap, and
	 * set the zoom text
	 */
	function startRender() {
		let v4 = viewWidth / 2;
		let h4 = v4 * heightToWidthRatio;
		mandelBitmap.render(curCR - v4, curCI + h4,
			curCR + v4, curCI - h4);

		let zoomLevel = Math.pow(zoomFactor, curZoom);
		zoomText.innerHTML = zoomLevel;
	}

	/**
	 * Handle progress events from the bitmap
	 */
	function bitmapProgress(event) {
		percentBar.setPercent(event.percent);
	}

	onLoad();
	window.addEventListener('resize', onResize);

});

