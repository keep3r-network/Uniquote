import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
} from '@material-ui/core';
import { colors } from '../../theme'

const styles = theme => ({
  footer: {
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '100%',
    background: colors.white,
    borderRadius: '50px 50px 0px 0px',
    border: '1px solid '+colors.borderBlue,
    borderBottom: 'none',
    marginTop: '48px',
    flexWrap: 'wrap',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'flex-start',
    }
  }
});


class Footer extends Component {

  constructor(props) {
    super()
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.footer}>

      </div>
    )
  }
}

export default withStyles(styles)(Footer);
