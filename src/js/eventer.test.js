import { test } from 'node:test';
import assert from 'node:assert/strict';
import Eventer from './eventer.js';

test('dispatched event calls the listener', () => {
	const e = new Eventer();
	let called = false;
	e.addEventListener('foo', () => { called = true; });
	e.dispatchEvent(Eventer.createEvent('foo'));
	assert(called);
});

test('duplicate listeners are not added', () => {
	const e = new Eventer();
	let count = 0;
	const cb = () => count++;
	e.addEventListener('foo', cb);
	e.addEventListener('foo', cb);
	e.dispatchEvent(Eventer.createEvent('foo'));
	assert.equal(count, 1);
});

test('removeEventListener stops future calls', () => {
	const e = new Eventer();
	let count = 0;
	const cb = () => count++;
	e.addEventListener('foo', cb);
	e.dispatchEvent(Eventer.createEvent('foo'));
	e.removeEventListener('foo', cb);
	e.dispatchEvent(Eventer.createEvent('foo'));
	assert.equal(count, 1);
});

test('event payload is mixed into the event object', () => {
	const e = new Eventer();
	let received;
	e.addEventListener('foo', ev => { received = ev; });
	e.dispatchEvent(Eventer.createEvent('foo', { percent: 42 }));
	assert.equal(received.type, 'foo');
	assert.equal(received.percent, 42);
});

test('dispatching unknown event type does not throw', () => {
	const e = new Eventer();
	assert.doesNotThrow(() => e.dispatchEvent(Eventer.createEvent('noevent')));
});

test('mixin attaches eventer methods to a plain object', () => {
	const obj = {};
	Eventer.mixin(obj);
	let called = false;
	obj.addEventListener('x', () => { called = true; });
	obj.dispatchEvent(Eventer.createEvent('x'));
	assert(called);
});
