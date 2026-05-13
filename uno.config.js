import { defineConfig, presetUno, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
  ],
  theme: {
    colors: {
      primary: '#1f7ac9',
      link: '#1890ff',
      success: '#22BF87',
      warning: '#F67770',
      error: '#F35248',
      like: '#ef4444',
      gray: {
        0: '#202020',
        1: '#202020',
        2: '#585858',
        3: '#949494',
        9: '#F6F6F8',
        10: '#ffffff',
      },
    },
    fontSize: {
      'xs': '12px',
      'sm': '14px',
      'base': '16px',
    },
    spacing: {
      '1': '4px',
      '2': '8px',
      '3': '12px',
      '5': '20px',
    },
  },
})
