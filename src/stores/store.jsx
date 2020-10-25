
import async from 'async';
import config from "./config";
import {
  GET_FEEDS,
  FEEDS_UPDATED,
  FEEDS_RETURNED,
} from '../constants';

import { ERC20ABI } from "./abi/erc20ABI";
import { UniswapV2OracleABI } from './abi/uniswapV2OracleABI';
import { UniswapV2PairABI } from './abi/uniswapV2PairABI';

import Web3 from 'web3';
const web3 = new Web3(config.provider)

const rp = require('request-promise');

const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

class Store {
  constructor() {

    this.store = {
      assets: [
        {
          address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          decimals: "18",
          symbol: "WETH",
          price_id: 'ethereum',
        },
        {
          address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
          decimals: "8",
          symbol: "WBTC",
          price_id: 'wrapped-bitcoin',
        },
        {
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          decimals: "6",
          symbol: "USDC",
          price_id: 'usd-coin'
        },
        {
          address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          decimals: "6",
          symbol: "USDT",
          price_id: 'tether'
        },
        {
          address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
          decimals: "18",
          symbol: "DAI",
          price_id: 'dai',
        },
        {
          address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
          decimals: "18",
          symbol: "UNI",
          price_id: 'uniswap',
        },
        {
          address: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
          decimals: "18",
          symbol: "YFI",
          price_id: 'yearn-finance',
        },
        {
          address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
          decimals: "18",
          symbol: "AAVE",
          price_id: 'aave',
        },
        {
          address: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
          decimals: "18",
          symbol: "COMP",
          price_id: 'compound-governance-token',
        },
        {
          address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
          decimals: "18",
          symbol: "MKR",
          price_id: 'maker',
        }
      ],
      priceFeeds: [

      ]
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case GET_FEEDS:
            this.getFeeds(payload);
            break;
        }
      }.bind(this)
    );
  }

  getStore(index) {
    return(this.store[index]);
  };

  setStore(obj) {
    this.store = {...this.store, ...obj}
    return emitter.emit('StoreUpdated');
  };


  //get pairs




  // get hard-coded address to { decimals, name, icon }
  // populate pair token info
  // get missing pair token info
    // retunr temp data

  // get consult pricing
  // get coingecko USD/ETH pricing


  getFeeds = async () => {
    try {
      const uniOracleContract = new web3.eth.Contract(UniswapV2OracleABI, config.unioracleAddress)
      const pairs = await uniOracleContract.methods.pairs().call({})

      if(!pairs || pairs.length === 0) {
        return emitter.emit(FEEDS_RETURNED)
      }

      store.setStore({ feeds: pairs })
      emitter.emit(FEEDS_UPDATED)


      const usdPrices = await this._getUSDPrices()
      console.log(usdPrices)

      async.map(pairs, async (pair, callback) => {

        let pairPopulated = await this._populatePairsTokens(pair)
        pairPopulated.address = pair

        console.log(pairPopulated)

        let consult = await this._getConsult(pairPopulated)
        pairPopulated.consult = consult

        const usdPrice0 = usdPrices[pairPopulated.token0.price_id]
        const usdPrice1 = usdPrices[pairPopulated.token1.price_id]

        if(usdPrice0) {
          pairPopulated.priceToken0 = usdPrice0.usd
        }
        if(usdPrice1) {
          pairPopulated.priceToken1 = usdPrice1.usd
        }


        return pairPopulated

      }, (err, pairsData) => {
        if(err) {
          console.log(err)
        }
        console.log(pairsData)
        store.setStore({ feeds: pairsData })
        emitter.emit(FEEDS_RETURNED)
      })

    } catch(e) {
      console.log(e)
      return {}
    }
  }

  _populatePairsTokens = async (pair) => {
    try {
      const assets = store.getStore('assets')

      const uniswapV2PairContract = new web3.eth.Contract(UniswapV2PairABI, pair)
      const token0Address = await uniswapV2PairContract.methods.token0().call({ })
      const token1Address = await uniswapV2PairContract.methods.token1().call({ })

      let token0 = null
      let token1 = null

      let token0Data = assets.filter((asset) => {
        return asset.address.toLowerCase() === token0Address.toLowerCase()
      })

      if(token0Data.length > 0) {
        token0 = token0Data[0]
      } else {
        const token0Contract = new web3.eth.Contract(ERC20ABI, token0Address)

        token0 = {
          address: token0Address,
          symbol: await token0Contract.methods.symbol().call({}),
          decimals: await token0Contract.methods.decimals().call({})
        }
      }


      let token1Data = assets.filter((asset) => {
        return asset.address.toLowerCase() === token1Address.toLowerCase()
      })

      if(token1Data.length > 0) {
        token1 = token1Data[0]
      } else {
        const token1Contract = new web3.eth.Contract(ERC20ABI, token1Address)

        token1 = {
          address: token1Address,
          symbol: await token1Contract.methods.symbol().call({}),
          decimals: await token1Contract.methods.decimals().call({})
        }
      }

      return {
        token0,
        token1
      }
    } catch(ex) {
      console.log(ex)
      console.log(pair)
      return {
        token0: {},
        token1: {},
        error: ex
      }
    }

  }

  _getConsult = async (pair) => {
    try {

      const uniOracleContract = new web3.eth.Contract(UniswapV2OracleABI, config.unioracleAddress)

      let sendAmount0 = (10*10**pair.token0.decimals).toFixed(0)
      let sendAmount1 = (10*10**pair.token1.decimals).toFixed(0)

      const consult0To1 = await uniOracleContract.methods.consult(pair.token0.address, sendAmount0, pair.token1.address).call({ })
      const consult1To0 = await uniOracleContract.methods.consult(pair.token1.address, sendAmount1, pair.token0.address).call({ })

      return {
        consult0To1: consult0To1/10**pair.token1.decimals,
        consult1To0: consult1To0/10**pair.token0.decimals,
      }
    } catch(e) {
      return {
        consult0To1: null,
        consult1To0: null,
        err: e
      }
    }
  }

  _getUSDPrices = async () => {
    try {
      const url = 'https://api.coingecko.com/api/v3/simple/price?ids=dai,usd-coin,true-usd,tether,usd-coin,yearn-finance,wrapped-bitcoin,ethereum,aave&vs_currencies=usd'
      const priceString = await rp(url);
      const priceJSON = JSON.parse(priceString)

      return priceJSON
    } catch(e) {
      console.log(e)
      return null
    }
  }
}

var store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
