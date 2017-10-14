/**
 * Hackishly test for general ES6 support
 * 
 * https://gist.github.com/bendc/d7f3dbc83d0f65ca0433caf90378cd95
 */
function supportsES6() {
	try {
		new Function("(a = 0) => a");
		return true;
	} catch (err) {
		return false;
	}
}