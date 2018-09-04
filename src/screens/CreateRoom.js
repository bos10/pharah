import React, { Component } from 'react';
import { Text, Alert } from 'react-native';
import firebase from 'firebase';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Card, CardSection, Button, InputNoLabel, GradientButton } from '../components/common';

class CreateRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: '',
      roomName: '',
      displayClosingTime: '----',
      ISOClosingTime: '',
      roomStatus: 'open',
      roomTotalPrice: 0,
      isDateTimePickerVisible: false,
    };
  }

  onButtonPress() {
    // Check room status by timing
    if (this.state.roomName === '') {
      Alert.alert('Did not input a room name!');
      return;
    }
    if (this.state.ISOClosingTime === '') {
      Alert.alert('Did not select a time!');
      return;
    }
    const nowDate = new Date();
    const selectedDate = new Date(this.state.ISOClosingTime);
    if (selectedDate < nowDate) {
      Alert.alert('Invalid! Time has passed');
    } else {
      this.createRoom();
    }
  }

  createRoom() {
    // Dabase stuff
    const uid = firebase.auth().currentUser.uid;
    firebase.database().ref(`users/${uid}/displayName/`)
      .once('value')
      .then(snapshot1 => {
        // Get the room creator's name from currentUser
        const creatorName = snapshot1.val();
        const { roomName,
                displayClosingTime,
                ISOClosingTime,
                roomStatus,
                roomTotalPrice } = this.state;
        // Push new room to lobby with the details
        const ref = firebase.database().ref('/lobby')
          .push({ creatorName,
                  creatorId: uid,
                  roomName,
                  displayClosingTime,
                  ISOClosingTime,
                  roomStatus,
                  roomTotalPrice });
        const roomId = ref.getKey();
        // Schedule a notif
        
        // Updating of times array to arrange timing
        // Each slot has timing & roomId
        firebase.database().ref('/lobby/times')
          .once('value')
          .then(snapshot2 => {
            // Retrieve current array of times
            var arr = snapshot2.val();
            if (arr === null) {
              // If null, just add this time
              arr = [{ ISOClosingTime, roomId }];
            } else {
              // Run through array, insert if adding time is smaller
              let i = 0;
              for (i; i < arr.length; i++) {
                const t = arr[i].ISOClosingTime;
                const addingDate = new Date(ISOClosingTime);
                const arrDate = new Date(t);
                if (addingDate < arrDate) {
                  // Insert, since smaller
                  arr.splice(i, 0, { ISOClosingTime, roomId });
                  break;
                }
              }
              if (i === arr.length) {
                // If still not added after break out loop
                // Add to end of array
                arr.push({ ISOClosingTime, roomId });
              }
            }
            // Update the array of times in database
            firebase.database().ref('/lobby')
              .update({ times: arr });
          });
    });

    this.props.navigation.goBack();
  }

  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  handleDatePicked = (date) => {
    // date is in UTC
    // Add 8 hrs coz SG is +8 UTC
    var dateString = date.toString().slice(16, 21);
    dateString = dateString.slice(0, 2) + dateString.slice(3);

    this.setState({
      displayClosingTime: dateString,
      ISOClosingTime: date.toString(),
    });

    this.hideDateTimePicker();
  };

  render() {
    return (
      <Card>

        <CardSection
          style={{ paddingVertical: 5, borderBottomWidth: 3, borderColor: '#ddd' }}
        >
          <InputNoLabel
            placeholder="Room name here"
            value={this.state.roomName}
            onChangeText={text => this.setState({ roomName: text })}
          />
        </CardSection>

        <CardSection
          style={{ flexDirection: 'column', alignItems: 'center', paddingVertical: 50 }}
        >
          <GradientButton
            onPress={this.showDateTimePicker}
            colors={['#F89406', '#ff7c00']}
          >
            PICK TIMING
          </GradientButton>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            mode='datetime'
          />
          <Text style={styles.displayStyle}>
            {this.state.displayClosingTime}H
          </Text>
        </CardSection>

        <CardSection
          style={{ paddingVertical: 5, borderTopWidth: 3, borderColor: '#ddd' }}
        >
          <Button onPress={this.onButtonPress.bind(this)}>
            CREATE
          </Button>
        </CardSection>

      </Card>
    );
  }
}
  const styles = {
    displayStyle: {
      fontSize: 18,
      fontWeight: '300',
      color: '#000',
      marginVertical: 20,
    }
  };


export default CreateRoom;
