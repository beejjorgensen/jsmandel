module.exports = class Adam7 {
	/**
	 * Constructor
	 */
	constructor(width, height) {
		this.xoffset = [0,4,0,2,0,1,0];
		this.yoffset = [0,0,4,0,2,0,1];
		this.xstep   = [8,8,4,4,2,2,1];
		this.ystep   = [8,8,8,4,4,2,2];
		this.xsize   = [8,4,4,2,2,1,1];
		this.ysize   = [8,8,4,4,2,2,1];

		this.width = width;
		this.height = height;

		this.reset();
	}

	/**
	 * Reset the iterator
	 */
	reset() {
		this.pass = 0;
		this.x = this.xoffset[this.pass];
		this.y = this.yoffset[this.pass];
		this.moreElements = true;
	}

	/**
	 * True if there are more pixels remaining
	 */
	hasNext() {
		return this.moreElements;
	}

	/**
	 * Get the next Adam7 rectangle to draw
	 */
	getNext(rect) {
		if (!this.moreElements) { return false; }

		rect.x = this.x;
		rect.y = this.y;
		rect.width = this.xsize[this.pass];
		rect.height = this.ysize[this.pass];

		this.x += this.xstep[this.pass];

		if (this.x >= this.width) {
			this.y += this.ystep[this.pass];

			if (this.y >= this.height) {
				this.pass++;

				if (this.pass > 6) {
					this.moreElements = false;
				}

				this.y = this.yoffset[this.pass];
			}

			this.x = this.xoffset[this.pass];
		}

		return true;
	}
};
