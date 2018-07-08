import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import firebase from 'firebase';
import { Switch } from 'react-native-switch';
import { CardSection } from '../components/common';
import LobbyMoneyListItem from '../components/LobbyMoneyListItem';


class LobbyMoney extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.getMoney();
  }

  getMoney() {
    const currentUid = firebase.auth().currentUser.uid;

    firebase.database().ref(`/users/${currentUid}/moneyStatus/`)
      .on('value', snapshot1 => {
        const moneyObject = snapshot1.val();
        const dataArray = [];
        // Make sure not null
        if (moneyObject === null) {
          this.setState({ data: [] });
          return;
        }
        // Note should change to uid, then display name getting in listitem itself.
        for (const uid in moneyObject) {
          firebase.database().ref(`/users/${uid}/displayName`)
            .once('value')
            .then(snapshot2 => {
              const name = snapshot2.val();
              dataArray.push({
                  displayName: name,
                  amount: moneyObject[uid]
                });
              this.setState({ data: dataArray });
            });
        }
      });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View>
          <FlatList
            ListEmptyComponent={
              <Text style={{ alignSelf: 'center', marginVertical: 15 }}>
                Money Status is empty!
              </Text>
            }
            data={this.state.data}
            renderItem={({ item }) => (
              <LobbyMoneyListItem
                item={item}
              />)}
            keyExtractor={item => item.displayName}
          />
        </View>

      </View>
    );
  }
}

export default LobbyMoney;
