import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";
import { colors } from '../../theme'
import { Typography } from '@material-ui/core'

const styles = theme => ({
  root: {
    verticalAlign: 'top',
    width: '100%',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '40px'
    }
  },
  headerV2: {
    background: colors.white,
    borderBottom: '1px solid '+colors.borderBlue,
    width: '100%',
    borderRadius: '0px',
    display: 'flex',
    padding: '24px 32px',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'space-between',
      padding: '16px 24px'
    }
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    cursor: 'pointer'
  },
  links: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  link: {
    padding: '12px 0px',
    margin: '0px 12px',
    cursor: 'pointer',
    '&:hover': {
      paddingBottom: '9px',
      borderBottom: "3px solid "+colors.blue,
    },
  },
  title: {
    textTransform: 'capitalize'
  },
  linkActive: {
    padding: '12px 0px',
    margin: '0px 12px',
    cursor: 'pointer',
    paddingBottom: '9px',
    borderBottom: "3px solid "+colors.blue,
  },
  walletAddress: {
    padding: '12px',
    border: '2px solid rgb(174, 174, 174)',
    borderRadius: '50px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      border: "2px solid "+colors.borderBlue,
      background: 'rgba(47, 128, 237, 0.1)'
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      position: 'absolute',
      top: '90px',
      border: "1px solid "+colors.borderBlue,
      background: colors.white
    }
  },
  name: {
    paddingLeft: '24px',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    }
  },
  accountDetailsSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    [theme.breakpoints.down('sm')]: {
      padding: '6px',
    },
  },
  accountDetailsAddress: {
    color: colors.background,
    fontWeight: 'bold',
    padding: '0px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  accountDetailsBalance: {
    color: colors.background,
    fontWeight: 'bold',
    padding: '0px 12px',
    borderRight: '2px solid '+colors.text,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '0px 6px',
    },
  },
  connectedDot: {
    borderRadius: '100px',
    border: '8px solid '+colors.green,
    marginLeft: '12px'
  },
});

class Header extends Component {

  constructor(props) {
    super()

    this.state = {
    }
  }

  render() {
    const {
      classes
    } = this.props;

    return (
      <div className={ classes.root }>
        <div className={ classes.headerV2 }>
          <div className={ classes.links }>
            { this.renderLink('feeds') }
            { this.renderLink('contracts') }
            { this.renderLink('docs') }
            { this.renderLink('github') }
          </div>
          <div className={ classes.account }>
          </div>
        </div>
      </div>
    )
  }

  renderLink = (screen) => {
    const {
      classes
    } = this.props;

    return (
      <div className={ (window.location.pathname.includes(screen) || (screen ==='feeds' && window.location.pathname==='/')  )?classes.linkActive:classes.link } onClick={ () => { this.nav(screen) } }>
        <Typography variant={'h3'} className={ `title` }>{ screen }</Typography>
      </div>
    )
  }

  nav = (screen) => {
    if(screen === 'docs') {
      window.open("https://docs.uniquote.finance/", "_blank")
      return
    }
    if(screen === 'github') {
      window.open("https://github.com/keep3r-network", "_blank")
      return
    }
    this.props.history.push('/'+screen)
  }
}

export default withRouter(withStyles(styles)(Header));
