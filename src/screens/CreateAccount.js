import React, { Component } from 'react';
import { Alert } from 'react-native';
import firebase from 'firebase';
import { Card, CardSection, Input, Button, Spinner } from '../components/common';

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
        Create!
      </Button>
    );
  }

  render() {
    return (
      <Card>
        <CardSection>
          <Input
            label='NewEmail'
            placeholder='email@gmail.com'
            onChangeText={text => this.setState({ email: text })}
            value={this.state.email}
          />
        </CardSection>

        <CardSection>
          <Input
            secureTextEntry
            label='NewPass'
            placeholder='*********'
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
          />
        </CardSection>

        <CardSection>
          <Input
            label='DisplayName'
            placeholder='Nigga'
            onChangeText={text => this.setState({ displayName: text })}
            value={this.state.displayName}
          />
        </CardSection>

        <CardSection>
          {this.renderButton()}
        </CardSection>

      </Card>
    );
  }
}

export default CreateAccount;
