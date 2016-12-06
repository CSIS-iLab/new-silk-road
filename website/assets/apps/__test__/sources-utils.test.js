/* eslint-env jest */

import parameterizeQuery from '../megamap/sources/utils';


describe('parameterizeQuery', () => {
  it('returns a querystring when given numbers', () => {
    const q = {
      foo: 5,
    };
    const qs = parameterizeQuery(q);
    expect(qs).toEqual('foo=5');
  });
  it('returns a querystring when given strings', () => {
    const q = {
      foo: 'bar',
      baz: 'bat',
    };
    const qs = parameterizeQuery(q);
    expect(qs).toContain('foo=bar');
    expect(qs).toContain('baz=bat');
  });

  it('returns does not handle nested objects', () => {
    const q = {
      foo: 5,
      bar: {
        baz: 'bong',
        bat: 'pew',
      },
    };
    const qs = parameterizeQuery(q);
    expect(qs).toContain('foo=5');
    expect(qs).not.toContain('bar__baz=bong');
    expect(qs).not.toContain('bar__bat=pew');
    expect(qs).toContain('[object Object]');
  });
});
