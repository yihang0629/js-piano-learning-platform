<template>
  <div class="top-bar">
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
      <span>{{ this.hello.string }}，欢迎您</span>
      <!--游客状态==> 去登录 -->
      <div class="user-head" v-if="this.user.id == '::1'" @click="goPerson" />
      <!--登录状态 ==> 退出登录 变游客  -->
      <div class="user-head" v-if="this.user.id != '::1'" @click="exit" />
    </div>
  </div>

  <div class="wall-message">
    <p class="title">{{ menu_item[0].name }}</p>
    <p calss="slogan" style="text-align: center">{{ menu_item[0].slogan }}</p>
    <br />

    <div class="label" :class="{ fixed: isNavbarFixed || wFlag || PFlag }">
      <!-- 动态类绑定时，属性名中不允许使用连字符 -。因此，在你的代码中，label-selected 应该改为 labelSelected 或者使用字符串形式的类名。 -->
      <p class="label-list" :class="{ labelSelected: label_num == -1 }" @click="SwitchListNode(-1)">
        全部
      </p>
      <p
        class="label-list"
        :class="{ labelSelected: label_num == index }"
        v-for="(item, index) in label[0]"
        :key="index"
        @click="SwitchListNode(index)"
      >
        {{ item }}
      </p>
    </div>

    <!-- 利用后端处理得到的数据集cards，渲染前端 留言卡片 页面 -->
    <!-- v-if="id == 0" -->
    <div class="card">
      <TalkCard
        v-for="(item, index) in cards"
        :key="index"
        :cards="item"
        @toDetail="selectCard(index)"
        :class="{ cardSelected: index == cardSelected }"
      />
    </div>

    <!-- <FooterBar></FooterBar> -->

    <div class="DayToNightToDay" v-show="!PFlag">
      <div class="DayorNight">
        <!-- <span class="iconfont icon-yejianmoshi" ></span>  -->
        <div class="icon-box" @click="changeModel">
          <span class="iconfont icon-baitianmoshi" v-show="modelFlag" />
          <span class="iconfont icon-yejianmoshi" v-show="!modelFlag" />
        </div>

        <p class="CN-model">{{ model }}</p>
      </div>
    </div>

    <!-- 新建帖子按键 -->
    <div class="add" @click="newBlankCard" v-show="addFlag">
      <span class="iconfont icon-jiahao" />
    </div>
    <PostCard
      :title="title"
      @clickbtn="deleteCard"
      @changeW="changePostW"
      :w-flag="wFlag"
      :id="id1"
      :label="label"
      :rr="rr"
    >
      <NewCard
        :id="id1"
        @newCardClose="closePostW"
        v-show="cardSelected == -1"
        @clickbtn="insert"
      />
      <CardDetail :id="id1" v-show="cardSelected != -1 && wFlag" :cards="cards[cardSelected]" />
    </PostCard>
  </div>
</template>
<script>
// import HeaderBar from '@/components/HeaderBar.vue'
import DemoButton from '@/components/DemoButton.vue';
import { menu_item, label } from '@/utils/data';
import TalkCard from '@/components/TalkCard.vue';
import PostCard from '@/components/PostCard.vue';
// import FooterBar from '@/components/FooterBar.vue'
import NewCard from '@/components/NewCard.vue';
import CardDetail from '@/components/CardDetail.vue';
// import MusicPhoto from '@/components/MusicPhoto.vue'
// import PhotoView from '@/components/PhotoView.vue'
// import PhotoDetail from '@/components/PhotoDetail.vue'
// import PhotoDetail2 from '@/components/PhotoDetail2.vue'
// import PostPhoto from '@/components/PostPhoto.vue'
// import NewPhoto from '@/components/NewPhoto.vue'

// import PhotoComment from '@/components/PhotoComment.vue'

import { findWallPageApi, deleteWallApi } from '@/api/index';

import { talk, photo } from '../../mock/index';

import { inject } from 'vue';

