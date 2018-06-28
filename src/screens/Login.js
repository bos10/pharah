import React, { Component } from 'react';
import { Alert } from 'react-native';
import firebase from 'firebase';
import { Card, CardSection, Input, Button, Spinner } from '../components/common';

// Login form, start page of App
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: '',
      email: '',
      password: ''
    };
  }

  loginClicked() {
    this.setState({ loading: true });
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ loading: false });
        this.props.navigation.navigate('Lobby');
      })
      .catch(error => {
        this.setState({ loading: false });
        Alert.alert('Authentication failed', error.toString());
      });
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="large" />;
    }
    return (
      <Button onPress={() => this.loginClicked()}>
        Login
      </Button>
    );
  }
  render() {
    return (
      <Card>
        <CardSection>
          <Input
            label='Email'
            placeholder='email@gmail.com'
            onChangeText={text => this.setState({ email: text })}
            value={this.state.email}
          />
        </CardSection>

        <CardSection>
          <Input
            secureTextEntry
            label='Password'
            placeholder='*********'
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
          />
        </CardSection>

        <CardSection>
          {this.renderButton()}
        </CardSection>

        <CardSection>
          <Button onPress={() => this.props.navigation.navigate('CreateAccount')}>
            Create account ;)
          </Button>
        </CardSection>

      </Card>
    );
  }
}

export default Login;
