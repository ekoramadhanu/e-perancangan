<template>
  <div>
    <v-main>
      <v-container>
        <v-breadcrumbs
          :items="items"
          class="text-capitalize pa-2"
        ></v-breadcrumbs>
        <v-card elevation="3" class="mt-3 py-2 px-3">
          <v-form lazy-validation ref="form">
            <p class="text-capitalize primary--text">judul</p>
            <TiptapVuetify
              v-model="title"
              :extensions="extensions"
              :card-props="{ height: '300', style: 'overflow: auto;' }"
            />
            <p class="text-capitalize primary--text mt-3">abstrak</p>
            <TiptapVuetify
              v-model="content"
              :extensions="extensions"
              :card-props="{ height: '300', style: 'overflow: auto;' }"
            />
            <v-file-input
              accept="application/pdf"
              required
              :rules="pdfRules"
              ref="file"
              label="File Abstrak Format PDF (1MB)"
              @change="fileChange"
            ></v-file-input>
          </v-form>
          <div class="d-flex justify-end align-baseline">
            <v-btn
              class="ma-2 text-capitalize"
              color="primary"
              @click="upload()"
            >
              <v-progress-circular indeterminate color="white" v-if="loading" />
              <p v-if="!loading" class="text-capitalize my-auto">unggah</p>
            </v-btn>
          </div>
        </v-card>
      </v-container>
    </v-main>
    <v-snackbar
      v-model="hasSaved"
      :timeout="4000"
      top
      right
      color="white"
      max-width="250px"
    >
      <div class="d-flex">
        <v-icon
          :class="status === false ? 'mr-2 error--text' : 'mr-2 success--text'"
          >{{ icon }}</v-icon
        >
        <p class="text-capitalize black--text ma-0 text-subtitle-1">
          {{ message }}
        </p>
      </div>
    </v-snackbar>
  </div>
</template>

<script>
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History,
} from 'tiptap-vuetify';
import axios from 'axios';

export default {
  data: () => ({
    items: [
      {
        text: 'judul',
        disabled: true,
      },
    ],
    // tip tap
    extensions: [
      History,
      Blockquote,
      Link,
      Underline,
      Strike,
      Italic,
      ListItem,
      BulletList,
      OrderedList,
      [
        Heading,
        {
          options: {
            levels: [1, 2, 3],
          },
        },
      ],
      Bold,
      Code,
      HorizontalRule,
      Paragraph,
      HardBreak,
    ],
    // starting editor's content
    content: '<p>Silhakan Isi Abstarksi</p>',
    title: '<p>Silhakan Isi Judul</p>',
    pdfRules: [
      (v) => !!v || 'File PDF Tidak Boleh Kosong',
    ],
    file: '',
    hasSaved: false,
    status: null,
    message: '',
    icon: '',
    loading: false,
  }),
  components: {
    TiptapVuetify,
  },
  methods: {
    upload() {
      if (this.title.length <= 7) {
        this.hasSaved = true;
        this.status = false;
        this.message = 'judul tidak boleh kosong';
        this.icon = '$warning';
      } else if (this.content.length <= 7) {
        this.hasSaved = true;
        this.status = false;
        this.message = 'abstrak tidak boleh kosong';
        this.icon = '$warning';
      } else if (this.$refs.form.validate()) {
        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('title', this.title);
        formData.append('abstract', this.content);
        this.loading = true;
        axios({
          baseURL: `${this.$store.state.domain}file/create`,
          method: 'post',
          headers: {
            'x-api-key': this.$store.state.apiKey,
            authorization: `Bearer ${this.$store.state.token}`,
          },
          data: formData,
        })
          .then((response) => {
            if (response.data.data.message === 'Data File Is Successfully Create') {
              this.hasSaved = true;
              this.status = true;
              this.message = 'data perancangan berhasil di unggah';
              this.icon = '$success';
            } else {
              this.hasSaved = true;
              this.status = false;
              this.message = 'server mengalami error';
              this.icon = '$warning';
            }
          })
          .catch(() => {
            this.hasSaved = true;
            this.status = false;
            this.message = 'server mengalami error';
            this.icon = '$warning';
          })
          .finally(() => {
            this.loading = false;
            this.$router.push('/home');
          });
      }
    },
    fileChange(event) {
      this.file = event;
      // eslint-disable-next-line no-console
      console.log(this.file);
    },
  },
};
</script>

<style scoped>
.tip-tap-size {
  overflow: auto;
  height: 300px;
  max-height: 300px;
}
li {
  margin: 0 ;
}
</style>
