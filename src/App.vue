<template>
  <v-app>
    <!-- <navbar v-if="!loadData && checkLogin"/> -->
    <router-view/>
    <!-- v-if="!loadData" -->
    <!-- <footerApp v-if="!loadData && checkLogin"/> -->
  </v-app>
</template>

<script>
// import navbar from '@/components/Navbar.vue';
// import footerApp from '@/components/Footer.vue';
// import axios from 'axios';

// export default {
//   data: () => ({
//     currentURL: '',
//     checkLogin: null,
//     loadData: true,
//   }),
//   components: {
//     navbar,
//     footerApp,
//   },
//   beforeCreate() {
//     if (this.$cookies.isKey('token')) {
//       axios({
//         baseURL: `${this.$store.state.domain}student/token`,
//         method: 'get',
//         headers: {
//           'x-api-key': this.$store.state.apiKey,
//           authorization: `Bearer ${this.$cookies.get('token')}`,
//         },
//       })
//         .then((response) => {
//           if (response.data.data !== undefined) {
//             this.$store.commit('changeRole', 'student');
//             this.loadData = false;
//           } else {
//             axios({
//               baseURL: `${this.$store.state.domain}lecturer/token`,
//               method: 'get',
//               headers: {
//                 'x-api-key': this.$store.state.apiKey,
//                 authorization: `Bearer ${this.$cookies.get('token')}`,
//               },
//             })
//               .then((response1) => {
//                 if (response1.data.data !== undefined) {
//                   this.$store.commit('changeRole', 'lecturer');
//                   this.loadData = false;
//                 } else {
//                   axios({
//                     baseURL: `${this.$store.state.domain}head-major/token`,
//                     method: 'get',
//                     headers: {
//                       'x-api-key': this.$store.state.apiKey,
//                       authorization: `Bearer ${this.$cookies.get('token')}`,
//                     },
//                   })
//                     .then((response2) => {
//                       if (response2.data.data !== undefined) {
//                         this.$store.commit('changeRole', 'Head Majors');
//                         this.loadData = false;
//                       }
//                     })
//                     .catch((error) => {
//                       // eslint-disable-next-line no-console
//                       console.log(error);
//                     });
//                 }
//               })
//               .catch((error) => {
//                 // eslint-disable-next-line no-console
//                 console.log(error);
//               });
//           }
//         })
//         .catch((error) => {
//           // eslint-disable-next-line no-console
//           console.log(error);
//         });
//     }
//   },
//   created() {
//     if (this.$cookies.isKey('token')) {
//       this.$store.commit('changeToken', this.$cookies.get('token'));
//     } else {
//       this.loadData = false;
//     }
//     // eslint-disable-next-line no-console
//     console.log(this.$store.state.token);
//     const url = window.location.pathname;
//     if (
//       url === '/'
//       || url === '/login-lecture'
//       || url === '/login-head-majors'
//       || url === '/register-student'
//       || url === '/test'
//     ) {
//       this.checkLogin = false;
//     } else {
//       this.checkLogin = true;
//     }
//   },
//   updated() {
//     const url = window.location.pathname;
//     // eslint-disable-next-line no-console
//     console.log(this.$store.state.token);
//     if (
//       url === '/'
//       || url === '/login-lecture'
//       || url === '/login-head-majors'
//       || url === '/register-student'
//     ) {
//       this.checkLogin = false;
//     } else {
//       this.checkLogin = true;
//     }
//   },
// };
</script>
