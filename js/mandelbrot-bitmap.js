define(['eventer', 'adam7', 'rect'], function (Eventer, Adam7, Rect) {

	class MandelbrotBitmap extends Eventer {
		/**
		 * Constructor
		 */
		constructor(canvas, bitmapWidth, bitmapHeight) {
			super();

			canvas.width = bitmapWidth;
			canvas.height = bitmapHeight;

			this.canvas = canvas;

			this.context = canvas.getContext('2d');

			this.bitmapWidth = bitmapWidth;
			this.bitmapHeight = bitmapHeight;

			this.pixelsTotal = bitmapWidth * bitmapHeight;

			this.tRect = new Rect();

			this.adam7 = new Adam7(bitmapWidth, bitmapHeight);

			this.maxIterations = 1000;
		}

		/**
		 * Starts a render.  Can be called in the middle of a previous
		 * render.
		 *
		 * @param x1 negativeist coordinate of real axis (left)
		 * @param y1 positiveist coordinate of imaginary axis (top)
		 * @param x2 positiveist coordinate of real axis (right)
		 * @param y2 negativeist coordinate of imaginary axis (bottom)
		 */
		render(x1, y1, x2, y2) {
			this.x1 = x1;
			this.y1 = y1;
			this.x2 = x2;
			this.y2 = y2;
			this.cwidth = x2 - x1;
			this.cheight = y1 - y2;

			//console.log("START RENDER");
			this.renderStartTime = Date.now();

			this.adam7.reset();
			this.pixelsRendered = 0;

			// How long we can compute until returning control to system
			this.computeTimeMS = 30; // ms

			this.cancelAnim();

			this.animFrameReq = requestAnimationFrame(this.enterFrame.bind(this));
		}

		/**
		 * Cancel the current animation request
		 */
		cancelAnim() {
			cancelAnimationFrame(this.animFrameReq);
		}

		/**
		 * Called every frame, and computes until the current time
		 * exceeds this.computeEndTime, or until the image is completely
		 * rendered.
		 */
		enterFrame(timestamp) {
			let count = 0;
			let escapeValue;
			let colorValue;
			let startTime = Date.now();
			let rect = this.tRect;

			while (this.adam7.getNext(rect)) {
				this.pixelsRendered++;

				// compute the escape value
				escapeValue = this.mandelEscape(rect.x, rect.y);

				// remap escape value to color
				colorValue = this.escapeToColor(escapeValue);

				// draw the result
				this.context.fillStyle = colorValue;
				this.context.fillRect(rect.x, rect.y, rect.width, rect.height);

				// check to see if we've timed-out every row
				if (++count > this.bitmapWidth) {
					if (Date.now() - startTime > this.computeTimeMS) {
						this.dispatchEvent(Eventer.createEvent("progress", {
							percent: 100 * this.pixelsRendered / this.pixelsTotal
						}));
						this.animFrameReq = requestAnimationFrame(this.enterFrame.bind(this));
						return; // yield control back to do other stuff
					}
					count = 0;
				}
			}

			//console.log("END RENDER: " + this.pixelsRendered + " pixels in " + ((Date.now() - this.renderStartTime)/1000.0) + " seconds");
			this.dispatchEvent(Eventer.createEvent("progress", {
				percent: 100
			}));
			this.dispatchEvent(Eventer.createEvent("complete"));
		}

		/**
		 * Takes screen coordinates, and computes the escape value for that
		 * pixel, given the current view set by a call to this.render().
		 *
		 * @param x x position in screen space
		 * @param y y position in screen space
		 *
		 * @return the escape iteration number, or -1 for never
		 */
		mandelEscape(x, y) {
			let cr = this.bitmapToComplexReal(x);
			let ci = this.bitmapToComplexImaginary(y);

			let iteration = 0;
			let zr = 0;
			let zi = 0;

			let zr2;
			let zi2;

			while (zr*zr + zi*zi <= (2*2) && iteration < this.maxIterations) {
				zr2 = zr*zr - zi*zi;
				zi2 = 2 * zr * zi;

				zr = zr2 + cr;
				zi = zi2 + ci;

				iteration++;
			}

			if (iteration == this.maxIterations) {
				return -1;
			}

			return iteration;
		}

		/**
		 * Takes an escape number and maps it to a color. This sets the
		 * "palette" for the result.
		 *
		 * @return a packed RGB color in web format
		 */
		escapeToColor(escapeValue) {
			let r, g, b;

			if (escapeValue < 0) {
				return "black"; // no escape
			}
			
			r = escapeValue * 8;
			g = escapeValue * 9;
			b = 0xff - escapeValue * 4;
			
			r = (r&0xff).toString(16);
			g = (g&0xff).toString(16);
			b = (b&0xff).toString(16);

			if (r.length == 1) { r = "0" + r; }
			if (g.length == 1) { g = "0" + g; }
			if (b.length == 1) { b = "0" + b; }

			return '#' + r + g + b;
		}

		/**
		 * Convert a bitmap-space X coordinate to the real potion of the
		 * complex plane.
		 */
		bitmapToComplexReal(x) {
			return this.cwidth * x / this.bitmapWidth + this.x1;
		}

		/**
		 * Convert a bitmap-space Y coordinate to the imaginary potion of the
		 * complex plane.
		 */
		bitmapToComplexImaginary(y) {
			return this.y1 - this.cheight * y / this.bitmapHeight;
		}
	}

	return MandelbrotBitmap;
});

