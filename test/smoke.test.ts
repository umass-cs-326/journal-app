import { Err, Ok } from '../src/lib/result.js'

describe('result helpers', () => {
  it('creates Ok results', () => {
    const result = Ok('value')
    expect(result).toEqual({ ok: true, value: 'value' })
  })

  it('creates Err results', () => {
    const result = Err('error')
    expect(result).toEqual({ ok: false, value: 'error' })
  })
})
