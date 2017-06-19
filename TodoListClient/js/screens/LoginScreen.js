import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import { List, InputItem, Toast, Button, ActivityIndicator } from 'antd-mobile';
import { createForm } from 'rc-form';
import _ from 'lodash';
import Header from '../components/Header';
import AuthStore from '../stores/AuthStore';

class LoginScreen extends React.Component {

  static navigationOptions = {
    header: Header({
      title: '登录到 TodoList',
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  validateUsername = (rule, value, cb) => {
    if (value && value.length > 4) {
      cb();
      return;
    }
    cb(new Error('请输入5位以上的字符'));
  };

  onPressLogin = () => {
    this.setState({
      loading: true,
    });

    const { username, password } = this.props.form.getFieldsValue();

    AuthStore.login(username, password).then((token) => {
      this.props.navigation.dispatch(NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'index',
            params: { token },
          }),
        ],
      }));
    }).catch((error) => {
      let message;
      if (typeof error.response !== 'undefined' && typeof error.response.data === 'object') {
        message = (_.toPairs(error.response.data)[0] || []).filter(r => r !== 'non_field_errors').join(', ');
      } else {
        message = error.message;
      }
      Toast.info(message, 2);
      this.setState({ loading: false });
    });
  };

  render() {
    const { getFieldProps, getFieldError } = this.props.form;

    return (
      <View style={styles.container}>
        <List>
          <InputItem
            {...getFieldProps('username', {
              rules: [
                { required: true, message: '请输入账号' },
                { validator: this.validateUsername },
              ],
            })}
            placeholder="eg. means88"
            style={styles.input}
            clear
            error={!!getFieldError('username')}
            onErrorClick={() => Toast.info(getFieldError('username'), 3)}
          >
            账号
          </InputItem>
          <InputItem
            {...getFieldProps('password', {
              rules: [
                { required: true, message: '请输入密码' },
              ],
            })}
            style={styles.input}
            error={!!getFieldError('password')}
            onErrorClick={() => Toast.info(getFieldError('password'), 3)}
            type="password"
          >
            密码
          </InputItem>
        </List>
        <View style={styles.button}>
          {(() => {
            if (!this.state.loading) {
              return (
                <Button
                  size="large"
                  type="primary"
                  disabled={this.state.loading}
                  onClick={this.onPressLogin}
                >
                  登录
                </Button>
              );
            }
            return <ActivityIndicator animating color="#108ee9" size="large" />;
          })()}

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  input: {
    paddingTop: 7,
    alignItems: 'center',
  },
  button: {
    padding: 5,
    paddingTop: 10,
  },
});

reactMixin(LoginScreen.prototype, TimerMixin);

export default createForm()(LoginScreen);
