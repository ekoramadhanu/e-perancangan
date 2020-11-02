<template>
  <div>
    <div v-if="foundCodes.type !== ''" class="level">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">{{ foundCodes.type }}</p>
          <p class="title">{{ foundCodes.code }}</p>
        </div>
      </div>
    </div>
    <nav class="level" role="navigation" aria-label="main navigation">
      <div v-show="!scannerActive" class="level-item">
        <a @click="start" class="button">Start Scanner</a>
      </div>

      <div v-show="scannerActive" class="level-item">
        <a @click="stop" class="button">Stop Scanner</a>
      </div>
    </nav>
    <div id="videoWindow" class="video"></div>
    <v-file-input
      accept="image/jpeg,image/png"
      required
      ref="file"
      label="File Abstrak Format PDF (1MB)"
      @change="fileChange"
    ></v-file-input>
    <v-img
      :src="this.priviewImage"
    />
    <v-btn @click="ondecode">
        decode
    </v-btn>
    <!-- <ImageBarcodeReader
      @decode="onDecode"
  ></ImageBarcodeReader> -->
  </div>
</template>

<script>
import Quagga from 'quagga';
// import { ImageBarcodeReader } from 'vue-barcode-reader';

export default {
  data: () => ({
    scannerActive: false,
    foundCodes: {
      code: '',
      type: '',
    },
    file: '',
    priviewImage: '',
  }),
  components: {
    // ImageBarcodeReader,
  },
  methods: {
    start() {
      this.scannerActive = true;
      const config = {
        // locate: true,
        inputStream: {
          name: 'live',
          type: 'LiveStream',
          target: document.querySelector('#videoWindow'),
        //   constraints: {
        //     width: 660,
        //     height: 320,
        //     facingMode: 'user',
        //   },
        },
        decoder: {
          readers: [
            'code_128_reader',
            'code_39_reader',
            'ean_reader',
            'ean_8_reader',
            'code_39_vin_reader',
            'codabar_reader',
            'upc_reader',
            'upc_e_reader',
            'i2of5_reader',
            'code_93_reader',
          ],
          debug: {
            showCanvas: true,
            showPatches: true,
            showFoundPatches: true,
            showSkeleton: true,
            showLabels: true,
            showPatchLabels: true,
            showRemainingPatchLabels: true,
            boxFromPatches: {
              showTransformed: true,
              showTransformedBox: true,
              showBB: true,
            },
          },
          //   multiple: true,
        },
        // locator: {
        //   halfSample: true,
        //   patchSize: 'medium',
        // },
        // area: { // defines rectangle of the detection/localization area
        //   top: '0%', // top offset
        //   right: '0%', // right offset
        //   left: '0%', // left offset
        //   bottom: '0%', // bottom offset
        // },
        // singleChannel: false
      };
      Quagga.init(config, (err) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.log(err);
          return;
        }
        // eslint-disable-next-line no-console
        console.log('initialization complete');
        Quagga.start();
        Quagga.onDetected((result) => {
          // eslint-disable-next-line no-console
          console.log(
            `Barcode detected and processed : [${result.codeResult.code}]`,
            result,
          );
        });
      });
    },
    stop() {
      this.scannerActive = false;
      Quagga.stop();
    },
    fileChange(event) {
      this.file = event;
      if (event == null) {
        this.priviewImage = null;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.priviewImage = e.target.result;
          // eslint-disable-next-line no-console
          console.log(this.priviewImage);
        };
        reader.readAsDataURL(event);
      }
    },
    ondecode() {
      Quagga.decodeSingle({
        decoder: {
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
          ], // List of active readers
        },
        locate: true,
        src: this.priviewImage, // or 'data:image/jpg;base64,' + data
      }, (result) => {
        // eslint-disable-next-line no-console
        // console.log(result);
        if (result.codeResult) {
          // eslint-disable-next-line no-console
          console.log('result', result.codeResult.code);
        } else {
          // eslint-disable-next-line no-console
          console.log('not detected');
        }
      });
    },
    onDecode(result) {
      // eslint-disable-next-line no-console
      console.log(result);
    },
  },
  mounted() {
    //   Quagga.onProcessed((result) => {
    //     const drawingCtx = Quagga.canvas.ctx.overlay;
    //     const drawingCanvas = Quagga.canvas.dom.overlay;

    //     if (result) {
    //       if (result.boxes) {
    //         // eslint-disable-next-line radix
    //         drawingCtx.clearRect(
    //           0,
    //           0,
    //           parseInt(drawingCanvas.getAttribute('width')),
    //           parseInt(drawingCanvas.getAttribute('height')),
    //         );
    //         result.boxes
    //           .filter((box) => box !== result.box)
    //           .forEach((box) => {
    //             Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
    //               color: 'green',
    //               lineWidth: 2,
    //             });
    //           });
    //       }

    //       if (result.box) {
    //         Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
    //           color: '#00F',
    //           lineWidth: 2,
    //         });
    //       }

    //       if (result.codeResult && result.codeResult.code) {
    //         Quagga.ImageDebug.drawPath(
    //           result.line,
    //           { x: 'x', y: 'y' },
    //           drawingCtx,
    //           { color: 'red', lineWidth: 3 },
    //         );
    //       }
    //     }
    //   });
    Quagga.onDetected((result) => {
      // eslint-disable-next-line no-console
      console.log(
        `Barcode detected and processed : [${result.codeResult.code}]`,
        result,
      );
    });
  },
};
</script>

<style>
.video {
  width: 100%;
}
</style>
