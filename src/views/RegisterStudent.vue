<template>
  <div
    class="fullscreen d-flex justify-center align-center backgorund-repeat"
    :style="{ backgroundImage: `url(${backgroundUrl})` }"
  >
    <div class="pa-2 card-login">
      <v-img
        src="@/assets/logo.svg"
        width="150"
        height="150"
        class="mx-auto"
      ></v-img>
      <p class="text-capitalize text-center text-h6">
        daftar sistem e-perancangan
      </p>
      <v-card elevation="3" class="mt-3 py-3 px-4">
        <p class="text-capitalize text-center text-subtitle-1">
          daftar sebagai mahasiswa
        </p>
        <v-alert
          :type="status === true? 'success' : 'error'"
          v-if="status !== null"
          class=" text-capitalize"
        >
          {{message}}
        </v-alert>
        <v-form lazy-validation ref="form">
          <v-text-field
            v-model="email"
            :rules="emailRules"
            prepend-icon="$email"
            label="Alamat Email"
            required
          />
          <v-text-field
            v-model="name"
            :rules="nameRules"
            prepend-icon="$user"
            label="Nama Mahasiswa"
            required
          />
          <v-text-field
            v-model="nim"
            :rules="nimRules"
            prepend-icon="$user"
            label="NIM Mahasiswa"
            required
          />
          <v-text-field
            v-model="major"
            :rules="majorRules"
            prepend-icon="$user"
            label="Program Studi"
            required
          />
        </v-form>
        <div class="d-flex justify-end">
          <v-btn
            class="ma-2 text-capitalize"
            color="white"
            elevation="3"
            to="/"
          >
            kembali
          </v-btn>
          <v-btn
            class="ma-2 text-capitalize"
            color="primary"
            @click="register()"
          >
            <v-progress-circular indeterminate color="white" v-if="loading" />
            <p v-if="!loading" class="text-capitalize my-auto">daftar</p>
          </v-btn>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import backgroundUrl from '@/assets/background.svg';
import axios from 'axios';

export default {
  data: () => ({
    backgroundUrl,
    email: '',
    emailRules: [
      (v) => !!v || 'Alamat Email Tidak Boleh Kosong',
      (v) => /^\S*$/.test(v) || 'Alamat Email Tidak Boleh Ada Spasi',
      (v) => /.+@.+\..+/.test(v) || 'Alamat Email Tidak Valid',
    ],
    nim: '',
    nimRules: [
      (v) => !!v || 'NIM Tidak Boleh Kosong',
      (v) => /[0-9]/.test(v) || 'NIM Harus Angka (0-9)',
    ],
    name: '',
    nameRules: [
      (v) => !!v || 'Nama Tidak Boleh Kosong',
    ],
    major: '',
    majorRules: [
      (v) => !!v || 'Program Studi Tidak Boleh Kosong',
    ],
    loading: false,
    status: null,
    message: '',
  }),
  methods: {
    changeShowPassword() {
      this.showPassword = !this.showPassword;
    },
    register() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        axios({
          baseURL: `${this.$store.state.domain}student/register`,
          method: 'post',
          headers: {
            'x-api-key': this.$store.state.apiKey,
          },
          data: {
            name: this.name,
            email: this.email,
            major: this.major,
            nim: this.nim,
          },
        })
          .then((response) => {
            if (response.data.data.message === 'Data Student Is Successfully Create') {
              this.status = true;
              this.message = 'pendaftaran berhasil';
              this.$refs.form.reset();
              this.$refs.form.resetValidation();
            } else if (response.data.data.message === 'Email Has Been Used') {
              this.status = false;
              this.message = 'alamat email sudah digunakan';
            } else {
              // eslint-disable-next-line no-console
              console.log(response.data);
              this.status = false;
              this.message = 'tidak bisa melakukan pendaftaran';
            }
          })
          .catch(() => {
            this.status = false;
            this.message = 'server mengalami error';
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
};
</script>

<style scoped>
.fullscreen {
  width: 100vw;
  min-height: 100vh;
}
.card-login {
  max-width: 450px;
  width: 450px;
}
.backgorund-repeat {
  background-position: initial;
  background-repeat: space;
  background-size: 70px 70px;
}
</style>
