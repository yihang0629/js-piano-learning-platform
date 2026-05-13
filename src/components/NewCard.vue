<template>
  <div class="new-card">
    <!-- 帖子 -->
    <div class="card-main">
      <!-- <div class="blank"></div> -->

      <div class="choose-biaoqian">
        <input type="text" disabled placeholder="选择标签..." class="input" />
        <span class="iconfont icon-biaoqian" @click="change_bqFlag" />
        <span class="biaoqian" @click="change_bqFlag">标签</span>
      </div>

      <!-- bqFlag  -->
      <div class="label" v-show="bqFlag">
        <div class="label-top">
          <p class="content">选择标签</p>
        </div>
        <div class="label-main">
          <p class="iconfont icon-biaoqian" v-for="(item, index) in label[id]" :key="index">
            <span
              class="biaoqian"
              :class="{ labelSelected: label_num == index }"
              @click="SwitchListNode(index)"
              >{{ item }}</span
            >
          </p>
        </div>
      </div>

      <br />
      <div class="text">
        <textarea placeholder="内容..." class="message" maxlength="500" v-model="message" />
        <!-- <textarea placeholder="内容..." class="message" maxlength="500"></textarea> -->
      </div>
    </div>
    <div class="footbtn" v-show="true">
      <DemoButton button_size="max" button_status="secondary" @click="closeNewCard" class="concel"
        >取消</DemoButton
      >
      <DemoButton button_size="max" class="submit" @click="submit">发布</DemoButton>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { label } from '@/utils/data';
import DemoButton from './DemoButton.vue';
import { insertWallApi } from '@/api/index';

const store = useStore();

const props = defineProps({
  biaoqian: {
    default: [],
  },
  id: {
    default: 0,
  },
});

const emit = defineEmits(['newCardClose', 'clickbtn']);

const label_num = ref(0);
const bqFlag = ref(false);
const message = ref('');
const name = ref('aaa');

const user = computed(() => store.state.user);

const SwitchListNode = (index) => {
  label_num.value = index;
};

const change_bqFlag = () => {
  bqFlag.value = !bqFlag.value;
};

const closeNewCard = () => {
  emit('newCardClose');
};

const getUser = () => {
  const timer = setInterval(() => {
    if (user.value) {
      clearInterval(timer);
    }
  }, 10);
};

const submit = () => {
  bqFlag.value = false;

  const data = {
    type: props.id,
    message: message.value,
    userId: user.value.id,
    name: '匿名',
    moment: new Date(),
    label: label_num.value,
  };

  if (message.value) {
    insertWallApi(data)
      .then((res) => {
        const newdata = {
          type: props.id,
          message: message.value,
          userId: user.value.id,
          name: '匿名',
          moment: new Date(),
          label: label_num.value,
          id: res.message.insertId,
          islike: [{ count: 0 }],
          like: [{ count: 0 }],
          comcount: [{ count: 0 }],
          report: [{ count: 0 }],
          revoke: [{ count: 0 }],
        };
        emit('clickbtn', newdata);
        message.value = '';
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }
};

onMounted(() => {
  getUser();
});
</script>
<style lang="less" scoped>
@import '@/assets/fonts/icon-biaoqian/iconfont.css';
@import '../assets/fonts/icon-jiahao/iconfont.css';
@import '../assets/fonts/icon-xiugai/iconfont.css';
.new-card {
  padding: 0 20px;

  .card-main {
    position: relative;
    .blank {
      clip-path: inset(0 85px 0 0);
      position: absolute;
      top: 13.65%;
      border: #376bb6 0px solid;
      height: 18px;
      width: 100%;
      background-color: white;
    }

    /* 取消文字选中 */
    user-select: none;

    height: 270px;
    background: white;
    padding: 12px;

    .choose-biaoqian {
      position: fixed;
      background: white;
      top: 52px;
      width: 100%;
      clip-path: inset(0 377px 0 0);
      .input {
        width: 50%;
        box-sizing: border-box;
        border: #dfdfdf 1px solid;
        background: none;

        padding: 8px;
        margin-top: 10px;
        margin-bottom: 5px;
        margin-right: 10px;
      }

      .icon-biaoqian {
        cursor: pointer;
        color: #376bb6;
        margin-right: 3px;
      }
      .biaoqian {
        cursor: pointer;
        font-size: 13px;
        color: #376bb6;
      }
    }
    .text {
      padding-top: 15px;
      .message {
        background: #fafafa;
        border: none;
        padding: 8px;
        padding-top: 10px;
        box-sizing: border-box;
        resize: none;

        height: 280px;
        width: 100%;
      }
    }

    .label {
      width: 150px;

      position: fixed;
      z-index: 1000;
      top: 100px;
      left: 55%;

      border: #bfbfbf solid 1px;
      box-shadow: 0 0 2px 2px #e5e5e5;
      .label-top {
        height: 30px;
        background: #fafafa;

        .content {
          line-height: 30px;
          text-align: left;
          padding-left: 10px;
          font-weight: 600;
        }
      }
      .label-main {
        padding: 5px 0 10px 10px;
        background: white;

        .icon-biaoqian {
          color: #376bb6;
        }
        .biaoqian {
          cursor: pointer;

          padding: 3px 8px;
          border-radius: 20px;
          margin-left: 3px;
          font-size: 13px;
          color: #376bb6;
        }
      }
      .labelSelected {
        background: #ebebeb;
        font-weight: 600;
      }
    }
  }
  .footbtn {
    clip-path: inset(0 63px 0 0);
    padding: 20px 40px;
    box-sizing: border-box;
    position: fixed;
    bottom: 0px;
    left: 20px;
    width: 100%;
    // background-color: white;
    // .submit{
    //     // position: relative;
    //     // left: 500px;
    // }
    .concel {
      margin-left: 100px;
      margin-right: 400px;
    }
  }
}
</style>
