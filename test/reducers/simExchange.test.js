import React from 'react';
import { expect } from 'chai';

import simExchange from '../../src/reducers/simExchange';

describe('SimExchange Reducer', () => {
  const actions = {
    asksPending: 'GET_ASKS_PENDING',
    asksFulfilled: 'GET_ASKS_FULFILLED',
    asksRejected: 'GET_ASKS_REJECTED',
    bidsPending: 'GET_BIDS_PENDING',
    bidsFulfilled: 'GET_BIDS_FULFILLED',
    bidsRejected: 'GET_BIDS_REJECTED',
    tradeOrderPending: 'TRADE_ORDER_PENDING',
    tradeOrderFulfilled: 'TRADE_ORDER_FULFILLED',
    tradeOrderRejected: 'TRADE_ORDER_REJECTED',
    selectedContract: 'SELECTED_CONTRACT',
  };

  it('should return loading state with ASKS PENDING action', () => {
    const newState = simExchange({}, { type: actions.asksPending });
    expect(newState.loading).to.equal(true);
    expect(newState.error).to.equal(null);
  });

  it('should return loading state with BIDS PENDING action', () => {
    const newState = simExchange({}, { type: actions.bidsPending });
    expect(newState.loading).to.equal(true);
    expect(newState.error).to.equal(null);
  });

  it('should return loading state with TRADE ORDER PENDING action', () => {
    const newState = simExchange({}, { type: actions.tradeOrderPending });
    expect(newState.loading).to.equal(true);
    expect(newState.error).to.equal(null);
  });

  it('should return result state with ASKS FULFILLED action', () => {
    const expectedTransaction = 'Result of query';
    const newState = simExchange({}, { type: actions.asksFulfilled, payload: expectedTransaction });
    expect(newState.asks).to.equal(expectedTransaction);
    expect(newState.loading).to.equal(false);
    expect(newState.error).to.equal(null);
  });

  it('should return result state with BIDS FULFILLED action', () => {
    const expectedTransaction = 'Result of query';
    const newState = simExchange({}, { type: actions.bidsFulfilled, payload: expectedTransaction });
    expect(newState.bids).to.equal(expectedTransaction);
    expect(newState.loading).to.equal(false);
    expect(newState.error).to.equal(null);
  });

  it('should return result state with TRADE ORDER FULFILLED action', () => {
    const expectedTransaction = 'Result of query';
    const newState = simExchange({}, { type: actions.tradeOrderFulfilled, payload: expectedTransaction });
    expect(newState.trades).to.equal(expectedTransaction);
    expect(newState.loading).to.equal(false);
    expect(newState.error).to.equal(null);
  });

  it('should return result state with ASKS REJECTED action', () => {
    const expectedError = new Error('error');
    const newState = simExchange({}, { type: actions.asksRejected, payload: expectedError });
    expect(newState.loading).to.equal(false);
    expect(newState.error).to.equal(expectedError);
  });

  it('should return result state with BIDS REJECTED action', () => {
    const expectedError = new Error('error');
    const newState = simExchange({}, { type: actions.bidsRejected, payload: expectedError });
    expect(newState.loading).to.equal(false);
    expect(newState.error).to.equal(expectedError);
  });

  it('should return result state with TRADE ORDER REJECTED action', () => {
    const expectedError = new Error('error');
    const newState = simExchange({}, { type: actions.tradeOrderRejected, payload: expectedError });
    expect(newState.loading).to.equal(false);
    expect(newState.error).to.equal(expectedError);
  });

  it('should return result state with SELECTED CONTRACT action', () => {
    const expectedContract = 'My contract';
    const newState = simExchange({}, { type: actions.selectedContract, payload: expectedContract });
    expect(newState.contract).to.equal(expectedContract);
  });
});
