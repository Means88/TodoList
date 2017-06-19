import React from 'react';
import { observer } from 'mobx-react';
import { Text, View, StyleSheet, RefreshControl, ListView, Image, TouchableWithoutFeedback } from 'react-native';
import { List, Toast, SegmentedControl } from 'antd-mobile';
import Header from '../components/Header';
import ListItem from '../components/ListItem';
import TodoStore from '../stores/TodoStore';

@observer
export default class IndexScreen extends React.Component {

  static navigationOptions = {
    header: Header({
      title: '我的 TodoList',
      leftButton: props => (
        <TouchableWithoutFeedback
          onPress={() => props.navigation.navigate('setting')}
        >
          <Image
            source={require('../../assets/welcome.jpeg')}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              marginLeft: 7,
              alignSelf: 'center',
            }}
          />
        </TouchableWithoutFeedback>
      ),
      rightButton: (props) => ({
        title: '添加',
        handler: () => {
          props.navigation.navigate('detail');
        },
      }),
    }),
  };

  store = TodoStore;

  state = {
    loading: false,
    showCompleted: false,
  };

  componentWillMount() {
    this.onRefresh();
  }

  onRefresh = () => {
    if (this.state.loading) {
      return;
    }
    this.setState({ loading: true });
    this.store.fetchTodos().catch(() => {
      Toast.fail('加载失败！');
    }).finally(() => {
      this.setState({ loading: false });
    });
  };

  onSegmentChange = (e) => {
    this.setState({ showCompleted: e.nativeEvent.selectedSegmentIndex === 1 });
  };

  token() {
    try {
      return this.props.navigation.state.params.token;
    } catch (e) {
      return "";
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ padding: 5 }}>
          <SegmentedControl
            values={['未完成', '已完成']}
            onChange={this.onSegmentChange}
          />
        </View>
        <List style={styles.container}>
          <ListView
            dataSource={this.state.showCompleted ?
              this.store.completedDataSource :
              this.store.incompletedDataSource
            }
            renderRow={rowData =>
              <ListItem
                id={rowData.id}
                navigation={this.props.navigation}
              >
                {rowData.title}
              </ListItem>
            }
            enableEmptySections
            refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={this.onRefresh}
                colors={['#108ee9']}
              />
            }
          />
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {
    backgroundColor: 'white',
  },
});
