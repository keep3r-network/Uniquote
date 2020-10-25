import React, { Component } from "react";
import * as moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  CircularProgress
} from '@material-ui/core';

import Store from "../../stores";
import { colors } from '../../theme'

import {
  ERROR,
  GET_FEEDS,
  FEEDS_RETURNED,
  FEEDS_UPDATED,
} from '../../constants'

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    maxWidth: '900px',
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: '40px'
  },
  feedContainer: {
    background: colors.lightGray,
    width: '200px',
    height: '220px',
    padding: '12px',
    margin: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
    '&:hover': {
      background: 'rgba(0,0,0,0.1)'
    }
  },
  pricePoint: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '6px 0px'
  },
  pair: {
    marginBottom: '24px'
  }
})

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class Feeds extends Component {

  constructor(props) {
    super()

    const feeds = store.getStore('feeds')

    this.state = {
      feeds: feeds
    }

    dispatcher.dispatch({ type: GET_FEEDS, content: { } })
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
    this.setState({ feeds: store.getStore('feeds') })
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={ classes.root }>
        { this.renderFeeds() }
      </div>
    )
  }

  renderFeeds = () => {
    const {
      feeds,
    } = this.state

    if(!feeds) {
      return <div></div>
    }

    return feeds.map((feed) => {
      return this.renderFeed(feed)
    })
  }

  renderFeed = (feed) => {
    const { classes } = this.props;

    return (
      <div className={ classes.feedContainer }>
        { (!feed.token0 || !feed.token1) && <CircularProgress /> }
        <div className={ classes.pair }>
          { feed.token0 && feed.token1 && <Typography variant='h2'>{ feed.token0.symbol } / { feed.token1.symbol }</Typography> }
        </div>
        <div className={ classes.pricePoint }>
          { feed.token0 && feed.token1 && <Typography variant='h3'>{ feed.consult && feed.consult.consult0To1 ? feed.consult.consult0To1.toFixed(4) : '0.00' } ETH</Typography> }
        </div>
        <div className={ classes.pricePoint }>
          { feed.token0 && feed.token1 && <Typography variant='h3'>$ { feed.priceToken0 ? feed.priceToken0 : '0.00' } </Typography> }
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Feeds);
