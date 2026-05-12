<template>
  <div class="main-layout">
    <div class="top-bar">
      <div class="logo" @click="goHome">
        <img src="@/assets/images/piano.png" class="logo-img" />
        <p class="logo-name">钢琴知识学习系统</p>
      </div>

      <el-menu
        mode="horizontal"
        :default-active="String(currentMenuId)"
        @select="handleMenuSelect"
        class="nav-menu"
        :ellipsis="false"
      >
        <el-menu-item index="-1">自由弹奏</el-menu-item>
        <el-menu-item index="0">学习论坛</el-menu-item>
        <el-menu-item index="1">曲谱中心</el-menu-item>
        <el-menu-item index="2">用户中心</el-menu-item>
      </el-menu>

      <div class="user-area">
        <span class="welcome-text">{{ hello.string }}，欢迎您</span>
        <div class="user-head" v-if="isGuest" @click="goPerson" />
        <div class="user-head" v-else @click="exit" />
      </div>
    </div>

    <div class="content-area">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

const menuRoutes = {
  '-1': '/AutoPlay',
  0: '/CardPage',
  1: '/PhotoPage',
  2: '/user-center',
};

const currentMenuId = computed(() => store.state.id);
const hello = computed(() => store.state.hello);
const user = computed(() => store.state.user);
const isGuest = computed(() => user.value.id === '::1');

const handleMenuSelect = (index) => {
  store.commit('setId', Number(index));
  router.push(menuRoutes[index]);
};

const goHome = () => {
  store.commit('setId', 1);
  router.push('/PhotoPage');
};

const goPerson = () => {
  router.push('/person');
};

const exit = () => {
  alert('是否退出登录？');
  location.reload();
};
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 30px;
}

.logo-img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.logo-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
}

.nav-menu {
  flex: 1;
  border: none;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 15px;
}

.welcome-text {
  font-size: 14px;
  color: #666;
}

.user-head {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ddd;
  cursor: pointer;
}

.content-area {
  flex: 1;
  background-color: #f8f8f8;
}
</style>
