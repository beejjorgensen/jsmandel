module.exports = function () {
	return {
		supported: function () {
			var featuresOK = true;

			try {
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
};
