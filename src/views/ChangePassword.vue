<template>
  <div>
    <v-main>
      <v-container>
        <v-breadcrumbs
          :items="items"
          class="text-capitalize pa-2"
        ></v-breadcrumbs>
        <v-card class="mt-3 py-2 px-4" elevation="3">
          <v-form ref="form" lazy-validation>
            <v-text-field
              prepend-icon="$padlock"
              label="Kata Sandi lama"
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? '$eye' : '$eyeSlash'"
              v-model="password"
              :rules="passwordRules"
              @click:append="changeShowPassword()"
              required
            />
            <v-text-field
              prepend-icon="$padlock"
              label="Kata Sandi Baru"
              :type="showNewPassword ? 'text' : 'password'"
              :append-icon="showNewPassword ? '$eye' : '$eyeSlash'"
              v-model="newPassword"
              :rules="newPasswordRules"
              @click:append="changeShowNewPassword()"
              required
            />
            <v-text-field
              prepend-icon="$padlock"
              label="Ulangi Kata Sandi Baru"
              :type="showRePassword ? 'text' : 'password'"
              :append-icon="showRePassword ? '$eye' : '$eyeSlash'"
              v-model="rePassword"
              :rules="rePasswordRules"
              @click:append="changeShowRePassword()"
              required
            />
          </v-form>
          <div class="d-flex justify-end">
            <v-btn
              color="primary"
              class="text-capitalize"
              @click="change()"
            >
              <v-progress-circular indeterminate color="white" v-if="loading" />
              <p v-if="!loading" class="text-capitalize my-auto">simpan</p>
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
import axios from 'axios';

export default {
  data: () => ({
    items: [
      {
        text: 'dashboard',
        disabled: true,
      },
    ],
    password: '',
    passwordRules: [
      (v) => !!v || 'Kata Sandi Tidak Boleh Kosong',
      (v) => (v.length >= 6 && v.length <= 12) || 'Kata Sandi Harus (6-12)',
    ],
    newPassword: '',
    newPasswordRules: [
      (v) => !!v || 'Kata Sandi Baru Tidak Boleh Kosong',
      (v) => (v.length >= 6 && v.length <= 12) || 'Kata Sandi Baru Harus (6-12)',
    ],
    rePassword: '',
    rePasswordRules: [
      (v) => !!v || 'Ulangi Kata Sandi Tidak Boleh Kosong',
      (v) => (v.length >= 6 && v.length <= 12) || 'Ulangi Kata Sandi Harus (6-12)',
    ],
    showPassword: false,
    showNewPassword: false,
    showRePassword: false,
    loading: false,
    hasSaved: false,
    status: null,
    message: '',
    icon: '',
  }),
  methods: {
    changeShowPassword() {
      this.showPassword = !this.showPassword;
    },
    changeShowNewPassword() {
      this.showNewPassword = !this.showNewPassword;
    },
    changeShowRePassword() {
      this.showRePassword = !this.showRePassword;
    },
    change() {
      if (this.$refs.form.validate()) {
        if (this.rePassword !== this.newPassword) {
          this.hasSaved = true;
          this.status = false;
          this.message = 'kata sandi baru dan ulangi kata sandi tidak sama';
          this.icon = '$warning';
        } else {
          let endpoint = '';
          if (this.$store.state.role === 'student') {
            endpoint = `${this.$store.state.domain}student/change-password`;
          } else if (this.$store.state.role === 'lecturer') {
            endpoint = `${this.$store.state.domain}lecturer/change-password`;
          } else {
            endpoint = `${this.$store.state.domain}head-major/change-password`;
          }
          axios({
            baseURL: endpoint,
            method: 'patch',
            headers: {
              'x-api-key': this.$store.state.apiKey,
              authorization: `Bearer ${this.$store.state.token}`,
            },
            data: {
              oldPassword: this.password,
              newPassword: this.newPassword,
            },
          })
            .then((response) => {
              if (response.data.data.message === 'Password Not Match') {
                this.hasSaved = true;
                this.status = false;
                this.message = 'kata sandi lama anda salah';
                this.icon = '$warning';
              } else {
                this.hasSaved = true;
                this.status = true;
                this.message = 'kata sandi baru berhasil disimpan';
                this.icon = '$success';
              }
            })
            .catch(() => {
              this.hasSaved = true;
              this.status = false;
              this.message = 'sistem mengalami error';
              this.icon = '$warning';
            })
            .finally(() => {
              this.loading = false;
            });
        }
      }
    },
  },
};
</script>

<style scoped>
</style>
