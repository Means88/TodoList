import React from 'react';
import { List } from 'antd-mobile';

export default class ListItem extends React.Component {

  onClick = () => {
    this.props.navigation.navigate('detail', { id: this.props.id });
  };

  render() {
    return (
      <List.Item onClick={this.onClick}>
        {this.props.children}
      </List.Item>
    );
  }
}
