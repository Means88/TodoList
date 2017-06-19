import { AsyncStorage } from 'react-native';
import { observable, action, computed } from 'mobx';
import axios from 'axios';
import config from '../client.config';

const STORAGE_TOKEN_KEY = '@token';

class AuthStore {

  @observable token = "";

  @computed get isAuthenticated() {
    return !!this.token;
  }

  @action initialToken() {
    return AsyncStorage.getItem(STORAGE_TOKEN_KEY).then(action((token) => {
      if (token === null) {
        return new Promise.reject('not exist');
      }
      this.token = token;
      return token;
    }));
  }

  @action login(username, password) {
    return axios.post(`${config.baseURL}api-token-auth/`, {
      username,
      password,
    }).then(action(({ data }) => {
      this.token = data.token;
      AsyncStorage.setItem(STORAGE_TOKEN_KEY, data.token);
      return data.token;
    }));
  }

  @action logout() {
    this.token = "";
    return AsyncStorage.removeItem(STORAGE_TOKEN_KEY);
  }

}

const store = new AuthStore();
export default store;
