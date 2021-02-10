import React, { Component } from "react";
import * as moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton'

import Store from "../../stores";
import { colors } from '../../theme'
import config from "../../stores/config";

import {
  GET_FEEDS,
  FEEDS_RETURNED,
  FEEDS_UPDATED,
} from '../../constants'

const styles = theme => ({
  root: {
    flex: 1,
    maxWidth: '1100px',
    width: 'fit-content',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginTop: '40px',
    [theme.breakpoints.up('xs')]: {
      marginLeft: 'auto',
    },
  },
  contractsContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '800px',
    border: '1px solid '+colors.darkGray,
    borderRadius: '10px',
    padding: '24px 40px',
    [theme.breakpoints.up('xs')]: {
      flexDirection: 'column',
      flexWrap: 'wrap',
      padding: '0px',
      width: 'auto',
    },
  },
  contractContainer: {
    display: 'flex',
    minHeight: '40px',
    alignItems: 'center',
    [theme.breakpoints.up('xs')]: {
      flexDirection: 'column',
      flexWrap: 'wrap',
      padding: '2px',
      width: 'auto',
    },
  },
  contractName: {
    flex: 1,
  },
  contractAddress: {
    flex: 1,
    cursor: 'pointer',
    '&:hover': {
      borderBottom: "1px solid "+colors.blue,
    },
    [theme.breakpoints.up('xs')]: {
      fontSize: '.9rem',
      marginTop: '10px',
    },
  },
  title: {
    padding: '40px',
    minWidth: '100%'
  },
  skeleton: {
    minWidth: '200px'
  }
})

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class Contracts extends Component {

  constructor(props) {
    super()

    const uniFeeds = store.getStore('uniFeeds')
    const sushiFeeds = store.getStore('sushiFeeds')
    const assets = store.getStore('assets')

    this.state = {
      uniFeeds: uniFeeds,
      sushiFeeds: sushiFeeds,
      feeds: [ ...uniFeeds, ...sushiFeeds],
      assets: assets
    }

    dispatcher.dispatch({ type: GET_FEEDS, content: { version: 'Uniswap' } })
    dispatcher.dispatch({ type: GET_FEEDS, content: { version: 'Sushiswap' } })
  };

  componentWillMount() {
    emitter.on(FEEDS_UPDATED, this.feedsReturned);
    emitter.on(FEEDS_RETURNED, this.feedsReturned);
  };

  componentWillUnmount() {
    emitter.removeListener(FEEDS_UPDATED, this.feedsReturned);
    emitter.removeListener(FEEDS_RETURNED, this.feedsReturned);
  };

  feedsReturned = () => {
    const uniFeeds = store.getStore('uniFeeds')
    const sushiFeeds = store.getStore('sushiFeeds')
    const assets = store.getStore('assets')

    this.setState({
      uniFeeds: uniFeeds,
      sushiFeeds: sushiFeeds,
      feeds: [ ...uniFeeds, ...sushiFeeds],
      assets: assets
    })
  }

  contractClicked = (contract) => {
    window.open('https://etherscan.io/address/'+contract, '_blank')
  }

  renderQuoteContracts = () => {
    const { classes } = this.props;

    return (
      <div className={ classes.contractsContainer }>
        <div className={ classes.contractContainer }>
          <Typography variant='h3' className={ classes.contractName }>UniswapKeep3rV1Oracle </Typography>
          <Typography variant='h3' className={ classes.contractAddress }  color='textSecondary' onClick={ () => { this.contractClicked(config.keep3rOracleAddress) } }>{ config.keep3rOracleAddress }</Typography>
        </div>
        <div className={ classes.contractContainer }>
          <Typography variant='h3' className={ classes.contractName }>UniswapKeep3rV1Volatility </Typography>
          <Typography variant='h3' className={ classes.contractAddress } color='textSecondary' onClick={ () => { this.contractClicked(config.keep3rVolatilityAddress) } }>{ config.keep3rVolatilityAddress }</Typography>
        </div>
        <div className={ classes.contractContainer }>
          <Typography variant='h3' className={ classes.contractName }>SushiswapKeep3rV1Oracle </Typography>
          <Typography variant='h3' className={ classes.contractAddress }  color='textSecondary' onClick={ () => { this.contractClicked(config.sushiOracleAddress) } }>{ config.sushiOracleAddress }</Typography>
        </div>
        <div className={ classes.contractContainer }>
          <Typography variant='h3' className={ classes.contractName }>SushiswapKeep3rV1Volatility </Typography>
          <Typography variant='h3' className={ classes.contractAddress }  color='textSecondary' onClick={ () => { this.contractClicked(config.sushiVolatilityAddress) } }>{ config.sushiVolatilityAddress }</Typography>
        </div>
      </div>
    )
  }

  renderFeedContracts = () => {
    const { classes } = this.props;
    const { feeds } = this.state

    return (
      <div className={ classes.contractsContainer }>
        {
          feeds && feeds.map((feed) => {
            return (
              <div className={ classes.contractContainer }>
                { (feed && feed.token0) ? <Typography variant='h3' className={ classes.contractName }>{ feed.type } - { feed.token0.symbol } / { feed.token1.symbol }</Typography> : <Skeleton className={ classes.skeleton } />  }
                { (feed && feed.token0) ? <Typography variant='h3' className={ classes.contractAddress }  color='textSecondary' onClick={ () => { this.contractClicked(feed.address) } }>{ feed.address }</Typography> : <Skeleton className={ classes.skeleton } /> }
              </div>
            )
          })
        }
      </div>
    )
  }

  renderTokenContracts = () => {
    const { classes } = this.props;
    const { assets } = this.state

    return (
      <div className={ classes.contractsContainer }>
        {
          assets && assets.map((asset) => {
            return (
              <div className={ classes.contractContainer }>
                <Typography variant='h3' className={ classes.contractName }>{ asset.symbol }</Typography>
                <Typography variant='h3' className={ classes.contractAddress }  color='textSecondary' onClick={ () => { this.contractClicked(asset.address) } }>{ asset.address }</Typography>
              </div>
            )
          })
        }
      </div>
    )
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={ classes.root }>
        <Typography variant='h1' className={ classes.title }>Quote Addresses</Typography>
        { this.renderQuoteContracts() }
        <Typography variant='h1' className={ classes.title }>Pair Addresses</Typography>
        { this.renderFeedContracts() }
        <Typography variant='h1' className={ classes.title }>Token Addresses</Typography>
        { this.renderTokenContracts() }
      </div>
    )
  }
}

export default withStyles(styles)(Contracts);
