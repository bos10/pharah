import React, { Component } from 'react';
import { Alert } from 'react-native';
import firebase from 'firebase';
import { Card, CardSection, InputNoLabel, GradientButton, Button, Spinner, UsernameInput, PasswordInput, Background } from '../components/common';

// Form for new user to create an account with
// Email, password, display name
class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: '',
      email: '',
      password: '',
      displayName: ''
    };
  }

  onButtonPress() {
    this.setState({ loading: true });
    const { email, password } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(data => {
        this.setState({ loading: false });
        this.addProfileData(data.user.uid);
        Alert.alert('Success!');
      })
      .catch(error => {
        this.setState({ loading: false });
        Alert.alert('Ooops', error.toString());
      });
  }

  addProfileData(uid) {
    const { displayName, email } = this.state;
    firebase.database().ref(`users/${uid}`)
      .set({ email, displayName });
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="large" />;
    }
    return (
      <Button onPress={() => this.onButtonPress()}>
        CREATE
      </Button>
    );
  }

// PAGE DESIGN
  render() {
    return (
      <Background>
      <Card style={{ backgroundColor: '#f4f4f4' }}>
        <CardSection style={{ backgroundColor: 'transparent' }}>
          <InputNoLabel
            placeholder='Your email address'
            onChangeText={text => this.setState({ email: text })}
            value={this.state.email}
          />
        </CardSection>

        <CardSection style={{ backgroundColor: 'transparent' }}>
          <InputNoLabel
            secureTextEntry
            placeholder='Input password (>6 characters)'
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
          />
        </CardSection>

        <CardSection style={{ backgroundColor: 'transparent' }}>
          <InputNoLabel
            placeholder='Display name'
            onChangeText={text => this.setState({ displayName: text })}
            value={this.state.displayName}
          />
        </CardSection>

        <CardSection style={{ backgroundColor: 'transparent' }}>
          {this.renderButton()}
        </CardSection>

      </Card>
      </Background>
    );
  }
}

export default CreateAccount;
