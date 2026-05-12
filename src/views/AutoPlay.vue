<template>
  <div class="auto-play">
    <div class="auto-play-toolbar">
      <label>隐藏导航栏：</label>
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
.auto-play {
  width: 100%;
  height: 575px;
  background: white;

  .auto-play-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    background: #f5f5f5;
  }
}
</style>
