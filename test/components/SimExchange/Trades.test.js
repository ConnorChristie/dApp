import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Trades from '../../../src/components/SimExchange/Trades';
import TradeContainer from '../../../src/components/SimExchange/TradeContainer';

describe('Trades', () => {
  it('renders bids and asks', () => {
    const props = {
      asks: [],
      bids: [],
      tradeOrder: {}
    };

    const component = shallow(<Trades {...props} />);

    const containsBids = component.containsMatchingElement(<TradeContainer
        title="bid"
        market="ETX"
        tradeOrder={props.tradeOrder}
        data={props.bids}
    />);

    const containsAsks = component.containsMatchingElement(<TradeContainer
        title="ask"
        market="ETX"
        tradeOrder={props.tradeOrder}
        data={props.asks}
    />);

    expect(containsBids, 'Should render bids').to.be.true;
    expect(containsAsks, 'Should render asks').to.be.true;
  });
});
