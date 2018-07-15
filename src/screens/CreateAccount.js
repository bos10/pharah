import React, { Component } from 'react';
import { Alert, Text } from 'react-native';
import firebase from 'firebase';
import { Card, CardSection, InputNoLabel,
          Button, Spinner, Background } from '../components/common';


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
      displayName: '',
      password2: '',
      ButtonDisabled: true, // only true, when displayname, passwordinput,email input is true
    };
  }


  // If no fil up, button is disabled  (Cant achieve this yet :( )
  // On change state of email && password && password1 && display, then enable
  // What happens after press button
  register() {
    this.setState({ loading: true });   // call spinner
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
        Alert.alert('Oops!', error.toString()); // display error to user
      });
  }

  addProfileData(uid) { // Add data into firebase if successful
    const { displayName, email } = this.state;
    firebase.database().ref(`users/${uid}`)
      .set({ email, displayName });
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="large" />;
    }
    return (
      <Button
        onPress={() => this.onCreateClicked()}
      >
        CREATE
      </Button>
    );
  }

  onCreateClicked() {
    if (this.detailsValid()) {
      this.register();
    }
  }

  detailsValid() {
    return (
      this.confirmPasswordValidation(this.state.password, this.state.password2) &&
      this.displayNameValidation(this.state.displayName)
    );
  }

  displayNameValidation(displayName) {
    if (displayName !== '') {
      return true;
    }
    Alert.alert('Display Name empty!');
  }

  confirmPasswordValidation(newPassword, confirmPassword) {
    if (newPassword === confirmPassword) {
      return true;
    }
    Alert.alert('Passwords did not match!');
  }

  // Got some nested loop problem here, setting state too many times (CHECK)
  checkPasswords() {
   if (this.state.password2 !== this.state.password) {
        return <Text style={styles.textWarning} >Passwords do not match! </Text>;
      }
  }

// PAGE DESIGN
  render() {
    return (
      <Background>
      <Card style={{ backgroundColor: '#f4f4f4' }}>
        <Text style={styles.label}> Email </Text>
        <CardSection style={{ backgroundColor: 'transparent' }}>
          <InputNoLabel
            placeholder='Your email address'
            onChangeText={text => this.setState({ email: text })}
            value={this.state.email}
          />
        </CardSection>

        <Text style={styles.label}> Password </Text>
        <CardSection style={{ backgroundColor: 'transparent' }}>
          <InputNoLabel
            secureTextEntry
            placeholder='Input password (>6 characters)'
            onChangeText={text => this.setState({ password2: text })}
            value={this.state.password2}
          />
        </CardSection>

        <Text style={styles.label}> Re-enter Password </Text>
        <CardSection style={{ backgroundColor: 'transparent' }}>
          <InputNoLabel
            secureTextEntry
            placeholder='Re-enter password'
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
          />
        </CardSection>

        {this.checkPasswords()}

        <Text style={styles.label}> Display Name </Text>
        <CardSection style={{ backgroundColor: 'transparent' }}>
          <InputNoLabel
            placeholder='eg. Ivan C411'
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

const styles = {
  label: {
    paddingTop: 10,
    paddingLeft: 13,
    fontWeight: 'bold',
  },
  textWarning: {
    paddingLeft: 17,
    color: '#FF0000',
  }

};
