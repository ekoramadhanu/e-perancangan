<template>
  <div>
    <v-navigation-drawer v-model="drawer" app color="primary">
      <v-list dense shaped>
        <v-list-item>
          <v-list-item two-line class="px-0">
            <v-list-item-avatar>
              <v-img
                src="@/assets/logo.svg"
                width="100"
                height="100"
                contain
              ></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title
                class="white--text text-capitalize text-subtitle-1"
              >
                e-perancangan
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item>
        <v-divider class="line-white"></v-divider>
        <v-list-item-group active-class="active">
          <p class="text-capitalize white--text text-caption ml-5 mt-2">menu</p>
          <v-list-item to="/home">
            <v-list-item-action>
              <v-icon class="white--text">$dashboard</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="text-capitalize white--text">
                dashboard
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-for="item in returnNavigation"
            :key="item.name"
            link
            :to="item.link"
          >
            <v-list-item-action>
              <v-icon class="white--text text-capitalize">{{
                item.icon
              }}</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title class="white--text text-capitalize">{{
                item.name
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <p class="text-capitalize white--text text-caption ml-5 mt-2">akun</p>
          <v-list-item to="/change-password">
            <v-list-item-action>
              <v-icon class="white--text">$padlock</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="text-capitalize white--text">
                ganti kata sandi
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-action>
              <v-icon class="white--text">$logout</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="text-capitalize white--text">
                keluar
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        class="primary--text"
      ></v-app-bar-nav-icon>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
  }),
  computed: {
    returnNavigation() {
      const { role } = this.$store.state;
      return this.$store.getters.returnSidebar(role);
    },
  },
  methods: {
    logout() {
      this.$cookies.remove('token');
      this.$router.push('/');
    },
  },
  created() {
    // eslint-disable-next-line no-console
    console.log(this.$store.state.role);
  },
};
</script>

<style scoped>
.line-white {
  border-color: white !important;
}
.active {
  background-color: #42589d;
}
</style>