export default {
  components: {
    // HeaderBar,
    DemoButton,
    TalkCard,
    PostCard,
    // FooterBar,s
    NewCard,
    CardDetail,
    // MusicPhoto,
    // PhotoView,
    // PhotoDetail,
    // PostPhoto,
    // PhotoComment,
    // PhotoDetail2,
  },
  data() {
    return {
      id1: 0,
      menu_item,
      // 论坛下的导航栏
      label,
      // 控制导航栏是否固定
      isNavbarFixed: false,

      // label_num用于表示不同列表项被选中 -1代表 全部 被选中
      label_num: -1,

      // 拿到假数据
      photo: photo.data,
      talk: talk.data,
      // photos:photos.data,

      // 控制昼夜
      modelFlag: false,
      model: '夜间',

      // 控制label是否固定
      labelFlag: true,

      // title 新建标题
      title: '发表新帖',

      // rr
      rr: false,
      np: false,

      // wFlag 发帖窗口是否显示在界面
      wFlag: false,

      // 图片详情
      PFlag: false,

      // addFlag
      addFlag: true,

      // 当前点击的卡片的index
      cardSelected: -1,

      // 当前点击的图片的index
      photoSelected: -1,

      // 帖子真数据
      cards: [],

      photos: [],

      //
      page: 1,
      pagesize: 100,

      showComponent: false,
    };
  },
  created() {},
  mounted() {
    // 监听滚动事件
    window.addEventListener('scroll', this.handleScroll);

    // 处理游客的唯一标识userId 即ip地址
    this.getUser();

    if (this.user.id == '1') {
      let hello = { string: '管理员' };
      this.$store.commit('getHello', hello);
    }
    if (this.user.id == '3') {
      let hello = { string: '用户名' };
      this.$store.commit('getHello', hello);
    }
  },
  beforeUnmount() {
    // 清除监听器
    // window.removeEventListener('scroll', this.handleScroll);
  },

  computed: {
    state() {
      const store = inject('store');
      return store.state;
    },
    id() {
      return this.$store.state.id;
    },

    hello() {
      return this.$store.state.hello;
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
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
    // 退出登录
    exit() {
      alert('是否退出登录？');
      location.reload();
    },

    // 点击论坛下的子导航栏 切换对应列表项 展示相应的内容
    SwitchListNode(index) {
      this.label_num = index;

      // 点击切换论坛下子导航 详情页模态框应处于非弹出状态
      this.wFlag = false;
      this.PFlag = false;
      this.cardSelected = -1;

      // 清空当前页面渲染的数据
      this.cards = [];

      // page表示无限列表的第几页
      this.page = 1;

      this.getPostCard(this.id1);
    },

    // 切换昼夜
    changeModel() {
      this.modelFlag = !this.modelFlag;
      if (this.modelFlag) {
        this.model = '白天';
      } else {
        this.model = '夜间';
      }
    },

    // 实现监控导航栏位置
    handleScroll() {
      const labelElement = document.querySelector('.label');

      // 检查是否成功找到了元素
      if (labelElement) {
        const navbarOffsetTop = labelElement.offsetTop;

        // 获取当前滚动位置
        const scrollPosition = window.scrollY;

        // 如果滚动位置超过了导航栏初始位置，则固定导航栏
        // console.log(this.labelFlag,(scrollPosition - navbarOffsetTop));
        if (this.labelFlag && scrollPosition - navbarOffsetTop > -60) {
          this.isNavbarFixed = true;
          this.labelFlag = !this.labelFlag;
        } else if (!this.labelFlag && scrollPosition - navbarOffsetTop < 20) {
          this.isNavbarFixed = false;
          this.labelFlag = !this.labelFlag;
        }
      } else {
        // 如果未找到元素，进行错误处理
        console.error('未找到具有 .label 类名的元素');
      }
    },

    // // 点击新建空白 详情/发帖 模态框
    newBlankCard() {
      this.title = '发表新帖';
      this.rr = false;
      // this.changePostW();
      this.wFlag = !this.wFlag;
      this.addFlag = !this.addFlag;
    },

    //点击cha 改变发帖窗口的显示状态
    changePostW(value) {
      this.wFlag = !this.wFlag;
      this.cardSelected = value;
      this.addFlag = true;
    },

    //点击取消按钮 关闭 模态框
    closePostW() {
      this.wFlag = false;
      // this.cardSelected = -1
      this.addFlag = true;
    },
    toTalk() {},
    deleteCard() {
      let postId = this.cards[this.cardSelected].id;
      // alert(postId)
      let data = { id: postId };
      // 前端数据传入后端处理
      deleteWallApi(data).then(() => {
        this.cards = this.cards.filter((card) => card.id !== postId);
      });
      // location.reload();
      this.closePostW();
      setTimeout(() => {
        alert('已删除');
      }, 800);
    },

    // 选择卡片
    selectCard(e) {
      this.title = '';
      this.rr = true;
      if (this.cardSelected != e) {
        this.cardSelected = e;
        this.wFlag = true;
        this.addFlag = false;
      } else {
        this.cardSelected = -1;
        this.wFlag = false;
        this.addFlag = true;
      }
    },

    // 插入新贴
    insert(newdata) {
      this.cards.unshift(newdata);
      this.changePostW();
      this.addFlag = true;
      setTimeout(() => {
        alert('发布成功');
      }, 800);
    },

    getUser() {
      let timer = setInterval(() => {
        if (this.user) {
          clearInterval(timer);

          this.getPostCard(this.id1);
        }
      }, 10);
    },
    // 为数据库中的留言帖子表的所有属性赋初值，并经由后端处理，形成新的数据集cards，再由前端渲染到页面
    getPostCard(id1) {
      let data;
      if (this.page > 0) {
        data = {
          type: id1,
          page: this.page,
          pagesize: this.pagesize,
          userId: this.user.id,
          label: this.label_num,
        };
        // console.log(data);
        findWallPageApi(data).then((res) => {
          this.cards = this.cards.concat(res.message);
          console.log(this.cards);

          if (res.message.length) {
            this.page++;
          } else {
            this.page = 0;
          }
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
@import '../assets/fonts/icon-yejianmoshi/iconfont.css';
@import '../assets/fonts/icon-baitianmoshi/iconfont.css';
@import '../assets/fonts/icon-jiahao/iconfont.css';

.top-bar {
  width: 100%;
  height: 60px;
  padding: 0 30px;
  box-sizing: border-box;
  // rgba(255,255,255,0.80)
  background: white;
  backdrop-filter: blur(10px);
  // box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);

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

.wall-message {
  min-height: 700px;
  padding-top: 60px;
  .title {
    padding-top: 20px;
    padding-bottom: 8px;
    font-size: 35px;
    color: #202020;
    text-align: center;
    font-weight: 600;
  }
  .slogan {
    color: @gray-2;
  }

  .fixed {
    position: fixed;
    top: 60px;
    z-index: 99999;
    margin-top: 0;
  }

  .label {
    background-color: @gray-10;
    box-shadow: 0 0 1px 1px #f8f8f8;
    width: 100%;
    transition: @slow-trans;

    display: flex;
    justify-content: flex-start;
    padding-left: 40px;

    .label-list {
      padding: 0 14px;
      line-height: 28px;
      margin: 4px;
      color: @gray-2;

      // 改变鼠标样式
      cursor: pointer;
    }
    .labelSelected {
      color: @gray-1;
      font-weight: 600;
      border: 1px solid @gray-1;
      border-radius: 14px;
    }
  }

  .card {
    // border: 1px solid red;
    // height: 10000px;
    // .cardSelected{
    //     border: 1px solid @primary-color;
    // }

    z-index: 2;
  }

  .DayToNightToDay {
    z-index: 2000;
    width: 52px;
    height: 80px;
    background-color: @gray-10;
    // border: 1px solid @gray-1;
    box-shadow: 0 0 5px 5px #f8f8f8;
    border-radius: 14px;
    position: fixed;
    right: 70px;
    top: 230px;
    .DayorNight {
      position: relative;
      top: 20px;
      left: 12px;
      .icon-box {
        width: 28px;
        height: 28px;
        cursor: pointer;
        // position: relative;
        transition: @trans;
        &:hover {
          background-color: #f0f0f0;
        }
        .iconfont {
          position: relative;
          top: 3px;
          left: 6px;
        }
      }

      .CN-model {
        top: 2px;
        position: relative;
        left: 3px;
        font-size: 12px;
      }
    }
  }

  .add {
    z-index: 2000;
    width: 56px;
    height: 56px;
    position: fixed;
    right: 70px;
    top: 450px;
    background: @gray-1;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.08);
    border-radius: 28px;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;

    .icon-jiahao {
      color: @gray-10;
      font-size: 24px;
    }
  }

  .photo {
    width: 85%;
    display: flex;
    flex-wrap: wrap;
    margin-left: 40px;

    z-index: 1;

    .music-photo {
      width: 300px;

      margin-left: 15px;
      margin-right: 15px;
      margin-top: 20px;
      margin-bottom: 20px;
    }
  }

  .photoSelected {
    border: 3px solid black;
  }
}
</style>
