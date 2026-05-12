<template>
  <div class="wall-message">
    <p class="title">{{ menu_item[1].name }}</p>
    <p class="slogan" style="text-align: center">{{ menu_item[1].slogan }}</p>
    <br />

    <div class="label" :class="{ fixed: isNavbarFixed || wFlag || PFlag }">
      <p class="label-list" :class="{ labelSelected: label_num == -1 }" @click="SwitchListNode(-1)">
        全部
      </p>
      <p
        class="label-list"
        :class="{ labelSelected: label_num == index }"
        v-for="(item, index) in label[1]"
        :key="index"
        @click="SwitchListNode(index)"
      >
        {{ item }}
      </p>
    </div>

    <div class="photo">
      <MusicPhoto
        :photo="item"
        class="music-photo"
        @clickbtn="deletePhoto"
        @toPhotoDetail="selectPhoto(index)"
        v-for="(item, index) in photos"
        :key="index"
      />
    </div>

    <div class="DayToNightToDay" v-show="!PFlag">
      <div class="DayorNight">
        <div class="icon-box" @click="changeModel">
          <span class="iconfont icon-baitianmoshi" v-show="modelFlag" />
          <span class="iconfont icon-yejianmoshi" v-show="!modelFlag" />
        </div>
        <p class="CN-model">{{ model }}</p>
      </div>
    </div>

    <div
      class="add"
      v-if="user.id != '::1'"
      @click="newPhoto"
      v-show="cardSelected == -1 && addFlag"
    >
      <span class="iconfont icon-jiahao" />
    </div>

    <PhotoView @changePFlag="changePFlag" v-show="PFlag" :id1="id1" :label="label">
      <PhotoDetail :id1="id1" :np="np" v-if="!np" :photo="photos[photoSelected1]" />
      <PhotoDetail2 :id1="id1" :np="np" v-if="np" :photo="photos[photoSelected1]" />
      <PostPhoto :np="np" :photo="photos[photoSelected1]" @closePW="closePW">
        <PhotoComment :id1="id1" :np="np" :photo1="photos[photoSelected1]" @clickbt="insertPhoto" />
      </PostPhoto>
    </PhotoView>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { menu_item, label } from '@/utils/data';
import { findPhotoPageApi } from '@/api/index';
import { signIpApi } from '@/api/index';
import MusicPhoto from '@/components/MusicPhoto.vue';
import PhotoView from '@/components/PhotoView.vue';
import PhotoDetail from '@/components/PhotoDetail.vue';
import PhotoDetail2 from '@/components/PhotoDetail2.vue';
import PostPhoto from '@/components/PostPhoto.vue';
import PhotoComment from '@/components/PhotoComment.vue';

const store = useStore();

const id1 = ref(1);
const isNavbarFixed = ref(false);
const label_num = ref(-1);
const modelFlag = ref(false);
const model = ref('夜间');
const labelFlag = ref(true);
const np = ref(false);
const wFlag = ref(false);
const PFlag = ref(false);
const addFlag = ref(true);
const cardSelected = ref(-1);
const photoSelected = ref(-1);
const cards = ref([]);
const photos = ref([]);
const page = ref(1);
const pagesize = ref(100);

const user = computed(() => store.state.user);

const photoSelected1 = computed(() => {
  return photoSelected.value == -1 ? 0 : photoSelected.value;
});

const handleScroll = () => {
  const labelElement = document.querySelector('.label');
  if (labelElement) {
    const navbarOffsetTop = labelElement.offsetTop;
    const scrollPosition = window.scrollY;
    if (labelFlag.value && scrollPosition - navbarOffsetTop > -60) {
      isNavbarFixed.value = true;
      labelFlag.value = !labelFlag.value;
    } else if (!labelFlag.value && scrollPosition - navbarOffsetTop < 20) {
      isNavbarFixed.value = false;
      labelFlag.value = !labelFlag.value;
    }
  }
};

const getUserIp = () => {
  signIpApi()
    .then((res) => {
      const userData = {
        id: res.ip,
      };
      store.commit('getUser', userData);
    })
    .catch((error) => {
      console.error('Error fetching user:', error);
    });
};

const getUser = () => {
  const timer = setInterval(() => {
    if (user.value) {
      clearInterval(timer);
      getPhoto(id1.value);
    }
  }, 10);
};

const getPhoto = (id) => {
  if (page.value > 0) {
    const data = {
      type: id,
      page: page.value,
      pagesize: pagesize.value,
      userId: user.value.id,
      label: label_num.value,
    };
    findPhotoPageApi(data).then((res) => {
      photos.value = photos.value.concat(res.message);
      if (res.message.length) {
        page.value++;
      } else {
        page.value = 0;
      }
    });
  }
};

const SwitchListNode = (index) => {
  label_num.value = index;
  wFlag.value = false;
  PFlag.value = false;
  cardSelected.value = -1;
  photoSelected.value = -1;
  cards.value = [];
  photos.value = [];
  page.value = 1;
  getPhoto(id1.value);
};

const changeModel = () => {
  modelFlag.value = !modelFlag.value;
  model.value = modelFlag.value ? '白天' : '夜间';
};

const changePFlag = () => {
  PFlag.value = false;
  np.value = false;
};

const newPhoto = () => {
  np.value = true;
  PFlag.value = true;
  addFlag.value = false;
};

const selectPhoto = (e) => {
  if (photoSelected.value != e) {
    photoSelected.value = e;
    PFlag.value = true;
    np.value = false;
    addFlag.value = false;
  } else {
    photoSelected.value = -1;
    PFlag.value = false;
    addFlag.value = true;
  }
};

const deletePhoto = (photoId) => {
  photos.value = photos.value.filter((photo) => photo.id !== photoId);
  setTimeout(() => {
    alert('删除成功');
  }, 10);
};

const closePW = () => {
  PFlag.value = false;
  addFlag.value = true;
  photoSelected.value = -1;
};

const insertPhoto = (photoData) => {
  setTimeout(() => {
    photos.value.unshift(photoData);
    PFlag.value = false;
    addFlag.value = true;
  }, 800);
};

onMounted(() => {
  if (!user.value) {
    getUserIp();
  }
  window.addEventListener('scroll', handleScroll);
  getUser();

  if (user.value.id == '1') {
    store.commit('getHello', { string: '管理员' });
  }
  if (user.value.id == '3') {
    store.commit('getHello', { string: '用户名' });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="less" scoped>
@import '../assets/fonts/icon-yejianmoshi/iconfont.css';
@import '../assets/fonts/icon-baitianmoshi/iconfont.css';
@import '../assets/fonts/icon-jiahao/iconfont.css';

.wall-message {
  min-height: 700px;
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
    .cardSelected {
      border: 1px solid @primary-color;
    }
    z-index: 2;
  }

  .DayToNightToDay {
    z-index: 2000;
    width: 52px;
    height: 80px;
    background-color: @gray-10;
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
