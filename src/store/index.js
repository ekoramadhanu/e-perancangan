import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: '',
    sidebar: [
      { name: 'judul', icon: '$file', link: '/list-title' },
      { name: 'logbook bimbingan', icon: '$file', link: '/log-book' },
      // { name: 'dosen', icon: '$user', link: '/list-lecturer' },
    ],
    domain: 'http://localhost/api-perancangan/',
    apiKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJrZXkiOiJDem1mWlBzdnRpZU1GenMifQ.DOfLu1KVQWgfqFVVgNYj6lbNjoqV6NuI-50tIfHZld8',
    role: '',
  },
  getters: {
    returnSidebar: (state) => (payload) => {
      let navigation = [];
      if (payload === 'student') {
        navigation = state.sidebar;
      } else if (payload === 'lecturer') {
        navigation.push({
          name: 'logbook bimbingan', icon: '$file', link: '/log-book',
        });
      } else if (payload === 'Head Majors') {
        navigation.push({
          name: 'judul', icon: '$file', link: '/list-title',
        });
        navigation.push({
          name: 'dosen', icon: '$user', link: '/list-lecturer',
        });
      }
      return navigation;
    },
  },
  mutations: {
    changeRole(state, payload) {
      state.role = payload;
    },
    changeToken(state, payload) {
      state.token = payload;
    },
  },
  actions: {
  },
  modules: {
  },
});
