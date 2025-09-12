import assert from 'node:assert/strict';
import { isPublicRoute } from './public-routes';

// Basic unit tests for public route helper.

// Routes that should be public
assert.equal(isPublicRoute('/'), true);
assert.equal(isPublicRoute('/login'), true);
assert.equal(isPublicRoute('/auth/reset'), true);
assert.equal(isPublicRoute('/events'), true);
assert.equal(isPublicRoute('/events/123'), true);

// A protected route
assert.equal(isPublicRoute('/dashboard'), false);

console.log('public route tests passed');
