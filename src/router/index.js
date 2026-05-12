import { createRouter, createWebHashHistory } from 'vue-router';

// import HomeIndex from '@/views/HomeIndex.vue'
import AutoPlay from '@/views/AutoPlay.vue';
import CardPage from '@/views/CardPage.vue';
import PhotoPage from '@/views/PhotoPage.vue';
import PersonCenter from '@/views/PersonCenter.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import UserCenter from '@/views/UserCenter.vue';

const routes = [
  {
    path: '/',
    // redirect:'/person',
    component: PhotoPage,
    // component: PersonCenter,

    // name:'index',
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
    // path: '/PhotoPage/:param1', // 定义带参数的路由
    path: '/PhotoPage',
    // name: PhotoPage,
    // { name: 'PhotoPage' }
    component: PhotoPage,
  },
  {
    path: '/person',
    component: PersonCenter,
  },
  {
    path: '/user-center',
    component: UserCenter,
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
