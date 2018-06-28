import React, { Component } from 'react';
import * as firebase from 'firebase';
import { RootStack } from './Router';

class App extends Component {
  componentWillMount() {
    const config = {
      apiKey: 'AIzaSyDLQMBYpy-DvqWABOt66ApDzUD34AuM3G8',
      authDomain: 'jiov2-4dd57.firebaseapp.com',
      databaseURL: 'https://jiov2-4dd57.firebaseio.com',
      projectId: 'jiov2-4dd57',
      storageBucket: 'jiov2-4dd57.appspot.com',
      messagingSenderId: '575706797643'
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
