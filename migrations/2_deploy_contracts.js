const Ownable = artifacts.require("zeppelin-solidity/contracts/ownership/Ownable.sol");
const Destructible = artifacts.require("zeppelin-solidity/contracts/lifecycle/Destructible.sol");
const Authentication = artifacts.require("./Authentication.sol");
const QueryTest = artifacts.require("market-solidity/contracts/oraclize/OraclizeQueryTest.sol");

const MathLib = artifacts.require("market-solidity/contracts/libraries/MathLib.sol");
const OrderLib = artifacts.require("market-solidity/contracts/libraries/OrderLib.sol");
const CollateralToken = artifacts.require("market-solidity/contracts/tokens/CollateralToken.sol");
const MarketContractOraclize = artifacts.require("market-solidity/contracts/oraclize/MarketContractOraclize.sol");
const MarketCollateralPool = artifacts.require("market-solidity/contracts/MarketCollateralPool.sol");
const MarketContractRegistry = artifacts.require("market-solidity/contracts/MarketContractRegistry.sol");
const MarketToken = artifacts.require("market-solidity/contracts/tokens/MarketToken.sol");


module.exports = function(deployer, network) {
  if(network !== "live") {
    deployer.deploy(Ownable);
    deployer.link(Ownable, Destructible);
    deployer.deploy(Destructible);
    deployer.link(Destructible, Authentication);
    deployer.deploy(Authentication);
    deployer.deploy(QueryTest);

    deployer.deploy(MathLib);
    deployer.deploy(OrderLib);
    deployer.deploy(MarketContractRegistry)

    deployer.link(MathLib, MarketContractOraclize);
    deployer.link(OrderLib, MarketContractOraclize);

    const marketTokenToLockForTrading = 0;    // for testing purposes, require no lock
    const marketTokenAmountForContractCreation = 0;   //for testing purposes require no balance
    const marketContractExpiration = Math.floor(Date.now() / 1000) + 60 * 15; // expires in 15 minutes.

    // deploy primary instance of market contract
    deployer.deploy(
      MarketToken,
      marketTokenToLockForTrading,
      marketTokenAmountForContractCreation
    ).then(function () {
      return deployer.deploy(CollateralToken).then(function () {
        let gasLimit = 6200000;  // gas limit for development network
        let block = web3.eth.getBlock("latest");
        if (block.gasLimit > 7000000) {  // coverage network
          gasLimit = block.gasLimit;
        }
        return deployer.deploy(
          MarketContractOraclize,
          "ETHXBT",
          MarketToken.address,
          CollateralToken.address,
          [20155, 60465, 2, 10, marketContractExpiration],
          "URL",
          "json(https://api.kraken.com/0/public/Ticker?pair=ETHUSD).result.XETHZUSD.c.0",
          120,
          {gas: gasLimit, value: web3.toWei('.2', 'ether'), from: web3.eth.accounts[0]}
        )
      }).then(function () {
        return deployer.deploy(
          MarketCollateralPool,
          MarketContractOraclize.address
        ).then(function () {
          return MarketContractOraclize.deployed();
        }).then(function (instance) {
          return instance.setCollateralPoolContractAddress(MarketCollateralPool.address);
        })
      }).then(function () {
        return MarketContractRegistry.deployed();
      }).then(function (instance) {
        instance.addAddressToWhiteList(MarketContractOraclize.address);
      });
    }).then(async function() {
      // we are just going to deploy several MARKET contracts here in order to create needed design elements
      // in our DApp.
      const gasLimit = 6200000;  // gas limit for development network
      await MarketToken.deployed();
      await CollateralToken.deployed();
      let marketContractRegistry = await MarketContractRegistry.deployed();
      for (let i = 0; i < 25; i++) {
        let contractName = "ETHXBT-" + i;
        let expirationTimeStamp = Math.floor(Date.now() / 1000) + 60 * 15 * i;
        let deployedMarketContract = await MarketContractOraclize.new(
          contractName,
          MarketToken.address,
          CollateralToken.address,
          [20155 + i, 60465 + i * 2, 2, 10, expirationTimeStamp],
          "URL",
          "json(https://api.kraken.com/0/public/Ticker?pair=ETHUSD).result.XETHZUSD.c.0",
          120,
          {gas: gasLimit, value: web3.toWei('.2', 'ether'), from: web3.eth.accounts[0]}
        );

        let deployedCollateralPool = await MarketCollateralPool.new(
          deployedMarketContract.address
        );

        await deployedMarketContract.setCollateralPoolContractAddress(
          deployedCollateralPool.address
        );
        await marketContractRegistry.addAddressToWhiteList(deployedMarketContract.address);
      } // end for loop
    });
  }
};

