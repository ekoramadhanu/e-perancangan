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
          v-if="!skeletonTable"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title class="d-flex">
                <v-icon class="primary--text mr-2">$file</v-icon>
                <p class="ma-0 text-capitalize primary--text">
                  judul rancangan sistem
                </p>
              </v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-text-field
              v-model="search"
              label="pencarian data judul"
              class="mx-4"
            ></v-text-field>
          </template>
          <template v-slot:item.title="{ item }">
            <div v-html="item.title"></div>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              :to="`/detail-abstract/${item.id}`"
              class="primary--text"
              icon
            >
              <v-icon> $details </v-icon>
            </v-btn>
            <v-btn
              @click="openDialogDecline(item)"
              class="error--text"
              icon
              v-if="item.status === 'Menunggu Persetujuan'"
            >
              <v-icon> $times </v-icon>
            </v-btn>
            <v-btn
              @click="openDialogAccept(item)"
              class="success--text"
              icon
              v-if="item.status === 'Menunggu Persetujuan'"
            >
              <v-icon> $check </v-icon>
            </v-btn>
          </template>
        </v-data-table>
        <v-skeleton-loader
          ref="skeleton"
          type="table"
          v-if="skeletonTable"
        ></v-skeleton-loader>
      </v-container>
    </v-main>
    <v-dialog v-model="dialogDecline" persistent max-width="450">
      <v-card>
        <v-card-title class="headline primary white--text text-capitalize">
          menolak judul
        </v-card-title>
        <v-card-text>
          <v-form lazy-validation ref="form">
            <v-textarea
              name="input-7-1"
              filled
              label="Label"
              auto-grow
              v-model="note"
              :rules="noteRules"
              prepend-icon="$paper"
              required
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn elevation="3" class="text-capitalize" @click="closeDecline">
            tidak
          </v-btn>
          <v-btn color="primary" @click="saveDecline">
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
          menyetujui judul
        </v-card-title>
        <v-card-text>
          <v-form lazy-validation ref="form">
            <v-select
              v-model="lecture"
              :items="list"
              item-text="name"
              item-value="id"
              :rules="lectureRules"
              label="pilih dosen pembimbing"
              prepend-icon="$user"
              single-line
            ></v-select>
            <v-textarea
              name="input-7-1"
              filled
              label="Catatan"
              auto-grow
              v-model="note"
              :rules="noteRules"
              prepend-icon="$paper"
              required
              persistent-hint
              hint="Jika Tidak Ada Silahkan Isi -"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn elevation="3" class="text-capitalize" @click="closeAccept()">
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
        text: 'judul',
        disabled: true,
      },
    ],
    lecture: '',
    lectureRules: [(v) => !!v || 'Dosen Tidak Boleh Kosong Tidak Boleh Kosong'],
    dialogAccept: false,
    dialogDecline: false,
    editedIndex: -1,
    headers: [],
    role: '',
    file: [],
    search: '',
    skeletonTable: true,
    note: '',
    noteRules: [(v) => !!v || 'Catatan Tidak Boleh Kosong Tidak Boleh Kosong'],
    loading: false,
    hasSaved: false,
    status: null,
    message: '',
    icon: '',
    list: [],
  }),
  methods: {
    closeDecline() {
      this.dialogDecline = false;
      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    saveDecline() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        axios({
          baseURL: `${this.$store.state.domain}file/decline/${
            this.file[this.editedIndex].id
          }`,
          method: 'patch',
          headers: {
            'x-api-key': this.$store.state.apiKey,
            authorization: `Bearer ${this.$cookies.get('token')}`,
          },
          data: {
            note: this.note,
          },
        })
          .then((response) => {
            if (
              response.data.data.message === 'Data File Is Successfully Decline'
            ) {
              this.hasSaved = true;
              this.status = true;
              this.message = 'judul berhasil ditolak';
              this.icon = '$success';
              this.file.splice(this.editedIndex, 1, {
                id: this.file[this.editedIndex].id,
                number: this.file[this.editedIndex].number,
                title: this.file[this.editedIndex].title,
                student: this.file[this.editedIndex].student,
                status: 'Ditolak',
                note: this.note,
              });
            } else {
              this.hasSaved = true;
              this.status = false;
              this.message = 'data tidak berhasil diubah';
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
            this.closeDecline();
          });
      }
    },
    openDialogDecline(item) {
      this.editedIndex = this.file.indexOf(item);
      this.dialogDecline = true;
    },
    closeAccept() {
      this.dialogAccept = false;
      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    saveAccept() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        axios({
          baseURL: `${this.$store.state.domain}file/accept/${
            this.file[this.editedIndex].id
          }`,
          method: 'patch',
          headers: {
            'x-api-key': this.$store.state.apiKey,
            authorization: `Bearer ${this.$cookies.get('token')}`,
          },
          data: {
            lecture: this.lecture,
            note: this.note,
          },
        })
          .then((response) => {
            if (
              response.data.data.message === 'Data File Is Successfully Accept'
            ) {
              this.hasSaved = true;
              this.status = true;
              this.message = 'judul berhasil disetujui';
              this.icon = '$success';
              this.file.splice(this.editedIndex, 1, {
                id: this.file[this.editedIndex].id,
                number: this.file[this.editedIndex].number,
                title: this.file[this.editedIndex].title,
                student: this.file[this.editedIndex].student,
                status: 'Disetujui',
                note: this.note,
              });
            } else {
              this.hasSaved = true;
              this.status = false;
              this.message = 'data tidak berhasil diubah';
              this.icon = '$warning';
            }
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
          })
          .finally(() => {
            this.loading = false;
            this.closeAccept();
          });
      }
    },
    openDialogAccept(item) {
      this.editedIndex = this.file.indexOf(item);
      this.dialogAccept = true;
    },
  },
  beforeCreate() {
    axios({
      baseURL: `${this.$store.state.domain}file/all`,
      method: 'get',
      headers: {
        'x-api-key': this.$store.state.apiKey,
        authorization: `Bearer ${this.$store.state.token}`,
      },
    })
      .then((response) => {
        if (response.data.data.file.length > 0) {
          let number = 0;
          let status = '';
          let note = null;
          response.data.data.file.forEach((i) => {
            number += 1;
            if (i.status === '0') {
              status = 'Ditolak';
            } else if (i.status === '1') {
              status = 'Menunggu Persetujuan';
            } else if (i.status === '2') {
              status = 'Disetujui';
            }
            if (i.note === null) {
              note = '-';
            } else {
              note = i.note;
            }

            this.file.push({
              id: i.id,
              number,
              title: i.title,
              student: i.student.name,
              status,
              note,
            });
          });
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
      })
      .finally(() => {
        this.skeletonTable = false;
      });
    if (this.$store.state.role === 'Head Majors') {
      axios({
        baseURL: `${this.$store.state.domain}lecturer/all`,
        method: 'get',
        headers: {
          'x-api-key': this.$store.state.apiKey,
          authorization: `Bearer ${this.$store.state.token}`,
        },
      })
        .then((response) => {
          response.data.data.lecturer.forEach((i) => {
            this.list.push({
              id: i.id,
              name: i.name,
            });
          });
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err);
        });
    }
  },
  created() {
    this.role = this.$store.state.role;
    if (this.role === 'student') {
      this.headers.push(
        {
          text: 'Nomor',
          align: 'start',
          sortable: false,
          value: 'number',
        },
        { text: 'Judul', value: 'title' },
        { text: 'Mahasiswa', value: 'student' },
        { text: 'Status', value: 'status' },
        { text: 'Catatan', value: 'note' },
      );
    } else {
      this.headers.push(
        {
          text: 'Nomor',
          align: 'start',
          sortable: false,
          value: 'number',
        },
        { text: 'Judul', value: 'title' },
        { text: 'Mahasiswa', value: 'student' },
        { text: 'Status', value: 'status' },
        { text: 'Catatan', value: 'note' },
        { text: 'Actions', value: 'actions', sortable: false },
      );
    }
  },
};
</script>

<style scoped>
div >>> p {
  margin: 0px;
}
</style>
