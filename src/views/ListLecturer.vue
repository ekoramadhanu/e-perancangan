<template>
  <div>
    <v-main>
      <v-container>
        <v-breadcrumbs
          :items="items"
          class="text-capitalize pa-2"
        ></v-breadcrumbs>
        <v-data-table
          :headers="headers"
          :items="lecturer"
          :search="search"
          v-if="!skeleton"
          no-data-text="Data Tidak Ada"
          no-results-text="Data Tidak Ditemukan"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title class="d-flex">
                <v-icon class="primary--text mr-2">$user</v-icon>
                <p class="ma-0 text-capitalize">daftar dosen</p>
              </v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    tambah
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="primary">
                    <span class="headline text-capitalize white--text">
                      menambah dosen
                    </span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-form lazy-validation ref="form">
                        <v-text-field
                          v-model="editedItem.name"
                          :rules="nameRules"
                          prepend-icon="$user"
                          label="Nama Dosen"
                          required
                        />
                        <v-text-field
                          v-model="editedItem.email"
                          :rules="emailRules"
                          prepend-icon="$email"
                          label="Alamat Email"
                          required
                        />
                      </v-form>
                    </v-container>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="text-capitalize" elevation="3" @click="dialog = false">
                      batal
                    </v-btn>
                    <v-btn
                      color="primary"
                      @click="save"
                      class="text-capitalize"
                    >
                      <v-progress-circular
                        indeterminate
                        color="white"
                        v-if="loading"
                      />
                      <p v-if="!loading" class="text-capitalize my-auto">
                        simpan
                      </p>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
            <v-text-field
              v-model="search"
              label="pencarian data log bimbingan"
              class="mx-4"
            ></v-text-field>
          </template>
        </v-data-table>
        <v-skeleton-loader
          ref="skeleton"
          type="table"
          v-if="skeleton"
        ></v-skeleton-loader>
      </v-container>
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
            :class="
              status === false ? 'mr-2 error--text' : 'mr-2 success--text'
            "
            >{{ icon }}</v-icon
          >
          <p class="text-capitalize black--text ma-0 text-subtitle-1">
            {{ message }}
          </p>
        </div>
      </v-snackbar>
    </v-main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    items: [
      {
        text: 'daftar dosen',
        disabled: true,
      },
    ],
    dialog: false,
    dialogAccept: false,
    dialogDecline: false,
    headers: [
      {
        text: 'Nomor',
        align: 'start',
        sortable: false,
        value: 'number',
      },
      { text: 'Nama', value: 'name' },
      { text: 'Email', value: 'email' },
    ],
    menu: false,
    nameRules: [
      (v) => !!v || 'Nama Tidak Boleh Kosong',
    ],
    emailRules: [
      (v) => !!v || 'Alamat Email Tidak Boleh Kosong',
      (v) => /^\S*$/.test(v) || 'Alamat Email Tidak Boleh Ada Spasi',
      (v) => /.+@.+\..+/.test(v) || 'Alamat Email Tidak Valid',
    ],
    lecturer: [],
    search: '',
    role: '',
    editedIndex: -1,
    editedItem: {
      email: '',
      name: '',
    },
    defaultItem: {
      email: '',
      name: '',
    },
    loading: false,
    hasSaved: false,
    status: null,
    message: '',
    icon: '',
    skeleton: true,
  }),
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        axios({
          baseURL: `${this.$store.state.domain}lecturer/register`,
          method: 'post',
          headers: {
            'x-api-key': this.$store.state.apiKey,
            authorization: `Bearer ${this.$store.state.token}`,
          },
          data: {
            name: this.editedItem.name,
            email: this.editedItem.email,
          },
        })
          .then((response) => {
            if (response.data.data.message === 'Data Lecturer Is Successfully Create') {
              this.hasSaved = true;
              this.status = true;
              this.message = 'data berhasil disimpan';
              this.icon = '$success';
              const number = this.lecturer.length + 1;
              this.lecturer.push({
                number,
                name: this.editedItem.name,
                email: this.editedItem.email,
              });
            } else {
              this.hasSaved = true;
              this.status = false;
              this.message = 'data tidak berhasil disimpan';
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
            this.dialog = false;
          });
      }
    },
  },
  beforeCreate() {
    axios({
      baseURL: `${this.$store.state.domain}lecturer/all`,
      method: 'get',
      headers: {
        'x-api-key': this.$store.state.apiKey,
        authorization: `Bearer ${this.$store.state.token}`,
      },
    })
      .then((response) => {
        let number = 0;
        response.data.data.lecturer.forEach((i) => {
          number += 1;
          this.lecturer.push({
            id: i.id,
            number,
            name: i.name,
            email: i.email,
          });
        });
      })
      .catch(() => {
        this.status = false;
        this.message = 'server mengalami error';
      })
      .finally(() => {
        this.skeleton = false;
      });
  },
};
</script>

<style scoped>
</style>
