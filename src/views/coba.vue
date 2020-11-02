<template>
  <div>
    <v-quagga :onDetected="logIt" :readerSize="readerSize" :readerTypes="readers"></v-quagga>
  </div>
</template>

<script>
import Vue from 'vue';
import VueQuagga from 'vue-quaggajs';

// register component 'v-quagga'
Vue.use(VueQuagga);

export default {
  name: 'VueBarcodeTest',
  data() {
    return {
      readerSize: {
        width: 640,
        height: 480,
      },
      detecteds: [],
      readers: [
        'code_128_reader',
        'ean_reader',
        'ean_8_reader',
        'code_39_reader',
        'code_39_vin_reader',
        'codabar_reader',
        'upc_reader',
        'upc_e_reader',
        'i2of5_reader',
      ],
    };
  },
  methods: {
    logIt(data) {
      // eslint-disable-next-line no-console
      console.log('detected', data);
    },

  },
};
</script>
