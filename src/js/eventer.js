/**
 * Event methods for arbitrary objects
 * 
 * Usage:
 * 
 * // Direct subclassing:
 * 
 * class Foo extends Eventer {
 *     constructor() { super(); ... }
 * }
 * 
 * let f = new Foo();
 * f.addEventListener('goats', goatsDetected);
 * f.dispatchEvent(Eventer.createEvent('goats'));
 * 
 * // Mixin: (also adds _eventer_listeners property to f)
 * 
 * class Foo { }
 * 
 * let f = new Foo();
 * Eventer.mixin(f);
 * f.addEventListener('goats', goatsDetected);
 * f.dispatchEvent(Eventer.createEvent('goats', {count:12}));
 */
module.exports = class Eventer {
	constructor() {
		this._eventer_listeners = {};
	}

	/**
	 * Add an event listener
	 * 
	 * @param {String} type 
	 * @param {Function} callback 
	 */
	addEventListener(type, callback) {
		// Create the listener array, if non-existent
		if (!(type in this._eventer_listeners)) {
			this._eventer_listeners[type] = [];
		}

		// Don't add duplicate callbacks
		if (this._eventer_listeners[type].indexOf(callback) != -1) {
			return;
		}

		// Add the callback to the array
		this._eventer_listeners[type].push(callback);
	}

	/**
	 * Remove an event listener
	 * 
	 * @param {String} type 
	 * @param {Function} callback 
	 */
	removeEventListener(type, callback) {
		// Make sure we have this type in our listeners
		if (!(type in this._eventer_listeners)) {
			return;
		}

		// Find callback
		let i = this._eventer_listeners[type].indexOf(callback);
		
		// If found, remove callback. There should only be one as
		// duplicates are filtered out in addEventListener().
		if (i != -1) {
			this._eventer_listeners[type].splice(i, 1);
		}
	}

	/**
	 * Dispatch an event
	 * 
	 * Fills in the target, currentTarget, originalTarget, and timeStamp
	 * properties on the event object.
	 * 
	 * @param {Object} event event created with createEvent()
	 */
	dispatchEvent(event) {
		// Make sure we have this type in our listeners
		if (!(event.type in this._eventer_listeners)) {
			return;
		}

		// Fill out event fields
		event.target = this;
		event.currentTarget = this;
		event.originalTarget = this;
		event.timeStamp = Date.now();

		// Call all callbacks
		for (let f of this._eventer_listeners[event.type]) {
			// In the callback, 'this' should be set to the event
			// dispatcher
			f.call(this, event);
		}
	}

	/**
	 * Create a new event
	 * 
	 * @param {String} type event type
	 * @param {Object} [payload=undefined] additional payload to mix in to the event
	 */
	static createEvent(type, payload=undefined) {
		let ev = {
			type: type
		};

		if (payload) {
			Object.assign(ev, payload);
		}

		return ev;
	}

	/**
	 * Mix Eventer into another object
	 *  
	 * @param {Object} obj 
	 */
	static mixin(obj) {
		let n = new Eventer();

		let props = [
			'_eventer_listeners',
			'addEventListener',
			'removeEventListener',
			'dispatchEvent'
		];

		for (let p of props) {
			obj[p] = n[p];
		}

		return obj;
	}
}