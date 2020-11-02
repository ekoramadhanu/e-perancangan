import Vue from 'vue';
import VueRouter from 'vue-router';
import loginStudent from '../views/LoginStudent.vue';
import registerStudent from '../views/RegisterStudent.vue';
import dashboard from '../views/Dashboard.vue';
import changePassword from '../views/ChangePassword.vue';
import loginLecture from '../views/LoginLecture.vue';
import loginHeadMajors from '../views/LoginHeadMajors.vue';
import firstLogin from '../views/FirstLogin.vue';
import title from '../views/Title.vue';
import detailAbstract from '../views/DetailAbstrack.vue';
import listLecturer from '../views/ListLecturer.vue';
import test from '../views/Test.vue';
import coba from '../views/coba.vue';
import logBook from '../views/LogBook.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/test',
    name: 'test',
    component: test,
  },
  {
    path: '/coba',
    name: 'coba',
    component: coba,
  },
  {
    path: '/',
    name: 'loginStudent',
    component: loginStudent,
    beforeEnter: (to, from, next) => {
      if (window.$cookies.isKey('token')) {
        next('/home');
      } else {
        next();
      }
    },
  },
  {
    path: '/detail-abstract/:id',
    name: 'detailAbstract',
    component: detailAbstract,
    beforeEnter: (to, from, next) => {
      if (!window.$cookies.isKey('token')) {
        next('/');
      } else {
        next();
      }
    },
  },
  {
    path: '/login-lecture',
    name: 'loginLecture',
    component: loginLecture,
    beforeEnter: (to, from, next) => {
      if (window.$cookies.isKey('token')) {
        next('/home');
      } else {
        next();
      }
    },
  },
  {
    path: '/login-head-majors',
    name: 'loginHeadMajors',
    component: loginHeadMajors,
    beforeEnter: (to, from, next) => {
      if (window.$cookies.isKey('token')) {
        next('/home');
      } else {
        next();
      }
    },
  },
  {
    path: '/register-student',
    name: 'registerStudent',
    component: registerStudent,
    beforeEnter: (to, from, next) => {
      if (window.$cookies.isKey('token')) {
        next('/home');
      } else {
        next();
      }
    },
  },
  {
    path: '/home',
    name: 'dashboard',
    component: dashboard,
    beforeEnter: (to, from, next) => {
      if (!window.$cookies.isKey('token')) {
        next('/');
      } else {
        next();
      }
    },
  },
  {
    path: '/change-password',
    name: 'changePassword',
    component: changePassword,
    beforeEnter: (to, from, next) => {
      if (!window.$cookies.isKey('token')) {
        next('/');
      } else {
        next();
      }
    },
  },
  {
    path: '/first-login',
    name: 'firstLogin',
    component: firstLogin,
    beforeEnter: (to, from, next) => {
      if (!window.$cookies.isKey('token')) {
        next('/');
      } else {
        next();
      }
    },
  },
  {
    path: '/list-title',
    name: 'title',
    component: title,
    beforeEnter: (to, from, next) => {
      if (!window.$cookies.isKey('token')) {
        next('/');
      } else {
        next();
      }
    },
  },
  {
    path: '/log-book',
    name: 'logBook',
    component: logBook,
    beforeEnter: (to, from, next) => {
      if (!window.$cookies.isKey('token')) {
        next('/');
      } else {
        next();
      }
    },
  },
  {
    path: '/list-lecturer',
    name: 'listLecturer',
    component: listLecturer,
    beforeEnter: (to, from, next) => {
      if (!window.$cookies.isKey('token')) {
        next('/');
      } else {
        next();
      }
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
