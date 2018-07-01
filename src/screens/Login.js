import firebase from 'firebase';

import React, { Component } from 'react';
import { Alert, Image, View } from 'react-native';
import { CardSection, UsernameInput,
        Button, Spinner, Background, PasswordInput,
        ButtonNoBackground } from '../components/common';

import LogoImg from '../images/ivanface.png';

// Login form, start page of App
// Interface
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
// ___________________________________________________________________
// ___________________________________________________________________
// GRAPHICAL USER INTERFACE (From here onward)
  render() {
    return (
      <Background>

        {/* Logo */}
        <View style={styles.LogoContainer}>
          <Image
            resizeMode="contain"
            source={LogoImg}
            style={styles.Logo}
          />
        </View>


        {/* Email Input */}
        <CardSection style={{ backgroundColor: 'transparent' }}>
          <UsernameInput
            label='Email'
            placeholder='email@gmail.com'
            onChangeText={text => this.setState({ email: text })}
            value={this.state.email}
          />
        </CardSection>

        {/* Password Input */}
        <CardSection style={{ backgroundColor: 'transparent' }}>
          <PasswordInput
            secureTextEntry
            label='Password'
            placeholder='*********'
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
          />
        </CardSection>

        {/* Login Button */}
        <CardSection style={{ backgroundColor: 'transparent' }}>
          {this.renderButton()}
        </CardSection>


        {/* Create Account Button */}
        <CardSection style={{ backgroundColor: 'transparent' }}>
          <ButtonNoBackground
          onPress={() => this.props.navigation.navigate('CreateAccount')}
          >
            Create account
          </ButtonNoBackground>
        </CardSection>

      </Background>
    );
  }
}

export default Login;

const styles = {
  Logo: {
    width: 120,
    height: 120,
  },
  LogoContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  }
};
