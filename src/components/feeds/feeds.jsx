import React, { Component } from "react";
import * as moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";
import {
  Typography,
  CircularProgress
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import Store from "../../stores";
import { colors } from '../../theme'

import {
  GET_FEEDS,
  FEEDS_RETURNED,
  FEEDS_UPDATED,
} from '../../constants'

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    maxWidth: '1100px',
    width: '100%',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginTop: '40px'
  },
  feedContainer: {
    position: 'relative',
    background: colors.lightGray,
    width: '240px',
    padding: '24px 8px',
    minHeight: '280px',
    margin: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
    cursor: 'pointer',
    '&:hover': {
      background: 'rgba(0,0,0,0.1)'
    }
  },
  pricePoint: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '6px 0px',
    zIndex: 1
  },
  updated: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '24px',
    marginBottom: '6px',
    zIndex: 1
  },
  pair: {
    marginBottom: '6px',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  volatilityHead: {
    marginTop: '24px',
    marginBottom: '6px',
    zIndex: 1
  },
  volatility: {
    margin: '6px 0px',
    zIndex: 1
  },
  gray: {
    color: colors.darkGray,
    zIndex: 1
  },
  feedBackground: {
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    filter: 'grayscale(100%)',
    opacity: 0.05
  },
  toggleButton: {

  },
  filters: {
    minWidth: '100%',
    padding: '12px'
  },
  productIcon: {
    marginRight: '12px'
  },
  skeletonFrame: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  skeleton: {
    width: '100px',
    marginBottom: '12px'
  },
  skeletonTitle: {
    width: '150px',
    marginBottom: '6px',
    marginTop: '12px'
  }
})

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class Feeds extends Component {

  constructor(props) {
    super()

    const uniFeeds = store.getStore('uniFeeds')
    const sushiFeeds = store.getStore('sushiFeeds')

    this.state = {
      uniFeeds: uniFeeds,
      sushiFeeds: sushiFeeds,
      feeds: [ ...uniFeeds, ...sushiFeeds],
      feedFilter: null,

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

    this.setState({
      uniFeeds: uniFeeds,
      sushiFeeds: sushiFeeds,
      feeds: [ ...uniFeeds, ...sushiFeeds]
    })
  }

  onFeedFilterChanged = (event, newVal) => {
    this.setState({ feedFilter: newVal })
  }

  feedClicked = (feed) => {
    this.props.history.push('/charts/'+feed.address)
    /*if(feed.type === 'Uniswap') {
      window.open('https://info.uniswap.org/pair/'+feed.address, '_blank')
    } else {
      window.open('https://www.sushiswap.fi/pair/'+feed.address, '_blank')
    }*/

  }

  render() {
    const { classes } = this.props;

    return (
      <div className={ classes.root }>
        { this.renderFilters() }
        { this.renderFeeds() }
      </div>
    )
  }

  renderFilters = () => {
    const { classes } = this.props;
    const { feedFilter } = this.state;

    return (
      <div className={ classes.filters}>
        <ToggleButtonGroup
          value={ feedFilter }
          exclusive
          onChange={ this.onFeedFilterChanged }
          className={ classes.feedFilters }
          >
          <ToggleButton value="Uniswap" >
            <img src={require('../../assets/tokens/UNI-logo.png')} alt='' width={ 30 } height={ 30 } className={ classes.productIcon }/>
            <Typography variant='h3'>Uniswap</Typography>
          </ToggleButton>
          <ToggleButton value="Sushiswap">
            <img src={require('../../assets/tokens/SUSHI-logo.png')} alt='' width={ 30 } height={ 30 } className={ classes.productIcon } />
            <Typography variant='h3'>Sushiswap</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    )
  }

  renderFeeds = () => {
    const {
      feeds,
      feedFilter
    } = this.state

    if(!feeds) {
      return <div></div>
    }

    console.log(feedFilter)

    return feeds.filter((feed) => {
      if(!feedFilter) {
        return true
      }

      return feed.type === feedFilter
    }).map((feed, index) => {
      return this.renderFeed(feed, index)
    })
  }

  renderFeed = (feed, index) => {
    const { classes } = this.props;

    return (
      <div className={ classes.feedContainer } key={ index } onClick={ feed.address ? () => { this.feedClicked(feed) } : null }>
        { feed.type &&
          <div className={ classes.pair }>
            { feed.type === 'Uniswap' && <img src={require('../../assets/tokens/UNI-logo.png')} alt='' width={ 30 } height={ 30 } className={ classes.productIcon }/> }
            { feed.type === 'Sushiswap' && <img src={require('../../assets/tokens/SUSHI-logo.png')} alt='' width={ 30 } height={ 30 } className={ classes.productIcon }/> }
            <Typography variant='h6'>{ feed.type }</Typography>
          </div>
        }
        { (!feed.token0 || !feed.token1) && <div className={ classes.skeletonFrame }>
            <Skeleton className={ classes.skeletonTitle } height={ 30 } />
            <Skeleton className={ classes.skeleton } />
            <Skeleton className={ classes.skeleton } />
            <Skeleton className={ classes.skeletonTitle } height={ 30 } />
            <Skeleton className={ classes.skeleton } />
            <Skeleton className={ classes.skeleton } />
            <Skeleton className={ classes.skeletonTitle } height={ 30 } />
            <Skeleton className={ classes.skeleton } />
            <Skeleton className={ classes.skeleton } />
            <Skeleton className={ classes.skeletonTitle } />
          </div>
        }
        { feed.token0 && feed.token1 &&
          <div className={ classes.pair }>
            <Typography variant='h2'>{ feed.token0.symbol } / { feed.token1.symbol }</Typography>
          </div>
        }
        { feed.token0 && feed.token1 &&
          <div className={ classes.pricePoint }>
            <Typography variant='h3'>{ feed.consult && feed.consult.consult0To1 ? feed.consult.consult0To1.toFixed(4) : '0.00' } { feed.token1.symbol }</Typography>
          </div>
        }
        { feed.token0 && feed.token1 &&
          <div className={ classes.pricePoint }>
            <Typography variant='h3'>$ { feed.priceToken0 ? feed.priceToken0 : (feed.priceToken1 && feed.consult && feed.consult.consult0To1 ? (feed.consult.consult0To1 * feed.priceToken1).toFixed(2) : '0.00' ) } </Typography>
          </div>
        }
        { feed.volatility &&
          <div className={ classes.volatilityHead }>
            <Typography variant='h2'>Volatility</Typography>
          </div>
        }
        { feed.volatility && feed.volatility.realizedVolatility && (!feed.volatility.realizedVolatilityHourly && !feed.volatility.realizedVolatilityDaily && !feed.volatility.realizedVolatilityWeekly) &&
          <div className={ classes.volatility }>
            <Typography variant='h3'>{ feed.volatility.realizedVolatility.toFixed(2) }%</Typography>
          </div>
        }
        { feed.volatility && feed.volatility.realizedVolatilityHourly &&
          <div className={ classes.volatility }>
            <Typography variant='h3'>Hourly: { feed.volatility.realizedVolatilityHourly.toFixed(2) }%</Typography>
          </div>
        }
        { feed.volatility && feed.volatility.realizedVolatilityDaily &&
          <div className={ classes.volatility }>
            <Typography variant='h3'>Daily: { feed.volatility.realizedVolatilityDaily.toFixed(2) }%</Typography>
          </div>
        }
        { feed.volatility && !feed.volatility.realizedVolatility && !feed.volatility.realizedVolatilityHourly && !feed.volatility.realizedVolatilityDaily && !feed.volatility.realizedVolatilityWeekly &&
          <div className={ classes.volatility }>
            <Typography variant='h3'>Unknown</Typography>
          </div>
        }
        { feed.quote &&
          <div className={ classes.volatilityHead }>
            <Typography variant='h2'>Options</Typography>
          </div>
        }
        { feed.quote &&
          <div className={ classes.volatility }>
            { feed.quote.call != null && <Typography variant='h3'>Call: $ { feed.quote.call.toFixed(2) } </Typography> }
            { feed.quote.call == null && <Typography variant='h3'>Call: Unknown</Typography> }
          </div>
        }
        { feed.quote &&
          <div className={ classes.volatility }>
            { feed.quote.put != null && <Typography variant='h3'>Put: $ { feed.quote.put.toFixed(2) } </Typography> }
            { feed.quote.put == null && <Typography variant='h3'>Put: Unknown</Typography> }
          </div>
        }
        { feed.lastUpdated &&
          <div className={ classes.updated }>
            <Typography variant='h6'>Last updated: { moment(feed.lastUpdated*1000).fromNow() }</Typography>
          </div>
        }
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(Feeds));
