'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { validate } = require('../tools/validate-static-site');

test('published romantic experience has all required valid assets', () => {
  const result = validate();
  assert.equal(result.requiredFiles, 8);
});
