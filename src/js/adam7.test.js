import { test } from 'node:test';
import assert from 'node:assert/strict';
import Adam7 from './adam7.js';

// Each getNext() call represents one unique source pixel at (rect.x, rect.y).
// The rect width/height is for display (blocks overlap); source pixels don't.

test('source pixels cover an 8x8 grid exactly once', () => {
	const w = 8, h = 8;
	const adam7 = new Adam7(w, h);
	const rect = { x: 0, y: 0, width: 0, height: 0 };
	const visited = new Set();

	while (adam7.getNext(rect)) {
		const key = `${rect.x},${rect.y}`;
		assert(!visited.has(key), `source pixel ${key} visited twice`);
		visited.add(key);
	}

	assert.equal(visited.size, w * h);
});

test('source pixels cover a non-square grid exactly once', () => {
	const w = 16, h = 8;
	const adam7 = new Adam7(w, h);
	const rect = { x: 0, y: 0, width: 0, height: 0 };
	const visited = new Set();

	while (adam7.getNext(rect)) {
		visited.add(`${rect.x},${rect.y}`);
	}

	assert.equal(visited.size, w * h);
});

test('all rects are within bounds', () => {
	const w = 8, h = 8;
	const adam7 = new Adam7(w, h);
	const rect = { x: 0, y: 0, width: 0, height: 0 };

	while (adam7.getNext(rect)) {
		assert(rect.x >= 0, 'x < 0');
		assert(rect.y >= 0, 'y < 0');
		assert(rect.x + rect.width <= w, 'rect extends past right edge');
		assert(rect.y + rect.height <= h, 'rect extends past bottom edge');
	}
});

test('hasNext() returns false after exhaustion', () => {
	const adam7 = new Adam7(8, 8);
	const rect = { x: 0, y: 0, width: 0, height: 0 };
	while (adam7.getNext(rect)) {}
	assert(!adam7.hasNext());
	assert(!adam7.getNext(rect));
});

test('reset() restarts the sequence', () => {
	const adam7 = new Adam7(8, 8);
	const rect = { x: 0, y: 0, width: 0, height: 0 };

	// Exhaust it
	while (adam7.getNext(rect)) {}
	assert(!adam7.hasNext());

	// Reset and count again
	adam7.reset();
	assert(adam7.hasNext());

	const visited = new Set();
	while (adam7.getNext(rect)) {
		for (let py = rect.y; py < rect.y + rect.height; py++) {
			for (let px = rect.x; px < rect.x + rect.width; px++) {
				visited.add(`${px},${py}`);
			}
		}
	}
	assert.equal(visited.size, 64);
});
