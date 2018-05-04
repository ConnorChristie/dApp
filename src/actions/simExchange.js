// import store from '../store';

export function selectContract({ contract }) {
  return function(dispatch) {
    dispatch({ type: 'SELECTED_CONTRACT', payload: contract });
  };
}

export function getContractBids(
  { web3, getBids },
  { MarketContract, OrderLib }
) {
  const type = 'GET_BIDS';

  return async function(dispatch) {
    dispatch({ type: `${type}_PENDING` });

    if (web3 && typeof web3 !== 'undefined') {
      // const orderLibInstance = await OrderLib.deployed();
      // const marketContractInstance = await MarketContract.deployed();

      const activeBids = await getBids();

      dispatch({ type: `${type}_FULFILLED`, payload: activeBids });
    } else {
      dispatch({
        type: `${type}_REJECTED`,
        payload: { error: 'Web3 not initialised' }
      });
    }
  };
}

export function getContractAsks(
  { web3, getAsks },
  { MarketContract, OrderLib }
) {
  const type = 'GET_ASKS';

  return async function(dispatch) {
    dispatch({ type: `${type}_PENDING` });

    if (web3 && typeof web3 !== 'undefined') {
      await OrderLib.deployed();
      await MarketContract.deployed();

      const activeAsks = await getAsks();

      dispatch({ type: `${type}_FULFILLED`, payload: activeAsks });
    } else {
      dispatch({
        type: `${type}_REJECTED`,
        payload: { error: 'Web3 not initialised' }
      });
    }
  };
}

export function tradeOrder({ web3, order }, { MarketContract }) {
  const type = 'TRADE_ORDER';

  return async function(dispatch) {
    dispatch({ type: `${type}_PENDING` });

    if (web3 && typeof web3 !== 'undefined') {
      const marketContract = await MarketContract.deployed();

      console.log(order);
      await marketContract.tradeOrder(
        order.orderAddresses,
        order.unsignedOrderValues,
        order.orderQty, // qty is five
        -1, // let us fill a one lot
        order.v, // v
        order.r, // r
        order.s, // s
        { from: web3.eth.accounts[0] }
      );

      // NOTE: this is a very rough example of how this could all work.  Essentially the user selects an order object
      // to trade against and calls trade order from their account.

      dispatch({ type: `${type}_FULFILLED` });
    } else {
      dispatch({
        type: `${type}_REJECTED`,
        payload: { error: 'Web3 not initialised' }
      });
    }
  };
}
