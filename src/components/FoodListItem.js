import React, { Component } from 'react';
import { Text, View, Alert } from 'react-native';
import firebase from 'firebase';
import { CardSection } from './common';


class FoodListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ordererName: ''
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

  onButtonPress() {
    Alert.alert('gi');
  }

  renderCreator() {
    if (this.props.creatorName === this.state.ordererName) {
      return (
        <Text> CREATOR </Text>
      );
    }
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
            {key}(${cost}) x{value.toString()}
          </Text>
      );
    });

    return (
      <CardSection style={styles.cardSectionStyle}>
        <View style={{ marginRight: 100 }}>
          {list}
          <Text style={styles.nameStyle}>by {name}, pay ${totalCost}</Text>
        </View>
        {this.renderCreator()}

      </CardSection>
    );
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
    color: '#ef4836',
  },
  detailStyle: {
    fontSize: 18,
  },
  cardSectionStyle: {
    padding: 20,
    borderBottomWidth: 2,
  }
};

export default FoodListItem;
