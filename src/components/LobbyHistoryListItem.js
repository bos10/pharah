import React, { Component } from 'react';
import firebase from 'firebase';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { CardSection } from './common';


class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = { roomStatus: '' };
    setInterval(() => this.update(), 1000);
  }

  update() {
    const { roomId } = this.props.item;
    const uid = firebase.auth().currentUser.uid;

    firebase.database().ref(`/users/${uid}/lobbyHistory/${roomId}/roomStatus`)
      .once('value')
      .then(snapshot => {
        this.setState({ roomStatus: snapshot.val() });
      });
  }

  render() {
    const { roomName, creatorName, displayClosingTime } = this.props.item;
    let roomColor;
    if (this.state.roomStatus === 'pending') {
      roomColor = '#FAA945';
    } else if (this.state.roomStatus === 'closed') {
      roomColor = '#F03434';
    } else if (this.state.roomStatus === 'open') {
      roomColor = '#26A65B';
    } else {
      roomColor = 'white';
    }


    return (
      <TouchableWithoutFeedback
        onPress={() => this.props.navigation.navigate('RoomHistory', this.props.item)}
      >
        <View>
          <CardSection
            style={{
              padding: 20,
              borderBottomWidth: 2,
              backgroundColor: roomColor
            }}
          >
            <Text style={styles.roomNameStyle}>
              {roomName}
            </Text>

            <Text style={styles.displayClosingTimeStyle}>
              [{displayClosingTime}]
            </Text>

            <Text style={styles.creatorNameStyle}>
              by {creatorName}
            </Text>
          </CardSection>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = {
  roomNameStyle: {
    fontSize: 18,
    paddingLeft: 25,
  },
  displayClosingTimeStyle: {
    fontSize: 18,
    paddingLeft: 5,
    color: 'white',
  },
  creatorNameStyle: {
    fontSize: 11,
    paddingLeft: 5,
    alignSelf: 'flex-end',
  },
  cardSectionStyle: {
    padding: 20,
    borderBottomWidth: 2,
  }
};

export default ListItem;
