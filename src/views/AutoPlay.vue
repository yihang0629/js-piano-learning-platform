<template>
  <div class="auto-play w-full h-[575px] bg-white">
    <div class="auto-play-toolbar flex items-center gap-10px p-10px-20px bg-gray-100">
      <span>隐藏导航栏：</span>
      <xwButton :value="hideNavBar" @change="handleHideNavBarChange" />
    </div>
    <PanelsMain />
    <NoteBar />
    <PianoFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import PianoFooter from '@/components/PianoFooter.vue';
import NoteBar from '@/components/PianoComponets/piano_src/piano_components/NoteBar/NoteBar.vue';
import PanelsMain from '@/components/PianoComponets/piano_src/piano_components/Setting/PanelsMain.vue';
import { resize } from '../components/PianoComponets/piano_src/piano_components/size';
import xwButton from '../components/PianoComponets/piano_src/piano_components/Setting/comp/xw-switch.vue';

const store = useStore();

const hideNavBar = computed(() => store.state.hideNavBar);

const handleHideNavBarChange = (newValue) => {
  store.commit('setData', { hideNavBar: newValue });
  setTimeout(() => resize(), 0);
};
</script>

<style lang="less" scoped>
</style>
