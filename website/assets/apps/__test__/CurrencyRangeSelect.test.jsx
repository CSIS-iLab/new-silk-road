/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import CurrencyRangeSelect from '../megamap/components/CurrencyRangeSelect';

describe('CurrencyRangeSelect', () => {
  it('sets placeholder by input prop', () => {
    const select = shallow(
      <CurrencyRangeSelect
        name="foo"
        placeholder="Foo"
      />,
    );
    expect(select.prop('placeholder')).toEqual('Foo');
  });
  // NOTE: Can't test change events since those are handled internally by react-select
});
