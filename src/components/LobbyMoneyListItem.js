import React, { Component } from 'react';
import { Text, Alert } from 'react-native';
import firebase from 'firebase';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CardSection, RoomButton } from './common';

class LobbyMoneyListItem extends Component {
  clearMoney() {
    Alert.alert('Cleared!');
    const uid = firebase.auth().currentUser.uid;
    const otherId = this.props.item.otherId;

    // Go uid and other ID room to clear all otherId and uid as PAID
    firebase.database().ref(`/users/${uid}/lobbyHistory`)
      .once('value')
      .then(lobbyHistorySnap => {
        if (lobbyHistorySnap.val() === null) { return; }
        const lobbyHistory = lobbyHistorySnap.val();
        for (const roomId in lobbyHistory) {
          firebase.database().ref(`/users/${uid}/lobbyHistory/${roomId}/items/${otherId}`)
            .once('value')
            .then(snap1 => {
              if (snap1.val() !== null) {
                firebase.database().ref(`/users/${uid}/lobbyHistory/${roomId}/items/${otherId}`)
                  .update({ paid: 1 });
                firebase.database().ref(`/users/${otherId}/lobbyHistory/${roomId}/items/${uid}`)
                  .update({ paid: 1 });
                firebase.database().ref(`/users/${uid}/lobbyHistory/${roomId}/items/${uid}`)
                  .update({ paid: 1 });
                firebase.database().ref(`/users/${otherId}/lobbyHistory/${roomId}/items/${otherId}`)
                  .update({ paid: 1 });
              }
            });
        }
      });
    // clear money statuses
    firebase.database().ref(`/users/${uid}/moneyStatus/${otherId}`)
      .remove();
    firebase.database().ref(`/users/${otherId}/moneyStatus/${uid}`)
      .remove();
  }

  render() {
    const { displayName, amount } = this.props.item;
    if (amount > 0) {
      return (
        <CardSection style={styles.cardSectionStyle}>
          <Text style={styles.displayNameStyle}>
            {displayName}
          </Text>
          <Text style={styles.normalStyle}>
            owes you
          </Text>
          <Text style={styles.positiveAmountStyle}>
            ${amount}
          </Text>
          <RoomButton
            buttonStyle={{ backgroundColor: '#f4f4f4' }}
            textStyle={{ color: 'black' }}
            onPress={() => this.clearMoney()}
          >
            <MaterialIcons name='money-off' size={20} color='black' />
            {'\n'}
            CLR
          </RoomButton>
        </CardSection>
      );
    }
    // else
    return (
      <CardSection style={styles.cardSectionStyle}>
        <Text style={styles.normalStyle}>
          You owe
        </Text>
        <Text style={styles.displayNameStyle}>
          {displayName}
        </Text>
        <Text style={styles.negativeAmountStyle}>
          ${-amount}
        </Text>
        <RoomButton
          buttonStyle={{ backgroundColor: '#f4f4f4' }}
          textStyle={{ color: 'black' }}
          onPress={() => this.clearMoney()}
        >
          <MaterialIcons name='money-off' size={20} color='black' />
          {'\n'}
          CLR
        </RoomButton>
      </CardSection>
    );
  }
}

const styles = {
  cardSectionStyle: {
    paddingLeft: 20,
    borderBottomWidth: 2,
    borderColor: '#fff',
    borderRadius: 4,
    alignItems: 'center'
  },
  displayNameStyle: {
    fontSize: 22,
    fontWeight: '800',
    marginHorizontal: 3,
    marginVertical: 10
  },
  normalStyle: {
    fontSize: 22,
    marginHorizontal: 3,
    marginVertical: 10
  },
  positiveAmountStyle: {
    fontSize: 22,
    color: 'green',
    fontWeight: '700',
    marginHorizontal: 60,
    marginLeft: 'auto',
    marginVertical: 10
  },
  negativeAmountStyle: {
    fontSize: 22,
    color: 'red',
    fontWeight: '700',
    marginHorizontal: 60,
    marginLeft: 'auto',
    marginVertical: 10
  },
};

export default LobbyMoneyListItem;
