import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import IpfsRouter from 'ipfs-react-router'
import {
  Switch,
  Route
} from "react-router-dom";

import interestTheme from './theme';
import { colors } from './theme';

import Feeds from './components/feeds';
import Contracts from './components/contracts';
import Header from './components/header';
import Charts from './components/charts';

class App extends Component {
  state = {
  };

  render() {
    return (
      <MuiThemeProvider theme={ createMuiTheme(interestTheme) }>
        <CssBaseline />
        <IpfsRouter>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            alignItems: 'center',
            background: colors.white
          }}>
            <Header />
            <Switch>
              <Route path="/charts/:pair" render={(props) => <Charts {...props} /> } />
              <Route path="/feeds">
                <Feeds />
              </Route>
              <Route path="/contracts">
                <Contracts />
              </Route>
              <Route path="/">
                <Feeds />
              </Route>
            </Switch>
          </div>
        </IpfsRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
