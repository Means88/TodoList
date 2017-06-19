import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Button, Modal } from 'antd-mobile';
import Header from '../components/Header';
import AuthStore from '../stores/AuthStore';


export default class SettingScreen extends React.Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    header: Header({
      title: '设置',
      leftButton: {
        title: '返回',
        handler: () => {
          navigation.goBack(null);
        },
      },
    }),
  });

  logout = () => {
    AuthStore.logout().then(() => {
      this.props.navigation.dispatch(NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'login',
          }),
        ],
      }));
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topWrapper}>
          <View style={styles.box}>
            <Image style={styles.image} source={require('../../assets/welcome.jpeg')} />
          </View>
        </View>
        <View style={styles.bottomWrapper}>
          <Button
            type="warning"
            size="large"
            onClick={() => {
              Modal.alert('退出登录', '确定要退出登录吗？', [
                { text: '取消', onPress: () => undefined },
                { text: '确定', onPress: this.logout, style: { color: '#f4333c' }},
              ]);
            }}
          >
            退出登录
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopColor: '#e5e5e5',
    borderTopWidth: 1,
  },
  topWrapper: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  bottomWrapper: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  box: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
  space: {
    flex: 1,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
});
