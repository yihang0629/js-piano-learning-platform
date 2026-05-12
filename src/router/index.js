import { createRouter, createWebHashHistory } from 'vue-router';

import AutoPlay from '@/views/AutoPlay.vue';
import CardPage from '@/views/CardPage.vue';
import PhotoPage from '@/views/PhotoPage.vue';
import PersonCenter from '@/views/PersonCenter.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import UserCenter from '@/views/UserCenter.vue';
import MainLayout from '@/components/MainLayout.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '/',
        redirect: '/PhotoPage',
      },
      {
        path: '/AutoPlay',
        component: AutoPlay,
      },
      {
        path: '/CardPage',
        component: CardPage,
      },
      {
        path: '/PhotoPage',
        component: PhotoPage,
      },
      {
        path: '/user-center',
        component: UserCenter,
      },
    ],
  },
  {
    path: '/person',
    component: PersonCenter,
  },
  {
    path: '/register',
    component: RegisterPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
