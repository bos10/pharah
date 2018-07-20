import firebase from 'firebase';
import React, { Component } from 'react';
import { Alert, Image, View, Text,
         } from 'react-native';
import { CardSection, UsernameInput, Spinner,
        Background, PasswordInput,
        ButtonNoBackground, DropShadowButton } from '../components/common';
import PushController from '../PushController';
import LogoImg from '../images/Logo5.png';

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
      <DropShadowButton
      onPress={() => this.loginClicked()}
      >
        LOGIN
      </DropShadowButton>
    );
  }

// GUI
  render() {
    return (

      <Background>
        <PushController />
        {/* Logo */}
        <View style={styles.LogoContainer}>
          <Image
            resizeMode="contain"
            source={LogoImg}
            style={styles.Logo}
          />
        </View>


        {/* Email Input */}
        <Text style={styles.InputTitle}> USERNAME </Text>
        <CardSection style={{ backgroundColor: 'transparent', justifyContent: 'center' }}>
          <UsernameInput
            placeholder='email@gmail.com'
            onChangeText={text => this.setState({ email: text })}
            value={this.state.email}
          />
        </CardSection>

        {/* Password Input */}
        <Text style={styles.InputTitle}> PASSWORD </Text>
        <CardSection style={{ backgroundColor: 'transparent', justifyContent: 'center' }}>
          <PasswordInput
            secureTextEntry
            placeholder='*********'
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
          />
        </CardSection>

        {/* Login Button */}
        <CardSection
          style={{ backgroundColor: 'transparent',
                  justifyContent: 'center',
                  paddingTop: 25, }}
        >
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
  },
  InputTitle: {
      paddingTop: 6,
      paddingBottom: 3,
      paddingLeft: 42,
      fontWeight: 'bold',
      color: '#f4f4f4',
      fontSize: 12.5,

  }
};
