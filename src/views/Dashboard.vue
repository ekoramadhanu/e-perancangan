<template>
  <div>
    <v-main>
      <v-container>
        <v-breadcrumbs
          :items="items"
          class="text-capitalize pa-2"
        ></v-breadcrumbs>
        <v-row v-if="role === 'student' || role === 'Head Majors'">
          <v-col cols="12" xl="4" lg="4" md="4" sm="4" xs="4">
            <v-card
              elevation="4"
              color="primaryLight"
              class="rounded-lg"
              v-if="!skeletonTitle"
            >
              <v-card-title class="d-flex justify-space-around mb-3">
                <v-icon size="50" class="mr-2 white--text">$file</v-icon>
                <p class="subtitle-1 ma-0 white--text text-capitalize">
                  {{ countTitle }} judul
                </p>
              </v-card-title>
              <v-card-subtitle class="primary pa-1 d-flex align-center">
                <p
                  class="subtitle-2 white--text text-capitalize ma-0 ml-5 my-1"
                >
                  jumlah judul perancangan mesin
                </p>
              </v-card-subtitle>
            </v-card>
            <v-skeleton-loader
              ref="skeleton"
              type="card"
              v-if="skeletonTitle"
            ></v-skeleton-loader>
          </v-col>
          <v-col cols="12" xl="4" lg="4" md="4" sm="4" xs="4">
            <v-card
              elevation="4"
              color="errorLight"
              class="rounded-lg"
              v-if="!skeletonTitleDecline"
            >
              <v-card-title class="d-flex justify-space-around mb-3">
                <v-icon size="50" class="mr-2 white--text">$file</v-icon>
                <p class="subtitle-1 ma-0 white--text text-capitalize">
                  {{ countTitleDecline }} judul
                </p>
              </v-card-title>
              <v-card-subtitle class="error pa-1 d-flex align-center">
                <p
                  class="subtitle-2 white--text text-capitalize ma-0 ml-5 my-1"
                >
                  jumlah judul tidak diterima
                </p>
              </v-card-subtitle>
            </v-card>
            <v-skeleton-loader
              ref="skeleton"
              type="card"
              v-if="skeletonTitleDecline"
            ></v-skeleton-loader>
          </v-col>
          <v-col cols="12" xl="4" lg="4" md="4" sm="4" xs="4">
            <v-card
              elevation="4"
              color="successLight"
              class="rounded-lg"
              v-if="!skeletonTitleAccept"
            >
              <v-card-title class="d-flex justify-space-around mb-3">
                <v-icon size="50" class="mr-2 white--text">$file</v-icon>
                <p class="subtitle-1 ma-0 white--text text-capitalize">
                  {{ countTitleAccept }} judul
                </p>
              </v-card-title>
              <v-card-subtitle class="success pa-1 d-flex align-center">
                <p
                  class="subtitle-2 white--text text-capitalize ma-0 ml-5 my-1"
                >
                  jumlah judul diterima
                </p>
              </v-card-subtitle>
            </v-card>
            <v-skeleton-loader
              ref="skeleton"
              type="card"
              v-if="skeletonTitleAccept"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="12" xl="4" lg="4" md="4" sm="4" xs="4">
            <v-card
              elevation="4"
              color="primaryLight"
              class="rounded-lg"
              v-if="!skeletonStudent"
            >
              <v-card-title class="d-flex justify-space-around mb-3">
                <v-icon size="50" class="mr-2 white--text">$user</v-icon>
                <p class="subtitle-1 ma-0 white--text text-capitalize">
                  {{ countStudent }} mahasiswa
                </p>
              </v-card-title>
              <v-card-subtitle class="primary pa-1 d-flex align-center">
                <p
                  class="subtitle-2 white--text text-capitalize ma-0 ml-5 my-1"
                >
                  jumlah mahasiswa bimbingan
                </p>
              </v-card-subtitle>
            </v-card>
            <v-skeleton-loader
              ref="skeleton"
              type="card"
              v-if="skeletonStudent"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
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
        text: 'dashboard',
        disabled: true,
      },
    ],
    countTitle: 0,
    countTitleAccept: 0,
    countTitleDecline: 0,
    countStudent: 0,
    skeletonTitle: true,
    skeletonTitleAccept: true,
    skeletonTitleDecline: true,
    skeletonStudent: true,
    role: '',
  }),
  beforeCreate() {
    if (this.$store.state.role === 'student' || this.$store.state.role === 'Head Majors') {
      axios({
        baseURL: `${this.$store.state.domain}file/count/all`,
        method: 'get',
        headers: {
          'x-api-key': this.$store.state.apiKey,
          authorization: `Bearer ${this.$store.state.token}`,
        },
      })
        .then((response) => {
          this.countTitle = response.data.data.total;
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err);
        })
        .finally(() => {
          this.skeletonTitle = false;
        });
      axios({
        baseURL: `${this.$store.state.domain}file/count/accept`,
        method: 'get',
        headers: {
          'x-api-key': this.$store.state.apiKey,
          authorization: `Bearer ${this.$store.state.token}`,
        },
      })
        .then((response) => {
          this.countTitleAccept = response.data.data.total;
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err);
        })
        .finally(() => {
          this.skeletonTitleAccept = false;
        });
      axios({
        baseURL: `${this.$store.state.domain}file/count/decline`,
        method: 'get',
        headers: {
          'x-api-key': this.$store.state.apiKey,
          authorization: `Bearer ${this.$store.state.token}`,
        },
      })
        .then((response) => {
          this.countTitleDecline = response.data.data.total;
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err);
        })
        .finally(() => {
          this.skeletonTitleDecline = false;
        });
    } else if (this.$store.state.role === 'lecturer') {
      axios({
        baseURL: `${this.$store.state.domain}student/lecturer`,
        method: 'get',
        headers: {
          'x-api-key': this.$store.state.apiKey,
          authorization: `Bearer ${this.$store.state.token}`,
        },
      })
        .then((response) => {
          // eslint-disable-next-line no-console
          console.log(response.data);
          this.countStudent = response.data.data.total;
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err);
        })
        .finally(() => {
          this.skeletonStudent = false;
        });
    }
  },
  created() {
    this.role = this.$store.state.role;
  },
};
</script>

<style scoped>
</style>
