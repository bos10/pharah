import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { CardSection } from './common';


class LobbyMoneyListItem extends Component {
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
      </CardSection>
    );
  }
}

const styles = {
  cardSectionStyle: {
    padding: 20,
    paddingLeft: 40,
    borderBottomWidth: 2,
  },
  displayNameStyle: {
    fontSize: 22,
    fontWeight: '800',
    marginHorizontal: 3,
  },
  normalStyle: {
    fontSize: 22,
    marginHorizontal: 3,
  },
  positiveAmountStyle: {
    fontSize: 22,
    color: 'green',
    fontWeight: '700',
    marginHorizontal: 60,
    marginLeft: 'auto',
  },
  negativeAmountStyle: {
    fontSize: 22,
    color: 'red',
    fontWeight: '700',
    marginHorizontal: 60,
    marginLeft: 'auto',
  },
};

export default LobbyMoneyListItem;
