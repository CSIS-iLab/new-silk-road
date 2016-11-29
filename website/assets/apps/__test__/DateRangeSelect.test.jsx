/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import DateRangeSelect from '../megamap/components/DateRangeSelect';

describe('DateRangeSelect', () => {
  it('to set input placeholders by label props', () => {
    const select = shallow(
      <DateRangeSelect
        value={{ dateLookupType: 'foo' }}
        upperBoundLabel="This is upper"
        lowerBoundLabel="This is lower"
      />,
    );

    expect(select.find('input[name="lowerValue"]').prop('placeholder')).toEqual('This is lower');
    expect(select.find('input[name="upperValue"]').prop('placeholder')).toEqual('This is upper');
  });

  it('values get passed to child components', () => {
    const select = shallow(
      <DateRangeSelect
        value={{ dateLookupType: 'foo', lowerValue: '2010', upperValue: '2012' }}
        upperBoundLabel="upper"
        lowerBoundLabel="lower"
      />,
    );

    expect(select.find('Select').prop('value')).toEqual('foo');
    expect(select.find('input[name="lowerValue"]').prop('value')).toEqual('2010');
    expect(select.find('input[name="upperValue"]').prop('value')).toEqual('2012');
  });
});
