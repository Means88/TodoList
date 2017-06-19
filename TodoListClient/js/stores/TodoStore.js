import { ListView } from 'react-native';
import { observable, computed, action } from 'mobx';
import Provider from '../utils/Provider';

const dataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});

class TodoStore {

  @observable todos = [];

  @computed get completedTodos() {
    return Array.prototype.slice.call(this.todos).filter(t => t.completed);
  }

  @computed get incompletedTodos() {
    return Array.prototype.slice.call(this.todos).filter(t => !t.completed);
  }

  @computed get completedDataSource() {
    return dataSource.cloneWithRows(this.completedTodos);
  }

  @computed get incompletedDataSource() {
    return dataSource.cloneWithRows(this.incompletedTodos);
  }

  @action fetchTodos() {
    return Provider.get('/api/todo/').then(action(({ data }) => {
      this.todos = data.map(todo => ({
        ...todo,
        createdAt: new Date(todo.created_at),
        updatedAt: new Date(todo.updated_at),
      }));
    }));
  }

  @action updateTodo(id, { title, content, completed }) {
    return Provider.patch(`/api/todo/${id}/`, {
      title,
      content,
      completed,
    }).then(action(({ data }) => {
      this.todos = Array.prototype.slice.call(this.todos).filter(todo => todo.id !== id);
      this.todos.unshift({
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      });
    }));
  }

  @action addTodo({ title, content }) {
    return Provider.post('/api/todo/', {
      title,
      content,
    }).then(action(({ data }) => {
      this.todos.unshift({
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      });
    }));
  }

  @action deleteTodo(id) {
    return Provider.delete(`/api/todo/${id}/`).then(() => {
      this.todos = Array.prototype.slice.call(this.todos).filter(todo => todo.id !== id);
    });
  }

}

const store = new TodoStore();

export default store;
