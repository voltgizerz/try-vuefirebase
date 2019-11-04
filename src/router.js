import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from '../src/components/Dashboard.vue';
import Makanan from '../src/components/Makanan.vue';

Vue.use(VueRouter);

export default new VueRouter(
  {
    routes: [
      {
        path: '/',
        name: 'dashboard',
        component: Dashboard
      },
      {
        path: '/makanan',
        name: 'makanan',
        component: Makanan
      },
    ]
  })
