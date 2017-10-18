/**
 * Detect features we need
 */
define(function() {
	return {
		supported: function () {
			var featuresOK = true;

			try {
				// class
				eval('"use strict"; class Foo { }');

				// let
				eval('"use strict"; let x = 2');

				// Canvas
				var elem = document.createElement('canvas');
				var ok = !!(elem.getContext && elem.getContext('2d'));
				if (!ok) { featuresOK = false; }
			} catch(e) {
				featuresOK = false;
			}

			return featuresOK;
		}
	};
});
