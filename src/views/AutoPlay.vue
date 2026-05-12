<template>
  <label>导航栏：</label>
  <xwButton :value="state.hideNavBar" @change="handleHideNavBarChange" />
  <div class="auto-play">
    <div class="top-bar" v-show="hideNavBar != true">
      <div class="logo">
        <img src="@/assets/images/piano.png" class="logo-img" />
        <p class="logo-name">钢琴知识学习系统</p>
      </div>
      <div class="menu">
        <DemoButton
          @click="goAutoPlay"
          button_size="max"
          :button_status="state.id == -1 ? 'cprimary' : 'csecondary'"
          class="menu-AutoPlay"
          >自由弹奏</DemoButton
        >
        <DemoButton
          @click="goForum"
          button_size="max"
          :button_status="state.id == 0 ? 'cprimary' : 'csecondary'"
          class="menu-Forum"
          >学习论坛</DemoButton
        >
        <DemoButton
          @click="goPhoto"
          button_size="max"
          :button_status="state.id == 1 ? 'cprimary' : 'csecondary'"
          class="menu-Music"
          >曲谱中心</DemoButton
        >
        <DemoButton
          @click="goUserCenter"
          button_size="max"
          :button_status="state.id == 2 ? 'cprimary' : 'csecondary'"
          class="menu-UserCenter"
          >用户中心</DemoButton
        >
        <!-- <DemoButton @click="changePage(2)" button_size="max" :button_status="(id == 2 ? 'cprimary' : 'csecondary')" class="menu-Video">琴音分享</DemoButton> -->
      </div>
      <div class="user">
        <div class="user-head" @click="goPerson" />
      </div>
    </div>

    <PanelsMain v-show="hideNavBar != true" />
    <NoteBar />
    <PianoFooter />
  </div>
</template>

<script>
// 引入组件
// import HeaderBar from '@/components/HeaderBar.vue'
import PianoFooter from '@/components/PianoFooter.vue';
import NoteBar from '@/components/PianoComponets/piano_src/piano_components/NoteBar/NoteBar.vue';
import DemoButton from '@/components/DemoButton.vue';
import PanelsMain from '@/components/PianoComponets/piano_src/piano_components/Setting/PanelsMain.vue';

import { resize } from '../components/PianoComponets/piano_src/piano_components/size';
import xwButton from '../components/PianoComponets/piano_src/piano_components/Setting/comp/xw-switch.vue';
import { inject } from 'vue';
import { signIpApi } from '@/api/index';
export default {
  data() {
    return {
      classObject: {
        cprimary: true,
        csecondary: false,
      },
      // id: -1,
    };
  },

  components: {
    // 注册组件
    PanelsMain,
    NoteBar,
    PianoFooter,
    DemoButton,
    xwButton,
    // HeaderBar,
  },

  // 在这里，state 计算属性依赖于 this.$store.state，因此当 Vuex store 的状态发生变化时，state 会自动更新。
  // 通过这种方式，组件可以轻松地访问 Vuex store 中的状态，并且能够实时响应状态的变化。
  computed: {
    state() {
      const store = inject('store');
      return store.state;
    },
    id() {
      return this.$store.state.id;
    },
    user() {
      return this.$store.state.user;
    },

    hideNavBar() {
      return this.$store.state.hideNavBar;
    },
  },
  created() {
    // if(! this.user) this.getUserIp()
  },
  mounted() {},

  methods: {
    getUserIp() {
      signIpApi()
        .then((res) => {
          console.log(res);
          let user = {
            id: res.ip,
          };
          this.$store.commit('getUser', user);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    },
    // 点击去往自由弹奏
    goAutoPlay() {
      this.state.id = -1;
      this.$router.push('/AutoPlay');
    },
    // 点击去往学习论坛
    goForum() {
      this.state.id = 0;
      this.$router.push('/CardPage');
    },

    // 点击去往曲谱中心
    goPhoto() {
      this.state.id = 1;
      this.$router.push('/PhotoPage');
    },
    // 点击去往用户中心
    goUserCenter() {
      this.state.id = 2;
      this.$router.push('/user-center');
    },
    // 去往个人中心
    goPerson() {
      this.$router.push('/person');
    },
    handleHideNavBarChange(newValue) {
      this.state.hideNavBar = newValue;
      this.$nextTick(resize);
    },
  },
};
</script>
<style lang="less" scoped>
.auto-play {
  width: 100%;
  height: 575px;
  background: white;

  .top-bar {
    width: 100%;
    height: 60px;
    padding: 0 30px;
    box-sizing: border-box;
    // rgba(255,255,255,0.80)
    background: white;
    backdrop-filter: blur(10px);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);

    // 实现页面滚动而头部不动
    position: fixed; // 固定定位
    // 定位的位置
    top: 0;
    left: 0;

    // 定位在最上面一层
    z-index: 9999;

    // 采用flex布局
    // 内部子元素按照水平方向平均分布，并在垂直方向居中对齐。
    // 这通常用于创建水平方向的导航栏、工具栏等组件，使其内部元素能够自动适应容器的宽度，并在垂直方向上居中对齐。
    display: flex;
    justify-content: space-between;
    align-items: center;

    .logo {
      width: 215px;
      display: flex;
      align-items: center;
      .logo-name {
        font-size: 20px;
        color: @gray-1;
        padding-left: 10px;
        font-weight: 600;
      }
    }

    .user {
      width: 200px;
      .user-head {
        float: right;
        border-radius: 50%;
        height: 36px;
        width: 36px;
        background-color: deepskyblue;
      }
    }
  }
  .logo-img {
    width: 45px;
    height: 30px;
  }
  .logo-name {
    font-size: @font-size-14;
  }

  .menu {
    .menu-AutoPlay {
      margin-right: 24px;
    }
    .menu-Forum {
      margin-right: 24px;
    }
    .menu-Music {
      margin-right: 24px;
    }
  }
}
</style>
