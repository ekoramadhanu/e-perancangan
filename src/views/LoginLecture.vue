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
        masuk sistem e-perancangan
      </p>
      <v-card elevation="3" class="mt-3 py-3 px-4">
        <p class="text-capitalize text-center text-subtitle-1">
          masuk sebagai dosen pembimbing
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
            v-model="password"
            :rules="passwordRules"
            :type="showPassword ? 'text' : 'password'"
            prepend-icon="$padlock"
            :append-icon="showPassword ? '$eye' : '$eyeSlash'"
            label="Kata Sandi"
            @click:append="changeShowPassword()"
            required
          />
        </v-form>
        <div class="d-flex justify-end">
          <v-btn
            class="ma-2 text-capitalize"
            color="white"
            elevation="3"
          >
            daftar
          </v-btn>
          <v-btn
            class="ma-2 text-capitalize"
            color="primary"
            @click="login()"
          >
            <v-progress-circular indeterminate color="white" v-if="loading" />
            <p v-if="!loading" class="text-capitalize my-auto">masuk</p>
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
    password: '',
    passwordRules: [
      (v) => !!v || 'Kata Sandi Tidak Boleh Kosong',
      (v) => (v.length >= 6 && v.length <= 12) || 'Kata Sandi Harus (6-12)',
    ],
    showPassword: false,
    loading: false,
    status: null,
    message: '',
  }),
  methods: {
    changeShowPassword() {
      this.showPassword = !this.showPassword;
    },
    login() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        axios({
          baseURL: `${this.$store.state.domain}lecturer/login`,
          method: 'post',
          headers: {
            'x-api-key': this.$store.state.apiKey,
          },
          data: {
            email: this.email,
            password: this.password,
          },
        })
          .then((response) => {
            // eslint-disable-next-line no-console
            console.log(response.data);
            if (response.data.data.message === 'Data Not Found') {
              this.status = false;
              this.message = 'silhakan registrasi terlebih dahulu';
              this.loading = false;
            } else if (response.data.data.message === 'Password not Match') {
              this.status = false;
              this.message = 'kata sandi anda salah';
              this.loading = false;
            } else if (response.data.data.token !== undefined) {
              this.$store.commit('changeToken', response.data.data.token);
              this.$store.commit('changeRole', 'lecturer');
              this.$cookies.set('token', response.data.data.token, '1d');
              this.$router.push('/home');
            } else {
              // eslint-disable-next-line no-console
              console.log(response.data);
              this.status = false;
              this.message = 'tidak bisa  masuk sistem';
              this.loading = false;
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
  height: 100vh;
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
