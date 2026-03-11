import { test } from 'node:test';
import assert from 'node:assert/strict';
import MandelbrotBitmap from './mandelbrot-bitmap.js';

// Stub browser globals not available in Node
globalThis.cancelAnimationFrame = () => {};
globalThis.requestAnimationFrame = () => {};

// Minimal canvas stub — no DOM needed
function makeCanvas(w = 100, h = 100) {
	return {
		width: w,
		height: h,
		getContext: () => ({ fillStyle: '', fillRect: () => {} }),
	};
}

// Create a bitmap and call render() to set up coordinate space
function makeBitmap(x1 = -2, y1 = 1.5, x2 = 1, y2 = -1.5, w = 100, h = 100) {
	const mb = new MandelbrotBitmap(makeCanvas(w, h), w, h);
	mb.render(x1, y1, x2, y2);
	return mb;
}

test('escapeToColor: -1 maps to black (inside set)', () => {
	const mb = new MandelbrotBitmap(makeCanvas(), 100, 100);
	assert.equal(mb.escapeToColor(-1), 'black');
});

test('escapeToColor: escape 0 produces a valid hex color', () => {
	const mb = new MandelbrotBitmap(makeCanvas(), 100, 100);
	const color = mb.escapeToColor(0);
	assert.match(color, /^#[0-9a-f]{6}$/);
});

test('escapeToColor: result is always a 7-char hex string for non-negative values', () => {
	const mb = new MandelbrotBitmap(makeCanvas(), 100, 100);
	for (const v of [0, 1, 10, 50, 100, 255]) {
		const c = mb.escapeToColor(v);
		assert.match(c, /^#[0-9a-f]{6}$/, `escapeToColor(${v}) = ${c}`);
	}
});

test('bitmapToComplexReal: left edge maps to x1', () => {
	const mb = makeBitmap(-2, 1.5, 1, -1.5);
	assert.equal(mb.bitmapToComplexReal(0), -2);
});

test('bitmapToComplexReal: right edge maps to x2', () => {
	const mb = makeBitmap(-2, 1.5, 1, -1.5, 100, 100);
	assert.equal(mb.bitmapToComplexReal(100), 1);
});

test('bitmapToComplexImaginary: top edge maps to y1', () => {
	const mb = makeBitmap(-2, 1.5, 1, -1.5);
	assert.equal(mb.bitmapToComplexImaginary(0), 1.5);
});

test('bitmapToComplexImaginary: bottom edge maps to y2', () => {
	const mb = makeBitmap(-2, 1.5, 1, -1.5, 100, 100);
	assert.equal(mb.bitmapToComplexImaginary(100), -1.5);
});

test('mandelEscape: (-0.5, 0) is inside the set', () => {
	// The point c = -0.5 + 0i is well inside the Mandelbrot set
	const mb = makeBitmap(-1, 1, 0, -1, 100, 100);
	// Map the center pixel to (-0.5, 0)
	const result = mb.mandelEscape(50, 50);
	assert.equal(result, -1);
});

test('mandelEscape: (2, 2) escapes immediately', () => {
	// c = 2 + 2i is outside; |z|^2 exceeds 4 on first iteration
	const mb = makeBitmap(0, 4, 4, 0, 100, 100);
	// Map to (2, 2) in complex space
	const result = mb.mandelEscape(50, 50);
	assert(result >= 0, 'expected escape, got -1');
	assert(result < 10, 'expected quick escape');
});

test('maxIterations increases as zoom increases (smaller cwidth)', () => {
	const mb = new MandelbrotBitmap(makeCanvas(), 100, 100);

	mb.render(-2, 1.5, 2, -1.5);        // cwidth = 4, low zoom
	const lowZoomIter = mb.maxIterations;

	mb.render(-0.001, 0.001, 0.001, -0.001); // cwidth = 0.002, high zoom
	const highZoomIter = mb.maxIterations;

	assert(highZoomIter > lowZoomIter,
		`expected more iterations at high zoom (${highZoomIter}) than low zoom (${lowZoomIter})`);
});
