<template>
  <div class="auto-play w-full h-[575px] bg-white">
    <div class="auto-play-toolbar flex items-center gap-10px p-10px-20px bg-gray-100">
      <span>隐藏导航栏：</span>
      <xwButton :value="hideNavBar" @change="handleHideNavBarChange" />
      <el-select v-model="currentSong" placeholder="选择曲目" class="ml-4 w-32">
        <el-option label="晴天" value="qingTian" />
        <el-option label="两只老虎" value="twoTigers" />
        <el-option label="AI Dream" value="aiDream" />
      </el-select>
      <el-button type="primary" @click="togglePlay" class="ml-4">
        {{ isPlaying ? '停止' : '播放' }}
      </el-button>
    </div>
    <PanelsMain />
    <NoteBar />
    <PianoFooter />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import PianoFooter from '@/components/PianoFooter.vue';
import NoteBar from '@/components/PianoComponets/piano_src/piano_components/NoteBar/NoteBar.vue';
import PanelsMain from '@/components/PianoComponets/piano_src/piano_components/Setting/PanelsMain.vue';
import { resize } from '../components/PianoComponets/piano_src/piano_components/size';
import xwButton from '../components/PianoComponets/piano_src/piano_components/Setting/comp/xw-switch.vue';
import { noteOn, noteOff } from '@/components/PianoComponets/piano_src/piano_components/midi/xiwnn-midi/index';
import { keypress } from '@/components/PianoComponets/piano_src/piano_components/Footer/piano-control';

const store = useStore();

const hideNavBar = computed(() => store.state.hideNavBar);
const isPlaying = ref(false);
const currentSong = ref('qingTian');
let playTimer = null;
let playNotes = [];

