import React from 'react';
import { observer } from 'mobx-react';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import { Text, View, StyleSheet, Image } from 'react-native';
import { NavigationActions } from 'react-navigation';
import AuthStore from '../stores/AuthStore';

@observer
class WelcomeScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  componentWillMount() {
    AuthStore.initialToken()
      .then(token => new Promise(resolve => this.setTimeout(() => resolve(token)), 5000))
      .then((token) => {
        this.props.navigation.dispatch(NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'index',
              params: { token },
            }),
          ],
        }));
      })
      .catch(() => {
        this.props.navigation.dispatch(NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'login',
            }),
          ],
        }));
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Image style={styles.image} source={require('../../assets/welcome.jpeg')} />
          <Text style={styles.text}>
            Welcome to <Text style={styles.name}>TodoList</Text>
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  wrapper: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#aaa',
  },
  name: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#333'
  },
});

reactMixin(WelcomeScreen.prototype, TimerMixin);

export default WelcomeScreen;
