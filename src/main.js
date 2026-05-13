import { createApp } from 'vue';
import App from './App.vue';

import 'uno.css';
import router from '@/router/index';
import store from './store/store';
import axios from 'axios';
import VueAxios from 'vue-axios';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App);

app.use(store);
app.use(router);
app.use(VueAxios, axios);
app.use(ElementPlus);

app.mount('#app');
