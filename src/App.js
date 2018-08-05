import * as firebase from 'firebase';
import React, { Component } from 'react';
import { RootStack } from './Router';
import config from './config.js';


class App extends Component {
  componentWillMount() {
    firebase.initializeApp(config);
  }

  render() {
    return (
      <RootStack />
    );
  }
}

export default App;
