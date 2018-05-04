/**
 * Default mocked contract instances.
 * It is currenlty setup to work along the happy paths.
 * 
 * ASIDE: There should be a library that can read abi's and automatically create a
 *        mock with default implementations just like this module is doing manually.
 * 
 */
const defaultContractInstances = {
  MarketContractRegistry: {
    address: '0x00001',
    addAddressToWhiteList(address, ...params) {},
    isAddressWhiteListed(address) { return Promise.resolve(true); },
    getAddressWhiteList: { call() { return Promise.resolve([]); } }
  },
  MarketContract: {
    address: '0x00002',
    setCollateralPoolContractAddress(address, ...params) {}
  },
  MarketCollateralPool: {
    address: '0x00003'
  },
  MarketToken: {
    address: '0x00004'
  },
  QueryTest: {
    address: '0x00005',
    queryCost: 20000,
    getQueryCost(oracleSource) { return this.queryCost; }
  }
};

/**
 * Base mock contract.
 * All exported contracts inherit from this contract.
 */
function MockContract() {}
MockContract.prototype = {
  instance: {},
  new(address, ...params) {
    return Promise.resolve(this.instance);
  },
  deployed() {
    return Promise.resolve(this.instance);
  },
  at(address) {
    return Promise.resolve(this.instance);
  }
};

function createMockContract(contractName) {
  function MockMarketToken() { }
  Object.assign(
    MockMarketToken.prototype,
    MockContract.prototype, 
    {
      // update instance with default contract instances
      instance: defaultContractInstances[contractName]
    }
  );

  return () => (new MockMarketToken());
}

export const MarketContractRegistry = createMockContract('MarketContractRegistry');
export const MarketContract = createMockContract('MarketContract');
export const MarketCollateralPool = createMockContract('MarketCollateralPool');
export const MarketToken = createMockContract('MarketToken');
export const CollateralToken = createMockContract('CollateralToken');
export const QueryTest = createMockContract('QueryTest');
export const OrderLib = createMockContract('OrderLib');