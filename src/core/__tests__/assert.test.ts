import { assert } from '../assert'

it('throws when it evaluates to false', () => {
  expect(() => assert(false, 'is false')).toThrowError('is false')
  expect(() => assert(null, 'is null')).toThrowError('is null')
  expect(() => assert(0, 'is zero')).toThrowError('is zero')
  expect(() => assert('', 'is empty')).toThrowError('is empty')
})

it('does not throw when it evaluates to true', () => {
  expect(() => assert(true, 'is true')).not.toThrowError('is true')
  expect(() => assert({}, 'is object')).not.toThrowError('is object')
  expect(() => assert('string', 'is string')).not.toThrowError('is string')
  expect(() => assert(1, 'is 1')).not.toThrowError('is 1')
  expect(() => assert([], 'is array')).not.toThrowError('is array')
})
