import { expect } from 'chai';
import sinon from 'sinon';
import Web3 from 'web3';
import FakeProvider from 'web3-fake-provider';

import { MarketContract, OrderLib } from '../mocks/contracts';
import { selectContract, getContractBids, getContractAsks, tradeOrder } from '../../src/actions/simExchange';

function mockedCoinbaseWeb3(callbackError = null, coinbaseAddress = '0x123456') {
  const fakeProvider = new FakeProvider();
  const web3 = new Web3(fakeProvider);
  fakeProvider.injectResult(['0x98765']);
  web3.eth.getCoinbase = (callback) => { callback(callbackError, coinbaseAddress); };
  return web3;
}

describe('SimExchange Actions', () => {
  let web3;
  let dispatchSpy;
  let queryParams;
  let mockContracts;

  beforeEach(() => {
    web3 = mockedCoinbaseWeb3();
    dispatchSpy = sinon.spy();
    queryParams = { web3 };
    mockContracts = { MarketContract: MarketContract(), OrderLib: OrderLib() };
  });

  describe('select contract', () => {
    it('should dispatch selected contract', () => {
      const contract = '0x00001';
      const action = selectContract({ contract });
  
      action(dispatchSpy);
  
      expect(dispatchSpy).to.have.property('callCount', 1);
      expect(dispatchSpy.args[0][0].type).to.equals('SELECTED_CONTRACT');
      expect(dispatchSpy.args[0][0].payload).to.equals(contract);
    });
  });

  describe('get contract bids', () => {
    it('should get bids when web3 is enabled', () => {
      const expectedResult = { bids: [] };

      const action = getContractBids({
        web3, getBids: () => (Promise.resolve(expectedResult))
      }, mockContracts);

      action(dispatchSpy).then(() => {
        expect(dispatchSpy).to.have.property('callCount', 2);
        expect(dispatchSpy.args[0][0].type).to.equals('GET_BIDS_PENDING');
        expect(dispatchSpy.args[1][0].type).to.equals('GET_BIDS_FULFILLED');
        expect(dispatchSpy.args[1][0].payload).to.deep.equal(expectedResult);
      }).catch(fail);
    });

    it('should reject when web3 is not enabled', () => {
      const action = getContractBids({
        web3: null, getBids: () => (Promise.resolve({}))
      }, mockContracts);

      action(dispatchSpy).then(() => {
        expect(dispatchSpy).to.have.property('callCount', 2);
        expect(dispatchSpy.args[0][0].type).to.equals('GET_BIDS_PENDING');
        expect(dispatchSpy.args[1][0].type).to.equals('GET_BIDS_REJECTED');
      }).catch(fail);
    });
  });

  describe('get contract asks', () => {
    it('should get asks when web3 is enabled', () => {
      const expectedResult = { asks: [] };

      const action = getContractAsks({
        web3, getAsks: () => (Promise.resolve(expectedResult))
      }, mockContracts);

      action(dispatchSpy).then(() => {
        expect(dispatchSpy).to.have.property('callCount', 2);
        expect(dispatchSpy.args[0][0].type).to.equals('GET_ASKS_PENDING');
        expect(dispatchSpy.args[1][0].type).to.equals('GET_ASKS_FULFILLED');
        expect(dispatchSpy.args[1][0].payload).to.deep.equal(expectedResult);
      }).catch(fail);
    });

    it('should reject when web3 is not enabled', () => {
      const action = getContractAsks({
        web3: null, getAsks: () => (Promise.resolve({}))
      }, mockContracts);

      action(dispatchSpy).then(() => {
        expect(dispatchSpy).to.have.property('callCount', 2);
        expect(dispatchSpy.args[0][0].type).to.equals('GET_ASKS_PENDING');
        expect(dispatchSpy.args[1][0].type).to.equals('GET_ASKS_REJECTED');
      }).catch(fail);
    });
  });

  describe('trade order', () => {
    it('should submit trade order when web3 is enabled', () => {
      const order = {
        orderAddresses: [],
        unsignedOrderValues: [],
        orderQty: 5,
        v: 1,
        r: 2,
        s: 3
      };

      const tradeOrderSpy = sinon.spy();

      Object.assign(mockContracts.MarketContract.instance, {
        tradeOrder: tradeOrderSpy
      });

      const action = tradeOrder({
        web3, order
      }, mockContracts);

      action(dispatchSpy).then(() => {
        expect(dispatchSpy).to.have.property('callCount', 2);
        expect(dispatchSpy.args[0][0].type).to.equals('TRADE_ORDER_PENDING');
        expect(dispatchSpy.args[1][0].type).to.equals('TRADE_ORDER_FULFILLED');

        expect(tradeOrderSpy.args[0][0]).to.equals(order.orderAddresses);
        expect(tradeOrderSpy.args[0][1]).to.equals(order.unsignedOrderValues);
        expect(tradeOrderSpy.args[0][2]).to.equals(order.orderQty);
        expect(tradeOrderSpy.args[0][3]).to.equals(-1);
        expect(tradeOrderSpy.args[0][4]).to.equals(order.v);
        expect(tradeOrderSpy.args[0][5]).to.equals(order.r);
        expect(tradeOrderSpy.args[0][6]).to.equals(order.s);
        expect(tradeOrderSpy.args[0][7].from).to.equals('0x98765');
      }).catch(fail);
    });

    it('should reject when web3 is not enabled', () => {
      const action = tradeOrder({
        web3: null, order: null
      }, mockContracts);

      action(dispatchSpy).then(() => {
        expect(dispatchSpy).to.have.property('callCount', 2);
        expect(dispatchSpy.args[0][0].type).to.equals('TRADE_ORDER_PENDING');
        expect(dispatchSpy.args[1][0].type).to.equals('TRADE_ORDER_REJECTED');
      }).catch(fail);
    });
  });
});