const songData = {
  qingTian: [
    { key: 60, time: 0, duration: 400 },
    { key: 62, time: 400, duration: 400 },
    { key: 64, time: 800, duration: 400 },
    { key: 65, time: 1200, duration: 400 },
    { key: 67, time: 1600, duration: 400 },
    { key: 69, time: 2000, duration: 400 },
    { key: 67, time: 2400, duration: 400 },
    { key: 65, time: 2800, duration: 400 },
    { key: 64, time: 3200, duration: 400 },
    { key: 62, time: 3600, duration: 400 },
    { key: 60, time: 4000, duration: 400 },
    { key: 64, time: 4400, duration: 400 },
    { key: 65, time: 4800, duration: 400 },
    { key: 67, time: 5200, duration: 400 },
    { key: 69, time: 5600, duration: 400 },
    { key: 67, time: 6000, duration: 400 },
    { key: 65, time: 6400, duration: 400 },
    { key: 64, time: 6800, duration: 400 },
    { key: 62, time: 7200, duration: 400 },
    { key: 60, time: 7600, duration: 400 },
    { key: 65, time: 8000, duration: 400 },
    { key: 64, time: 8400, duration: 400 },
    { key: 62, time: 8800, duration: 400 },
    { key: 60, time: 9200, duration: 400 },
    { key: 62, time: 9600, duration: 400 },
    { key: 64, time: 10000, duration: 400 },
    { key: 60, time: 10400, duration: 400 },
    { key: 62, time: 10800, duration: 400 },
    { key: 65, time: 11200, duration: 400 },
    { key: 64, time: 11600, duration: 400 },
    { key: 62, time: 12000, duration: 400 },
    { key: 60, time: 12400, duration: 400 },
  ],
  twoTigers: [
    { key: 60, time: 0, duration: 300 },
    { key: 62, time: 300, duration: 300 },
    { key: 64, time: 600, duration: 300 },
    { key: 60, time: 900, duration: 300 },
    { key: 60, time: 1200, duration: 300 },
    { key: 62, time: 1500, duration: 300 },
    { key: 64, time: 1800, duration: 300 },
    { key: 60, time: 2100, duration: 300 },
    { key: 64, time: 2400, duration: 300 },
    { key: 65, time: 2700, duration: 300 },
    { key: 67, time: 3000, duration: 300 },
    { key: 64, time: 3300, duration: 300 },
    { key: 64, time: 3600, duration: 300 },
    { key: 65, time: 3900, duration: 300 },
    { key: 67, time: 4200, duration: 300 },
    { key: 64, time: 4500, duration: 300 },
    { key: 67, time: 4800, duration: 300 },
    { key: 69, time: 5100, duration: 300 },
    { key: 67, time: 5400, duration: 300 },
    { key: 65, time: 5700, duration: 300 },
    { key: 64, time: 6000, duration: 300 },
    { key: 62, time: 6300, duration: 300 },
    { key: 60, time: 6600, duration: 300 },
    { key: 67, time: 6900, duration: 300 },
    { key: 65, time: 7200, duration: 300 },
    { key: 64, time: 7500, duration: 300 },
    { key: 62, time: 7800, duration: 300 },
    { key: 60, time: 8100, duration: 300 },
    { key: 62, time: 8400, duration: 300 },
    { key: 64, time: 8700, duration: 300 },
    { key: 60, time: 9000, duration: 300 },
    { key: 62, time: 9300, duration: 300 },
    { key: 64, time: 9600, duration: 300 },
    { key: 60, time: 9900, duration: 300 },
    { key: 60, time: 10200, duration: 300 },
    { key: 62, time: 10500, duration: 300 },
    { key: 64, time: 10800, duration: 300 },
    { key: 60, time: 11100, duration: 300 },
    { key: 60, time: 11400, duration: 300 },
    { key: 62, time: 11700, duration: 300 },
    { key: 64, time: 12000, duration: 300 },
    { key: 60, time: 12300, duration: 300 },
    { key: 64, time: 12600, duration: 300 },
    { key: 65, time: 12900, duration: 300 },
    { key: 67, time: 13200, duration: 300 },
    { key: 64, time: 13500, duration: 300 },
    { key: 64, time: 13800, duration: 300 },
    { key: 65, time: 14100, duration: 300 },
    { key: 67, time: 14400, duration: 300 },
    { key: 64, time: 14700, duration: 300 },
    { key: 67, time: 15000, duration: 300 },
    { key: 69, time: 15300, duration: 300 },
    { key: 67, time: 15600, duration: 300 },
    { key: 65, time: 15900, duration: 300 },
    { key: 64, time: 16200, duration: 300 },
    { key: 62, time: 16500, duration: 300 },
    { key: 60, time: 16800, duration: 300 },
    { key: 67, time: 17100, duration: 300 },
    { key: 65, time: 17400, duration: 300 },
    { key: 64, time: 17700, duration: 300 },
    { key: 62, time: 18000, duration: 300 },
    { key: 60, time: 18300, duration: 300 },
    { key: 62, time: 18600, duration: 300 },
    { key: 64, time: 18900, duration: 300 },
    { key: 60, time: 19200, duration: 300 },
  ],
  aiDream: [
    { key: 72, time: 0, duration: 600 },
    { key: 74, time: 600, duration: 300 },
    { key: 75, time: 900, duration: 300 },
    { key: 77, time: 1200, duration: 600 },
    { key: 76, time: 1800, duration: 300 },
    { key: 75, time: 2100, duration: 300 },
    { key: 74, time: 2400, duration: 300 },
    { key: 72, time: 2700, duration: 300 },
    { key: 72, time: 3000, duration: 300 },
    { key: 75, time: 3300, duration: 300 },
    { key: 74, time: 3600, duration: 300 },
    { key: 72, time: 3900, duration: 600 },
    { key: 69, time: 4500, duration: 600 },
    { key: 71, time: 5100, duration: 300 },
    { key: 72, time: 5400, duration: 300 },
    { key: 74, time: 5700, duration: 300 },
    { key: 75, time: 6000, duration: 300 },
    { key: 74, time: 6300, duration: 300 },
    { key: 72, time: 6600, duration: 300 },
    { key: 71, time: 6900, duration: 300 },
    { key: 69, time: 7200, duration: 600 },
    { key: 72, time: 7800, duration: 600 },
    { key: 76, time: 8400, duration: 300 },
    { key: 75, time: 8700, duration: 300 },
    { key: 74, time: 9000, duration: 300 },
    { key: 72, time: 9300, duration: 300 },
    { key: 71, time: 9600, duration: 300 },
    { key: 69, time: 9900, duration: 300 },
    { key: 67, time: 10200, duration: 600 },
    { key: 67, time: 10800, duration: 300 },
    { key: 69, time: 11100, duration: 300 },
    { key: 71, time: 11400, duration: 300 },
    { key: 72, time: 11700, duration: 600 },
    { key: 74, time: 12300, duration: 300 },
    { key: 75, time: 12600, duration: 300 },
    { key: 76, time: 12900, duration: 300 },
    { key: 79, time: 13200, duration: 300 },
    { key: 78, time: 13500, duration: 300 },
    { key: 77, time: 13800, duration: 300 },
    { key: 76, time: 14100, duration: 300 },
    { key: 75, time: 14400, duration: 600 },
    { key: 74, time: 15000, duration: 600 },
    { key: 72, time: 15600, duration: 600 },
    { key: 69, time: 16200, duration: 600 },
    { key: 67, time: 16800, duration: 600 },
    { key: 69, time: 17400, duration: 300 },
    { key: 72, time: 17700, duration: 300 },
    { key: 74, time: 18000, duration: 300 },
    { key: 75, time: 18300, duration: 300 },
    { key: 76, time: 18600, duration: 300 },
    { key: 77, time: 18900, duration: 300 },
    { key: 79, time: 19200, duration: 300 },
    { key: 80, time: 19500, duration: 300 },
    { key: 79, time: 19800, duration: 300 },
    { key: 77, time: 20100, duration: 300 },
    { key: 76, time: 20400, duration: 300 },
    { key: 75, time: 20700, duration: 300 },
    { key: 74, time: 21000, duration: 300 },
    { key: 72, time: 21300, duration: 600 },
    { key: 72, time: 21900, duration: 600 },
    { key: 74, time: 22500, duration: 300 },
    { key: 75, time: 22800, duration: 300 },
    { key: 76, time: 23100, duration: 300 },
    { key: 75, time: 23400, duration: 300 },
    { key: 74, time: 23700, duration: 300 },
    { key: 72, time: 24000, duration: 300 },
    { key: 71, time: 24300, duration: 600 },
    { key: 72, time: 24900, duration: 600 },
    { key: 74, time: 25500, duration: 300 },
    { key: 75, time: 25800, duration: 300 },
    { key: 77, time: 26100, duration: 600 },
    { key: 76, time: 26700, duration: 300 },
    { key: 75, time: 27000, duration: 300 },
    { key: 74, time: 27300, duration: 300 },
    { key: 72, time: 27600, duration: 600 },
    { key: 69, time: 28200, duration: 1200 },
    { key: 72, time: 29400, duration: 600 },
    { key: 76, time: 30000, duration: 600 },
    { key: 75, time: 30600, duration: 300 },
    { key: 74, time: 30900, duration: 300 },
    { key: 72, time: 31200, duration: 300 },
    { key: 71, time: 31500, duration: 300 },
    { key: 69, time: 31800, duration: 600 },
    { key: 67, time: 32400, duration: 600 },
    { key: 69, time: 33000, duration: 300 },
    { key: 72, time: 33300, duration: 300 },
    { key: 74, time: 33600, duration: 300 },
    { key: 75, time: 33900, duration: 300 },
    { key: 74, time: 34200, duration: 300 },
    { key: 72, time: 34500, duration: 300 },
    { key: 71, time: 34800, duration: 300 },
    { key: 69, time: 35100, duration: 600 },
    { key: 67, time: 35700, duration: 600 },
    { key: 64, time: 36300, duration: 600 },
    { key: 67, time: 36900, duration: 300 },
    { key: 69, time: 37200, duration: 300 },
    { key: 71, time: 37500, duration: 300 },
    { key: 72, time: 37800, duration: 900 },
    { key: 71, time: 38700, duration: 300 },
    { key: 69, time: 39000, duration: 300 },
    { key: 67, time: 39300, duration: 300 },
    { key: 69, time: 39600, duration: 300 },
    { key: 71, time: 39900, duration: 300 },
    { key: 72, time: 40200, duration: 900 },
    { key: 72, time: 41100, duration: 600 },
    { key: 69, time: 41700, duration: 600 },
    { key: 67, time: 42300, duration: 600 },
    { key: 64, time: 42900, duration: 1200 },
  ],
};

