import React from 'react';
import { computed } from 'mobx-react';
import { Text, View, StyleSheet, Keyboard } from 'react-native';
import { InputItem, TextareaItem, List, Toast, Button, Checkbox, Modal } from 'antd-mobile';
import { createForm } from 'rc-form';
import Header from '../components/Header';
import TodoStore from '../stores/TodoStore';


class DetailScreen extends React.Component {

  static deleteTodo = (navigation, id) => () => {
    Keyboard.dismiss();
    Toast.loading('加载中...', 0);
    TodoStore.deleteTodo(id).then(() => {
      Toast.hide();
      navigation.goBack(null);
      Toast.success('操作成功', 3);
    }).catch(() => {
      Toast.hide();
      Toast.fail('操作失败', 3);
    });
  };

  static navigationOptions = ({ navigation, screenProps }) => {
    const { id } = navigation.state.params || {};

    let rightButton;
    if (!id) {
      rightButton = null;
    } else {
      rightButton = {
        title: '删除',
        tintColor: '#f4333c',
        handler: () => {
          Modal.alert('删除', '确定要删除吗？', [
            { text: '取消', onPress: () => undefined },
            { text: '确定', onPress: DetailScreen.deleteTodo(navigation, id), style: { color: '#f4333c' }},
          ]);
        },
      };
    }

    return {
      header: Header({
        title: 'Todo',
        leftButton: {
          title: '返回',
          handler: () => {
            navigation.goBack(null);
          },
        },
        rightButton,
      })
    }
  };

  componentDidMount() {
    const data = this.getData();
    if (data) {
      this.props.form.setFieldsValue({
        title: data.title,
        content: data.content,
        completed: data.completed,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { id } = this.props.navigation.state.params || {};
    const { id: nextId } = nextProps.navigation.state.params || {};

    if (id === nextId) {
      return;
    }
    const data = this.getData();
    if (nextId && !data) {
      this.props.form.setFieldsValue({ title: '', content: '', completed: false });
    } else {
      this.props.form.setFieldsValue({
        title: data.title,
        content: data.content,
        completed: data.completed,
      });
    }
  }

  getData() {
    const { id } = this.props.navigation.state.params || {};
    for (const todo of TodoStore.todos) {
      if (todo.id === id) {
        return todo;
      }
    }
    return null;
  }

  commit = () => {
    Keyboard.dismiss();
    Toast.loading('加载中...', 0);
    const { id } = this.props.navigation.state.params || {};
    let request;
    if (id) {
      request = TodoStore.updateTodo(id, this.props.form.getFieldsValue());
    } else {
      request = TodoStore.addTodo(this.props.form.getFieldsValue());
    }
    request.then(() => {
      Toast.hide();
      Toast.success('操作成功', 3);
    }).catch((err) => {
      Toast.hide();
      Toast.fail('操作失败', 3);
    });
  };

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { id } = this.props.navigation.state.params || {};

    return (
      <View style={styles.container}>
        <List renderHeader={() => '标题'}>
          <InputItem
            {...getFieldProps('title', {
              rules: [
                { required: true, message: '请输入标题' },
              ],
            })}
            clear
            error={!!getFieldError('title')}
            placeholder="请输入标题..."
            onErrorClick={() => Toast.info(getFieldError('title'), 3)}
          />
        </List>
        <List renderHeader={() => '内容'}>
          <TextareaItem
            {...getFieldProps('content')}
            style={styles.textarea}
            clear
            error={!!getFieldError('content')}
            placeholder="请输入标题..."
            onErrorClick={() => Toast.info(getFieldError('content'), 3)}
          />
        </List>
        <Checkbox.CheckboxItem
          {...getFieldProps('completed', {
            valuePropName: 'checked',
            getValueFromEvent: e => e.target.checked,
          })}
        >
          已完成
        </Checkbox.CheckboxItem>
        <View style={styles.button}>
          <Button type="primary" onClick={this.commit}>
            保存信息
          </Button>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorWrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  button: {
    padding: 5,
    paddingTop: 10,
  },
  textarea: {
    height: 120,
  },
});

export default createForm()(DetailScreen);
