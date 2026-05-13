<template>
  <div class="card-detail relative p-3">
    <TalkCard :cards="card" :id="id" class="card border-1 border-primary" />

    <div class="form">
      <textarea
        class="message bg-gray-9 border-none p-2 mt-3 ml-10 resize-none h-25 w-9/10 box-border"
        placeholder="评论一下..."
        v-model="discuss"
      />
      <div class="btn pt-2">
        <input
          type="text"
          class="name w-50 h-10 border-1 border-gray-200 bg-transparent p-2 pb-1 mt-2 mr-5 ml-60% box-border"
          placeholder="签名"
          v-model="name"
        />
        <DemoButton class="comm-btn relative left-1" :class="{ noteallowed: !isDis }" @click="submit"
          >评论</DemoButton
        >
      </div>
    </div>

    <p class="comment-top absolute left-15 font-semibold pt-5">评论 {{ card.comcount[0].count }}</p>
    <div class="comment-main relative top-12 left-8 w-95/100">
      <div class="comment-li flex pb-8 w-88/100" v-for="(item, index) in comments" :key="index">
        <div class="user-head flex-none w-7 h-7 rounded-full overflow-hidden" :style="{ backgroundImage: portrait[item.imgurl] }" />
        <div class="comment-right pl-2 w-full">
          <div class="right-top flex items-center">
            <p class="name font-semibold">{{ item.name }}</p>
            <p class="time text-xs pl-1 text-gray-3">{{ switchdate(item.moment) }}</p>
          </div>
          <div class="right-mesg pt-1 w-200 text-sm whitespace-normal overflow-hidden text-ellipsis">{{ item.comment }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import TalkCard from './TalkCard.vue';
import DemoButton from './DemoButton.vue';
import { portrait } from '@/utils/data';
import { switchdate } from '@/utils/switchTime';
import { insertCommentApi, findCommentPageApi } from '@/api/index';

const store = useStore();

const props = defineProps({
  cards: {
    default: {
      like: [{ count: 0 }],
      islike: [{ count: 0 }],
      comcount: [{ count: 0 }],
    },
  },
  id: {
    default: 0,
  },
  getFlag: {
    default: false,
  },
});

const comments = ref([]);
const discuss = ref('');
const name = ref('匿名');
const page = ref(1);
const pagesize = ref(400);

const isDis = computed(() => {
  return !!(discuss.value && name.value);
});

const card = computed(() => props.cards);
const user = computed(() => store.state.user);
const getflag = computed(() => props.getFlag);

const submit = () => {
  if (isDis.value) {
    const img = Math.floor(Math.random() * 14);
    const data = {
      postId: card.value.id,
      userId: user.value.id,
      moment: new Date(),
      imgurl: img,
      comment: discuss.value,
      name: name.value,
    };
    insertCommentApi(data).then(() => {
      comments.value.unshift(data);
      card.value.comcount[0].count++;
      discuss.value = '';
    });
  }
};

const getComment = () => {
  if (page.value == 1) {
    const data = {
      page: page.value,
      pagesize: pagesize.value,
      id: card.value.id,
    };
    findCommentPageApi(data).then((res) => {
      comments.value = comments.value.concat(res.message);
    });
  }
};

watch(card, () => {
  page.value = 1;
  comments.value = [];
  getComment();
});

onMounted(() => {
  getComment();
});
</script>
<style scoped>
</style>
