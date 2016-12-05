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

  it('onChange handler gets object with blank "dateLookupType", "lowerValue", and "upperValue" props when "dateLookupType" is not set', () => {
    const mockonChange = jest.fn();
    const select = shallow(
      <DateRangeSelect
        upperBoundLabel="upper"
        lowerBoundLabel="lower"
        onChange={mockonChange}
      />,
    );
    const input = select.find('input[name="lowerValue"]');
    input.simulate('change', { target: { name: 'lowerValue', value: '2000' } });
    expect(mockonChange).toBeCalledWith({ dateLookupType: '', lowerValue: '', upperValue: '' });
  });


  it('onChange handler gets object with values for "dateLookupType", "lowerValue", and "upperValue" props when "dateLookupType" *is* set', () => {
    const mockonChange = jest.fn();
    const select = shallow(
      <DateRangeSelect
        value={({ dateLookupType: 'foo', lowerValue: '', upperValue: '' })}
        upperBoundLabel="upper"
        lowerBoundLabel="lower"
        onChange={mockonChange}
      />,
    );
    const input = select.find('input[name="lowerValue"]');
    input.simulate('change', { target: { name: 'lowerValue', value: '2000' } });
    expect(mockonChange).toBeCalledWith({ dateLookupType: 'foo', lowerValue: '2000', upperValue: '' });
  });
});
