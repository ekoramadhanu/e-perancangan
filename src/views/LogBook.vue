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
          :items="file"
          :search="search"
          no-data-text="Data Tidak Ada"
          no-results-text="Data Tidak Ditemukan"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title class="d-flex">
                <v-icon class="primary--text mr-2">$file</v-icon>
                <p class="ma-0 text-capitalize">log bimbingan</p>
              </v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <div v-if="role === 'student'">
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
                        mengisi log book
                      </span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-form lazy-validation ref="form">
                          <v-menu
                            v-model="menu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="computedDateFormatted"
                                label="Tanggal Bimbingan"
                                prepend-icon="$calendar"
                                :rules="dateRules"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="editedItem.date"
                              @input="menu = false"
                            ></v-date-picker>
                          </v-menu>
                          <v-textarea
                            name="input-7-1"
                            filled
                            label="bimbingan"
                            auto-grow
                            v-model="editedItem.name"
                            :rules="rulesName"
                            prepend-icon="$paper"
                          ></v-textarea>
                        </v-form>
                      </v-container>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        class="text-capitalize"
                        elevation="3"
                        @click="close"
                      >
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
              </div>
            </v-toolbar>
            <v-text-field
              v-model="search"
              label="pencarian data log bimbingan"
              class="mx-4"
            ></v-text-field>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              @click="openDialogDecline(item)"
              class="error--text"
              icon
              v-if="item.status === 'Menunggu'"
            >
              <v-icon> $times </v-icon>
            </v-btn>
            <v-btn
              @click="openDialogAccept(item)"
              class="success--text"
              icon
              v-if="item.status === 'Menunggu'"
            >
              <v-icon> $check </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-container>
      <v-dialog v-model="dialogDecline" persistent max-width="450">
        <v-card>
          <v-card-title class="headline primary white--text text-capitalize">
            menolak bimbingan
          </v-card-title>
          <v-card-text>
            <div class="d-flex justify-start align-center pa-2">
              <v-icon size="80" class="error--text mr-4">$warning</v-icon>
              <p class="ma-0 black--text">
                Apakah anda yakin tidak menolak bimbingan ? Jika "iya" silahkan
                pilih tombol iya
              </p>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              elevation="3"
              class="text-capitalize"
              @click="dialogDecline = false"
            >
              tidak
            </v-btn>
            <v-btn color="primary" @click="saveDecline()">
              <v-progress-circular indeterminate color="white" v-if="loading" />
              <p class="my-auto white--text text-capitalize" v-if="!loading">
                iya
              </p>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogAccept" persistent max-width="450">
        <v-card>
          <v-card-title class="headline primary white--text text-capitalize">
            menyetujui bimbingan
          </v-card-title>
          <v-card-text>
            <div class="d-flex justify-start align-center pa-2">
              <v-icon size="80" class="error--text mr-4">$warning</v-icon>
              <p class="ma-0 black--text">
                Apakah anda yakin menyetujui bimbingan ? Jika "iya" silahkan
                pilih tombol iya
              </p>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              elevation="3"
              class="text-capitalize"
              @click="dialogAccept = false"
            >
              tidak
            </v-btn>
            <v-btn color="primary" @click="saveAccept()">
              <v-progress-circular indeterminate color="white" v-if="loading" />
              <p class="my-auto white--text text-capitalize" v-if="!loading">
                iya
              </p>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
        text: 'daftar judul',
        disabled: true,
      },
    ],
    dialog: false,
    dialogAccept: false,
    dialogDecline: false,
    headers: [],
    menu: false,
    rulesName: [(v) => !!v || 'Nama Bimbingan Tidak Boleh Kosong'],
    dateRules: [(v) => !!v || 'Tanggal Lahir Tidak Boleh Kosong'],
    file: [],
    search: '',
    role: '',
    editedIndex: -1,
    editedItem: {
      date: '',
      name: '',
    },
    defaultItem: {
      date: '',
      name: '',
    },
    loading: false,
    hasSaved: false,
    status: null,
    message: '',
    icon: '',
  }),
  computed: {
    computedDateFormatted() {
      if (this.editedItem.date !== '') {
        const [year, month, day] = this.editedItem.date.split('-');
        return `${day}/${month}/${year}`;
      }
      return '';
    },
  },
  methods: {
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        axios({
          baseURL: `${this.$store.state.domain}log-book/create`,
          method: 'post',
          headers: {
            'x-api-key': this.$store.state.apiKey,
            authorization: `Bearer ${this.$store.state.token}`,
          },
          data: {
            date: this.editedItem.date,
            name: this.editedItem.name,
          },
        })
          .then((response) => {
            if (
              response.data.data.message
              === 'Data Log Book Is Successfully Create'
            ) {
              this.hasSaved = true;
              this.status = true;
              this.message = 'data berhasil disimpan';
              this.icon = '$success';
              let number = null;
              if (this.file.length > 0) {
                number = this.file[this.file.length - 1].number;
              } else {
                number = 0;
              }
              number += 1;
              this.file.push({
                number,
                date: this.computedDateFormatted,
                guidance: this.editedItem.name,
                status: 'Menunggu',
              });
            } else {
              this.hasSaved = true;
              this.status = false;
              this.message = 'data tidak bisa disimpan';
              this.icon = '$warning';
            }
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.log(err);
            this.hasSaved = true;
            this.status = false;
            this.message = 'serve mengalami error';
            this.icon = '$warning';
          })
          .finally(() => {
            this.loading = false;
            this.close();
          });
      }
    },
    openDialogDecline(item) {
      this.editedIndex = this.file.indexOf(item);
      this.dialogDecline = true;
    },
    openDialogAccept(item) {
      this.editedIndex = this.file.indexOf(item);
      this.dialogAccept = true;
    },
    saveAccept() {
      axios({
        baseURL: `${this.$store.state.domain}log-book/accept/${
          this.file[this.editedIndex].id
        }`,
        method: 'patch',
        headers: {
          'x-api-key': this.$store.state.apiKey,
          authorization: `Bearer ${this.$store.state.token}`,
        },
      })
        .then(() => {
          this.file.splice(this.editedIndex, 1, {
            id: this.file[this.editedIndex].id,
            number: this.file[this.editedIndex].number,
            date: this.file[this.editedIndex].date,
            guidance: this.file[this.editedIndex].guidance,
            name: this.file[this.editedIndex].name,
            status: 'Disetujui',
          });
        })
        .catch(() => {
          this.status = false;
          this.message = 'server mengalami error';
        })
        .finally(() => {
          this.loading = false;
          this.dialogAccept = false;
        });
    },
    saveDecline() {
      axios({
        baseURL: `${this.$store.state.domain}log-book/decline/${
          this.file[this.editedIndex].id
        }`,
        method: 'patch',
        headers: {
          'x-api-key': this.$store.state.apiKey,
          authorization: `Bearer ${this.$store.state.token}`,
        },
      })
        .then(() => {
          this.file.splice(this.editedIndex, 1, {
            id: this.file[this.editedIndex].id,
            number: this.file[this.editedIndex].number,
            date: this.file[this.editedIndex].date,
            guidance: this.file[this.editedIndex].guidance,
            name: this.file[this.editedIndex].name,
            status: 'Ditolak',
          });
        })
        .catch(() => {
          this.status = false;
          this.message = 'server mengalami error';
        })
        .finally(() => {
          this.loading = false;
          this.dialogDecline = false;
        });
    },
  },
  created() {
    this.role = this.$store.state.role;
    if (this.$store.state.role === 'lecturer') {
      this.headers.push(
        {
          text: 'Nomor',
          align: 'start',
          sortable: false,
          value: 'number',
        },
        { text: 'Tanggal', value: 'date' },
        { text: 'Bimbingan', value: 'guidance' },
        { text: 'Nama Mahasiswa', value: 'name' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      );
    } else {
      this.headers.push(
        {
          text: 'Nomor',
          align: 'start',
          sortable: false,
          value: 'number',
        },
        { text: 'Tanggal', value: 'date' },
        { text: 'Bimbingan', value: 'guidance' },
        { text: 'Status', value: 'status' },
      );
    }
  },
  beforeCreate() {
    if (this.$store.state.role === 'student') {
      axios({
        baseURL: `${this.$store.state.domain}log-book/student`,
        method: 'get',
        headers: {
          'x-api-key': this.$store.state.apiKey,
          authorization: `Bearer ${this.$store.state.token}`,
        },
      })
        .then((response) => {
          let number = 0;
          let status = '';
          response.data.data.student.forEach((i) => {
            number += 1;
            if (i.status === '0') {
              status = 'Ditolak';
            } else if (i.status === '1') {
              status = 'Menunggu';
            } else {
              status = 'Disetujui';
            }
            this.file.push({
              number,
              date: i.date,
              guidance: i.name,
              status,
            });
          });
        })
        .catch(() => {
          this.status = false;
          this.message = 'server mengalami error';
        })
        .finally(() => {
          this.loading = false;
          this.close();
        });
    } else {
      axios({
        baseURL: `${this.$store.state.domain}log-book/lecture`,
        method: 'get',
        headers: {
          'x-api-key': this.$store.state.apiKey,
          authorization: `Bearer ${this.$store.state.token}`,
        },
      })
        .then((response) => {
          // eslint-disable-next-line no-console
          console.log(response.data);
          let number = 0;
          let status = '';
          response.data.data.student.forEach((i) => {
            number += 1;
            if (i.status === '0') {
              status = 'Ditolak';
            } else if (i.status === '1') {
              status = 'Menunggu';
            } else {
              status = 'Disetujui';
            }
            this.file.push({
              id: i.id,
              number,
              date: i.date,
              guidance: i.name,
              name: i.student,
              status,
            });
          });
        })
        .catch(() => {
          this.status = false;
          this.message = 'server mengalami error';
        })
        .finally(() => {
          this.loading = false;
          this.close();
        });
    }
  },
};
</script>

<style scoped>
</style>
