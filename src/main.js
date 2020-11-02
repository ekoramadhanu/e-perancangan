import Vue from 'vue';
import VueBarcodeScanner from 'vue-barcode-scanner';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
// eslint-disable-next-line import/order
import VueCookies from 'vue-cookies';
import 'vuetify/dist/vuetify.min.css';
// import plugin
// eslint-disable-next-line import/order
import { TiptapVuetifyPlugin } from 'tiptap-vuetify';
// don't forget to import CSS styles
import 'tiptap-vuetify/dist/main.css';

const options = {
  sound: true, // default is false
  soundSrc: '/static/sound.wav', // default is blank
  sensitivity: 300, // default is 100
  requiredAttr: true, // default is false
  controlSequenceKeys: ['NumLock', 'Clear'], // default is null
  callbackAfterTimeout: true, // default is false
};
Vue.config.productionTip = false;
Vue.use(VueCookies);
Vue.use(VueBarcodeScanner, options);
Vue.use(TiptapVuetifyPlugin, {
  // the next line is important! You need to provide the Vuetify Object to this place.
  vuetify, // same as "vuetify: vuetify"
  // optional, default to 'md' (default vuetify icons before v2.0.0)
  iconsGroup: 'fa',
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
