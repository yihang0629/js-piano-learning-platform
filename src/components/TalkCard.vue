<template>
  <div
    class="knowledge-card w-4/5 box-border relative p-3 mt-2 ml-10 mr-45 overflow-hidden whitespace-normal bg-white hover:border-1 hover:border-primary"
  >
    <div class="top flex justify-between pb-4">
      <p class="time text-xs text-gray-3">{{ switchdate(card.moment) }}</p>
      <p class="label text-xs text-gray-3">{{ label[idFlag][card.label] }}</p>
    </div>
    <p class="message text-sm text-gray-1 mb-12 cursor-pointer" @click="toDetail">{{ card.message }}</p>
    <div class="foot absolute bottom-4 left-0 w-full px-5 flex justify-between box-border">
      <div class="foot-left flex">
        <div class="icon pr-2 flex items-center cursor-pointer" @click="clickLike">
          <span class="iconfont icon-xin text-sm text-gray-3 hover:text-like transition-all" :class="{ islike: card.islike[0].count > 0 }" />
          <span class="value text-sm text-gray-3 pl-1">{{ card.like[0].count }}</span>
        </div>

        <div class="icon pr-2 flex items-center" v-show="card.comcount[0].count > 0">
          <span class="iconfont icon-pinglun text-sm text-gray-3" />
          <span class="value text-sm text-gray-3 pl-1">{{ card.comcount[0].count }}</span>
        </div>
      </div>
      <div class="name text-base text-gray-1">用户名</div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { label } from '@/utils/data';
import { switchdate } from '@/utils/switchTime';
import { insertFeedback } from '@/api/index';

const store = useStore();
const router = useRouter();

const props = defineProps({
  id: {
    default: 0,
  },
  cards: {
    default: {
      like: [{ count: 0 }],
      islike: [{ count: 0 }],
      comcount: [{ count: 0 }],
    },
  },
  index: {
    default: 0,
  },
});

const emit = defineEmits(['toDetail']);

const card = computed(() => props.cards);
const idFlag = computed(() => props.id);
const user = computed(() => store.state.user);

const toDetail = () => {
  if (user.value.id != '::1') {
    emit('toDetail');
  } else {
    alert('请先登录');
    router.push('/person');
  }
};

const clickLike = () => {
  if (card.value.islike[0].count == 0) {
    const data = {
      type: 0,
      postId: card.value.id,
      userId: user.value.id,
      moment: new Date(),
    };
    insertFeedback(data).then(() => {});
    card.value.like[0].count++;
    card.value.islike[0].count++;
  }
};
</script>
<style scoped>
@import '../assets//fonts/icon-xin/iconfont.css';
@import '../assets//fonts/icon-pinglun/iconfont.css';

.islike {
  color: #ef4444;
}
</style>
