// eslint-disable-next-line import/no-extraneous-dependencies
import '@fortawesome/fontawesome-free/css/all.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'fa',
    values: {
      email: 'fas fa-envelope',
      padlock: 'fas fa-lock',
      eye: 'far fa-eye',
      eyeSlash: 'far fa-eye-slash',
      user: 'fas fa-user-tie',
      file: 'fas fa-file-alt',
      logout: 'fas fa-sign-out-alt',
      dashboard: 'mdi-view-dashboard',
      search: 'fas fa-search',
      warning: 'fas fa-exclamation-triangle',
      success: 'fas fa-check-circle',
      calendar: 'far fa-calendar-alt',
      paper: 'fas fa-paper-plane',
      times: 'fas fa-times',
      check: 'fas fa-check',
      details: 'far fa-file-alt',
      download: 'fas fa-file-download',
    },
  },
  theme: {
    themes: {
      light: {
        primary: '#293C75', // blue
        primaryLight: '#42589D', // blue
        error: '#DB2407', // red
        errorLight: '#F72E0F', // red
        success: '#06C619', // green
        successLight: '#01DB17', // green
        warning: '#FCF404', // yellow
      },
    },
  },
});
