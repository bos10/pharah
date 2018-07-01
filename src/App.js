import * as firebase from 'firebase';

import React, { Component } from 'react';
import { RootStack } from './Router';


class App extends Component {
  componentWillMount() {
    const config = {
      apiKey: '***REMOVED***',
      authDomain: '***REMOVED***',
      databaseURL: '***REMOVED***',
      projectId: '***REMOVED***',
      storageBucket: '***REMOVED***.appspot.com',
      messagingSenderId: '***REMOVED***'
    };
    firebase.initializeApp(config);
  }

  render() {
    return (
      <RootStack />
    );
  }
}

export default App;
