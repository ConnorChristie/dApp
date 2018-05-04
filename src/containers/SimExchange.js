import { connect } from 'react-redux';

import store from '../store';
import Contracts from '../Contracts.js';

import SimExchangeComponent from '../components/SimExchange/SimExchange';
// import { loadContracts } from '../actions/explorer';
import CreateInitializer, {
  contractConstructor
} from '../util/web3/contractInitializer';
import { getBids, getAsks } from '../util/utils';
import {
  getContractAsks,
  getContractBids,
  selectContract,
  tradeOrder
} from '../actions/simExchange';

const mapStateToProps = state => ({
  contracts: state.explorer.contracts,
  ...state.simExchange
});

const simExchangeMarketContract = web3 => {
  const contractAddress = store.getState().simExchange.contract.key;
  const marketContract = web3.eth
    .contract(Contracts.MarketContract)
    .at(contractAddress);

  return marketContract;
};

const mapDispatchToProps = dispatch => ({
  getBids: () => {
    const web3 = store.getState().web3.web3Instance;
    const initializeContracts = CreateInitializer(
      contractConstructor.bind(null, web3)
    );

    const contracts = initializeContracts(Contracts);
    const marketContract = simExchangeMarketContract(web3);

    const getBidsUtil = getBids.bind(
      null,
      web3,
      marketContract,
      contracts.OrderLib
    );

    dispatch(
      getContractBids(
        { web3, getBids: getBidsUtil },
        {
          MarketContract: marketContract,
          OrderLib: contracts.OrderLib
        }
      )
    );
  },
  getAsks: () => {
    const web3 = store.getState().web3.web3Instance;
    const initializeContracts = CreateInitializer(
      contractConstructor.bind(null, web3)
    );

    const contracts = initializeContracts(Contracts);
    const marketContract = simExchangeMarketContract(web3);

    const getAsksUtil = getAsks.bind(
      null,
      web3,
      marketContract,
      contracts.OrderLib
    );

    dispatch(
      getContractAsks(
        { web3, getAsks: getAsksUtil },
        {
          MarketContract: marketContract,
          OrderLib: contracts.OrderLib
        }
      )
    );
  },
  tradeOrder: order => {
    const web3 = store.getState().web3.web3Instance;
    const marketContract = simExchangeMarketContract(web3);

    dispatch(
      tradeOrder(
        { web3, order },
        {
          MarketContract: marketContract
        }
      )
    );
  },
  selectContract: contract => dispatch(selectContract({ contract }))
});

const SimExchange = connect(mapStateToProps, mapDispatchToProps)(
  SimExchangeComponent
);

export default SimExchange;
