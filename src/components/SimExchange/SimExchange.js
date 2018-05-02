import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { Route, Redirect, Switch, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import TopBar from './TopBar';
import Trades from './Trades';
import Wallet from './Wallet';

const { Content, Header, Sider } = Layout;

class SimExchange extends Component {
  componentWillMount() {
    if (!this.props.contracts) {
      // this.props.getContracts();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.contracts && !nextProps.contract) {
      // this.props.selectContract(nextProps.contracts[0]);
      // this.props.getAsks();
      // this.props.getBids();
    }
  }

  render() {
    const { asks, bids, contract, contracts, location } = this.props;

    if (!this.props.shouldRender) {
      return (
        <div
          className="text-center"
          style={{ fontSize: '18px', padding: '4em' }}
        >
          <strong>Coming soon...</strong>
        </div>
      );
    }

    return (
      <Layout>
        <Header style={{ paddingLeft: '224px', background: '#fff' }}>
          <TopBar
            contract={contract}
            contracts={contracts}
            onSelectContract={this.props.selectContract}
          />
        </Header>
        <Layout style={{ background: '#fff' }}>
          <Sider style={{ background: '#fff' }} width={200}>
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              style={{ height: '95px' }}
            >
              <Menu.Item key="/exchange/trades/">
                <Link to="/exchange/trades/">Trades</Link>
              </Menu.Item>
              <Menu.Item key="/exchange/wallet/">
                <Link to="/exchange/wallet/">Wallet</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Content
            style={{ padding: '0 24px', minHeight: 250, marginBottom: '20px' }}
          >
            <Switch>
              <Route
                path="/:url*"
                exact
                strict
                render={props => (
                  <Redirect to={`${props.location.pathname}/`} />
                )}
              />
              <Route
                path="/exchange/trades/"
                exact
                render={() => (
                  <Trades
                    asks={asks}
                    bids={bids}
                    tradeOrder={this.props.tradeOrder}
                  />
                )}
              />
              <Route path="/exchange/wallet/" exact component={Wallet} />
              <Redirect to="/exchange/trades/" />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

SimExchange = withRouter(SimExchange);

export default SimExchange;
