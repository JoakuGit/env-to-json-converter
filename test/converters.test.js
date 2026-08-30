import test from 'node:test';
import assert from 'node:assert/strict';
import { jsonToEnv, parseEnv } from '../src/converters.js';

test('converts a JSON object to ENV', () => {
  const { output, error } = jsonToEnv('{"NAME":"My App","PORT":3000,"DEBUG":true,"EMPTY":null}');

  assert.equal(error, '');
  assert.equal(output, 'NAME="My App"\nPORT=3000\nDEBUG=true\nEMPTY=');
});

test('preserves JSON strings that look like primitive values', () => {
  const converted = jsonToEnv('{"BOOLEAN":"true","NUMBER":"123","MULTILINE":"a\\nb"}');
  const { result } = parseEnv(converted.output);

  assert.deepEqual(result, { BOOLEAN: 'true', NUMBER: '123', MULTILINE: 'a\nb' });
});

test('serializes nested JSON values as JSON strings', () => {
  const converted = jsonToEnv('{"OPTIONS":{"enabled":true},"LIST":[1,2]}');
  const { result } = parseEnv(converted.output);

  assert.deepEqual(result, { OPTIONS: '{"enabled":true}', LIST: '[1,2]' });
});

test('reports invalid or non-object JSON', () => {
  assert.match(jsonToEnv('{oops').error, /^Invalid JSON:/);
  assert.equal(jsonToEnv('[]').error, 'JSON input must be an object.');
});
