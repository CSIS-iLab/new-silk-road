/* eslint-env jest */

import {
  nameIdMapper,
  nameSlugMapper,
  generateRangeQuery,
  hasSearchableValue,
} from '../megamap/functions';

describe('optionMapper functions', () => {
  it('nameIdMapper should create Option objects only from objects that have name and id properties', () => {
    const input = [
      { name: 'Option 1', id: '1' },
      { name: 'Option 2', id: '2' },
      { name: 'Not an option' },
    ];
    const options = nameIdMapper(input);
    expect(options).toBeInstanceOf(Array);
    expect(options).toHaveLength(2);
  });

  it('nameSlugMapper should create Option objects only from objects that have name and slug properties', () => {
    const input = [
      { name: 'Option 1', slug: 'option-1' },
      { name: 'Option 2', slug: 'option-2' },
      { name: 'Not an option' },
    ];
    const options = nameSlugMapper(input);
    expect(options).toBeInstanceOf(Array);
    expect(options).toHaveLength(2);
  });
});

describe('generateRangeQuery', () => {
  it('returns an empty object when lookupName is null', () => {
    const result = generateRangeQuery();
    expect(result).toEqual({});
  });

  it('returns an empty object when lookupName is en empty string', () => {
    const result = generateRangeQuery('');
    expect(result).toEqual({});
  });

  it('returns an object with 2 lookup props with string values', () => {
    const result = generateRangeQuery('foo', 2000, 2010);
    expect(result).toEqual({
      foo__gte: '2000',
      foo__lte: '2010',
    });
  });
});

describe('hasSearchableValue', () => {
  it('returns true when passed an object with a non-empty string value', () => {
    const testObj = {
      foo: 'bar',
    };
    const isSearchable = hasSearchableValue(testObj);
    expect(isSearchable).toEqual(true);
  });
  it('returns false when passed an object with an string value consisting only of spaces', () => {
    const testObj = {
      foo: '  ',
    };
    const isSearchable = hasSearchableValue(testObj);
    expect(isSearchable).toEqual(false);
  });
  it('returns true when passed an object with a number', () => {
    const testObj = {
      foo: 1,
    };
    const isSearchable = hasSearchableValue(testObj);
    expect(isSearchable).toEqual(true);
  });
  it('returns true when passed an object with nested object with a non-empty string value', () => {
    const testObj = {
      foo: {
        bar: 'baz',
      },
    };
    const isSearchable = hasSearchableValue(testObj);
    expect(isSearchable).toEqual(true);
  });
});