const handleHideNavBarChange = (newValue) => {
  store.commit('setData', { hideNavBar: newValue });
  setTimeout(() => resize(), 0);
};

const togglePlay = () => {
  if (isPlaying.value) {
    stopPlay();
  } else {
    startPlay();
  }
};

const startPlay = () => {
  isPlaying.value = true;
  playNotes = songData[currentSong.value];
  let currentIndex = 0;
  const startTime = Date.now();
  
  const scheduleNote = () => {
    if (!isPlaying.value || currentIndex >= playNotes.length) {
      if (currentIndex >= playNotes.length) {
        isPlaying.value = false;
      }
      return;
    }
    
    const note = playNotes[currentIndex];
    const elapsed = Date.now() - startTime;
    
    if (elapsed >= note.time) {
      noteOn([note.key]);
      keypress.down([note.key], false, 0);
      
      setTimeout(() => {
        noteOff([note.key]);
        keypress.up([note.key], 0);
      }, note.duration);
      
      currentIndex++;
    }
    
    playTimer = requestAnimationFrame(scheduleNote);
  };
  
  scheduleNote();
};

const stopPlay = () => {
  isPlaying.value = false;
  if (playTimer) {
    cancelAnimationFrame(playTimer);
    playTimer = null;
  }
};
</script>

<style lang="less" scoped>
</style>
