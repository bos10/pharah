import firebase from 'firebase';

import React, { Component } from 'react';
import { Alert, Image, View,
         } from 'react-native';
import { CardSection, UsernameInput,
        Button, Spinner, Background, PasswordInput,
        ButtonNoBackground, GradientButton } from '../components/common';

import LogoImg from '../images/Logo5.png';
import Dimensions from 'Dimensions';

const deviceHeight = Dimensions.get('window').width;
const deviceWidth = Dimensions.get('window').height;

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
      <GradientButton
      onPress={() => this.loginClicked()}
      >
        LOGIN
      </GradientButton>
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
        <CardSection style={{ backgroundColor: 'transparent', justifyContent: 'center' }}>
          <UsernameInput
            label='Email'
            placeholder='email@gmail.com'
            onChangeText={text => this.setState({ email: text })}
            value={this.state.email}
          />
        </CardSection>

        {/* Password Input */}
        <CardSection style={{ backgroundColor: 'transparent', justifyContent: 'center' }}>
          <PasswordInput
            secureTextEntry
            label='Password'
            placeholder='*********'
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
          />
        </CardSection>

        {/* Login Button */}
        <CardSection style={{ backgroundColor: 'transparent', justifyContent: 'center' }}>
          {this.renderButton()}
        </CardSection>


        {/* Create Account Button */}
        <CardSection style={{ backgroundColor: 'transparent' }}>
          <ButtonNoBackground
          onPress={() => this.props.navigation.navigate('CreateAccount')}
          >
            CREATE ACCOUNT
          </ButtonNoBackground>
        </CardSection>

      </Background>

    );
  }
}

export default Login;

const styles = {
  Logo: {
    width: 250,
    height: 250,
  },
  LogoContainer: {
    flex: 3,
    marginBottom: 20,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  }
};
