import axios from 'axios';
import { computed } from 'mobx';
import config from '../client.config';
import AuthStore from '../stores/AuthStore';


export default {

  @computed get provider() {
    return axios.create({
      baseURL: config.baseURL,
      headers: {
        Authorization: `Token ${AuthStore.token}`,
      },
    });
  },

  request(...args) {
    return this.provider.request(...args);
  },

  get(...args) {
    return this.provider.get(...args);
  },

  post(...args) {
    return this.provider.post(...args);
  },

  put(...args) {
    return this.provider.put(...args);
  },

  patch(...args) {
    return this.provider.patch(...args);
  },

  delete(...args) {
    return this.provider.delete(...args);
  },

  options(...args) {
    return this.provider.options(...args);
  },

  head(...args) {
    return this.provider.head(...args);
  },

};
