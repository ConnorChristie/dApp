import React from 'react';
import { MemoryRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { mount } from 'enzyme';
import { Menu } from 'antd';
import { expect } from 'chai';

import SimExchange from '../../../src/components/SimExchange/SimExchange';
import Trades from '../../../src/components/SimExchange/Trades';
import Wallet from '../../../src/components/SimExchange/Wallet';

describe('SimExchange', () => {
  it('contains menu items', () => {
    const pathname = '/exchange/trades/';
    const component = mount(<MemoryRouter initialEntries={[ { pathname, key: 'start' } ]}>
      <SimExchange shouldRender={true} />
    </MemoryRouter>).find(SimExchange);

    const menu = component.find(Menu);

    const hasTradesItem = menu.containsMatchingElement(
      <Menu.Item key="/exchange/trades/">
        <Link to="/exchange/trades/">Trades</Link>
      </Menu.Item>
    );

    const hasWalletItem = menu.containsMatchingElement(
      <Menu.Item key="/exchange/wallet/">
        <Link to="/exchange/wallet/">Wallet</Link>
      </Menu.Item>
    );

    expect(hasTradesItem, 'Should have trades menu item').to.be.true;
    expect(hasWalletItem, 'Should have wallet menu item').to.be.true;
  });

  it('renders trades', () => {
    const props = {
      asks: [],
      bids: [],
      tradeOrder: {}
    };

    const pathname = '/exchange/trades/';
    const loader = mount(<MemoryRouter initialEntries={[ { pathname, key: 'start' } ]}>
      <SimExchange {...props} shouldRender={true} />
    </MemoryRouter>);

    const component = loader.find(SimExchange);
    const showsTrades = component.containsMatchingElement(<Trades
      asks={props.asks}
      bids={props.bids}
      tradeOrder={props.tradeOrder}
    />);

    expect(showsTrades, 'Should render trades').to.be.true;
  });

  it('renders wallet', () => {
    const pathname = '/exchange/wallet/';
    const loader = mount(<MemoryRouter initialEntries={[ { pathname, key: 'start' } ]}>
      <SimExchange shouldRender={true} />
    </MemoryRouter>);

    const component = loader.find(SimExchange);
    const showsWallet = component.containsMatchingElement(<Wallet />);

    expect(showsWallet, 'Should render wallet').to.be.true;
  });

  it('renders dummy text when disabled', () => {
    const pathname = '/exchange/trades/';
    const loader = mount(<MemoryRouter initialEntries={[ { pathname, key: 'start' } ]}>
      <SimExchange />
    </MemoryRouter>);

    const component = loader.find(SimExchange);
    const showsDummy = component.containsMatchingElement(<strong>Coming soon...</strong>);

    expect(showsDummy, 'Should render dummy text').to.be.true;
  });
});
