import React, { Component } from 'react';
import { Text, View } from 'react-native';
import firebase from 'firebase';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { CardSection, RoomButton } from './common';


class FoodListItem extends Component {
  constructor(props) {
    super(props);
    this.totalCost = 0;
    this.state = {
      ordererName: '',
    };
  }

  componentDidMount() {
    // Get displayname of user
    const uid = this.props.item.uid;
    firebase.database().ref(`/users/${uid}/displayName`)
      .once('value')
      .then(snapshot => {
        this.setState({ ordererName: snapshot.val() });
      });
  }

  // renderCreator() {
  //   if (this.props.creatorName === this.state.ordererName) {
  //     return (
  //       <Text style={styles.creatorStyle}> CREATOR </Text>
  //     );
  //   }
  // }
  renderDelete() {
    const uid = firebase.auth().currentUser.uid;
    if (this.props.item.uid === uid) {
      return (
        <RoomButton
          buttonStyle={{ backgroundColor: '#f4f4f4' }}
          onPress={() => this.delete()}
        >
          <AwesomeIcon name='remove' size={20} color='#c0392b' />
        </RoomButton>
      );
    }
  }

  delete() {
    const uid = firebase.auth().currentUser.uid;
    const roomId = this.props.item.roomId;
    // Delete its items
    firebase.database().ref(`lobby/${roomId}/items/${uid}`)
     .remove();
    // Delete from tokens
    firebase.database().ref(`users/${uid}/token`)
     .once('value')
     .then(snapshotToken => {
       const token = snapshotToken.val();
       if (token === null) { return; }
       firebase.database().ref(`lobby/${roomId}/tokenIDs/${token}`)
         .remove();
     });
    // Delete from uids
    firebase.database().ref(`lobby/${roomId}/userIDs/${uid}`)
     .remove();

    // Update the total price
    firebase.database().ref(`lobby/${roomId}/roomTotalPrice`)
      .once('value')
      .then(snapshot => {
        const oldRoomTotalPrice = snapshot.val();
        const newRoomTotalPrice = oldRoomTotalPrice - this.totalCost;
        firebase.database().ref(`lobby/${roomId}/`)
          .update({ roomTotalPrice: newRoomTotalPrice });
      });

    // remove from this user's lobbyHistory
    firebase.database().ref(`users/${uid}/lobbyHistory/${roomId}`)
      .remove();
    // Push the whole room and data to all the user's LobbyHistorys
    firebase.database().ref(`lobby/${roomId}/userIDs`)
      .once('value')
      .then(snapshot4 => {
        const object = snapshot4.val();
        if (object === null) { return; }
        const userIDs = Object.keys(object);
        firebase.database().ref(`lobby/${roomId}/`)
          .once('value')
          .then(snapshot5 => {
            userIDs.forEach(eachuid => {
              firebase.database().ref(`users/${eachuid}/lobbyHistory/${roomId}`)
                .set(snapshot5.val());
            });
          });
      });
  }

  renderOrder() {
    const object = Object.assign({}, this.props.item.order);
    const name = this.state.ordererName;
    let totalCost = 0;
    delete object.uid;
    const list = Object.entries(object).map(([key, value]) => {
      let cost;
      switch (key) {
        case 'prata': cost = 1; totalCost += value * 1; break;
        case 'drink': cost = 0.5; totalCost += value * 0.5; break;
        case 'maggie': cost = 2; totalCost += value * 2; break;
        default: cost = 0;
      }

      return (
          //key={key} to pass warning arry must have unique key
          <Text style={styles.detailStyle} key={key}>
            {key.toUpperCase()}(${cost}) x{value.toString()}
          </Text>
      );
    });
    this.totalCost = totalCost;
    if (this.props.creatorName === this.state.ordererName) {
      return (
        <CardSection style={styles.cardSectionStyle}>
          <View style={{ marginRight: 100 }}>
            {list}
            <Text style={styles.nameStyle}>by {name}(Creator), pay ${totalCost}</Text>
          </View>
          {this.renderDelete()}
        </CardSection>
      );
    } else {
      return (
        <CardSection style={styles.cardSectionStyle}>
          <View style={{ marginRight: 100 }}>
            {list}
            <Text style={styles.nameStyle}>by {name}, pay ${totalCost}</Text>
          </View>
          {this.renderDelete()}
        </CardSection>
      );
    }
  }

  render() {
    return (
        <View>
          {this.renderOrder()}
        </View>
    );
  }
}

const styles = {
  nameStyle: {
    fontSize: 18,
    color: '#f39c12',
    fontFamily: 'NunitoSans-Bold'
  },
  detailStyle: {
    fontSize: 16,
    fontFamily: 'NunitoSans-Bold'
  },
  creatorStyle: {
    fontFamily: 'NunitoSans-Bold'
  },
  cardSectionStyle: {
    padding: 20,
    borderBottomWidth: 1,
  }
};

export default FoodListItem;
