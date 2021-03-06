import React, { Component } from "react";
import * as moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  CircularProgress
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import Store from "../../stores";
import { colors } from '../../theme'

import { render } from 'react-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import {
  GET_PRICES,
  PRICES_RETURNED,
  PRICES_UPDATED,
} from '../../constants'

let priceOptions = {
  chart: {
    type: 'spline'
  },
  title: {
    text: 'Price Data'
  },
  series: [
    {
      data: [1, 2, 1, 4, 3, 6]
    }
  ]
};

let volOptions = {
  chart: {
    type: 'spline'
  },
  title: {
    text: 'Volatility'
  },
  series: [
    {
      data: [1, 2, 1, 4, 3, 6]
    }
  ]
};

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

    const graphData = store.getStore('graphData')

    this.state = {
      graphData: graphData,
      priceOptions: priceOptions,
      volOptions: volOptions
    }

    dispatcher.dispatch({ type: GET_PRICES, content: { pair: props.match.params.pair } })
  };

  componentWillMount() {
    emitter.on(PRICES_RETURNED, this.pricesReturned);
  };

  componentWillUnmount() {
    emitter.removeListener(PRICES_RETURNED, this.pricesReturned);
  };

  pricesReturned = () => {
    const graphData = store.getStore('graphData')
    priceOptions = {
      chart: {
        type: 'spline'
      },
      title: {
        text: 'Price Data'
      },
      xAxis: {
        categories: graphData.dataTimeSeries,
      },
      series: [
        {
          data: graphData.data0To1
        }
      ]
    };
    console.log(graphData.vol0To1)
    volOptions = {
      chart: {
        type: 'spline'
      },
      title: {
        text: 'Volatility'
      },
      xAxis: {
        categories: graphData.volTimeSeries,
      },
      series: [
        {
          data: graphData.vol0To1
        }
      ]
    };
    this.setState({
      graphData: graphData,
      priceOptions: priceOptions,
      volOptions: volOptions
    })
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <HighchartsReact highcharts={Highcharts} options={this.state.volOptions} />
        <HighchartsReact highcharts={Highcharts} options={this.state.priceOptions} />
      </div>
    )
  }
}

export default withStyles(styles)(Feeds);
