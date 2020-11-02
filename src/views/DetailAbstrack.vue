<template>
  <div>
    <v-main>
      <v-container>
        <v-breadcrumbs
          :items="items"
          class="text-capitalize pa-2"
        ></v-breadcrumbs>
        <v-card elevation="3">
          <v-card-title class="text-capitalize primary white--text pa-3">
            detail data judul
          </v-card-title>
          <v-card-text class="pa-4" v-if="!skeleton">
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td width="500px" class="text-capitalize">tanggal registrasi</td>
                    <td width="30px" class="text-capitalize">:</td>
                    <td class="text-capitalize">{{dateRegister}}</td>
                  </tr>
                  <tr>
                    <td class="text-capitalize">nama mahasiswa</td>
                    <td class="text-capitalize">:</td>
                    <td class="text-capitalize">{{name}}</td>
                  </tr>
                  <tr>
                    <td class="text-capitalize">NIM</td>
                    <td class="text-capitalize">:</td>
                    <td class="text-capitalize">{{nim}}</td>
                  </tr>
                  <tr>
                    <td class="text-capitalize">prodi</td>
                    <td class="text-capitalize">:</td>
                    <td class="text-capitalize">{{majors}}</td>
                  </tr>
                  <tr>
                    <td class="text-capitalize">status</td>
                    <td class="text-capitalize">:</td>
                    <td class="text-capitalize">{{status}}</td>
                  </tr>
                  <tr>
                    <td class="text-capitalize">dosen pembimbing</td>
                    <td class="text-capitalize">:</td>
                    <td class="text-capitalize">{{lecturer}}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div class="my-3">
              <p class="text-capitalize text-subtitle-1 black--text">abstrak</p>
              <div v-html="abstract"></div>
            </div>
            <div class="d-flex justify-end">
              <v-btn @click="pdf()" class="text-capitalize white--text" color="primary">
                <v-icon class="mr-2 white--text" size="15">$download</v-icon>
                unduh pdf
              </v-btn>
            </div>
          </v-card-text>
          <v-skeleton-loader
              ref="skeleton"
              type="card"
              v-if="skeleton"
            ></v-skeleton-loader>
        </v-card>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    items: [
      {
        text: 'judul',
        disabled: false,
        to: '/list-title',
      },
      {
        text: 'nama mahasiswa',
        disabled: true,
      },
    ],
    dateRegister: '',
    name: '',
    nim: '',
    majors: '',
    status: '',
    lecturer: '',
    abstract: '',
    pathPDF: '',
    skeleton: true,
  }),
  methods: {
    pdf() {
      window.open(this.pathPDF);
    },
  },
  beforeCreate() {
    axios({
      baseURL: `${this.$store.state.domain}file/id/${this.$route.params.id}`,
      method: 'get',
      headers: {
        'x-api-key': this.$store.state.apiKey,
        authorization: `Bearer ${this.$store.state.token}`,
      },
    })
      .then((response) => {
        let nameStatus = '';
        if (response.data.data.file[0].status === '1') {
          nameStatus = 'menunggu persetujuan';
        } else if (response.data.data.file[0].status === '0') {
          nameStatus = 'ditolak';
        } else {
          nameStatus = 'diterima';
        }

        if (response.data.data.file[0].student.lecturer === null) {
          this.lecturer = '-';
        } else {
          this.lecturer = response.data.data.file[0].student.lecturer;
        }
        this.dateRegister = response.data.data.file[0].date;
        this.name = response.data.data.file[0].student.name;
        this.items.splice(1, 1, {
          text: response.data.data.file[0].student.name,
          disabled: true,
        });
        this.nim = response.data.data.file[0].student.nim;
        this.majors = response.data.data.file[0].student.major;
        this.status = nameStatus;
        this.abstract = response.data.data.file[0].abstract;
        this.pathPDF = `${this.$store.state.domain}${response.data.data.file[0].filePath}`;
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
      })
      .finally(() => {
        this.skeleton = false;
      });
  },
};
</script>

<style scoped>
</style>
