import React, { Component } from 'react';
import { Alert, Text } from 'react-native';
import firebase from 'firebase';
import { Card, CardSection, InputNoLabel, Button, Spinner, UsernameInput, PasswordInput, Background } from '../components/common';


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
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
          />
        </CardSection>

        {/*Must validy this shit*/}
        <Text style={styles.label}> Re-enter Password </Text>
        <CardSection style={{ backgroundColor: 'transparent' }}>
          <InputNoLabel
            secureTextEntry
            placeholder='Re-enter password'
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
          />
        </CardSection>

        <Text style={styles.label}> Display Name </Text>
        <CardSection style={{ backgroundColor: 'transparent' }}>
          <InputNoLabel
            placeholder='eg. Ivan 04-14'
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

};
