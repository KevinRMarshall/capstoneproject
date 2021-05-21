import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Profile from '../views/Profile.vue';
import Login from '../views/Login.vue';
import CreateProfile from '../views/CreateProfile.vue';
import Calendar from '../views/Calendar.vue';
import Discussion from '../views/Discussion.vue';
import Thread from '../views/Thread.vue';
import Report from '../views/Report.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/createprofile',
    name: 'CreateProfile',
    component: CreateProfile,
  },
  {
    path: '/discussion',
    name: 'Discussion',
    component: Discussion,
  },
  {
    path: '/thread',
    name: 'Thread',
    component: Thread,
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar,
  },
  {
    path: '/report',
    name: 'Report',
    component: Report,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
