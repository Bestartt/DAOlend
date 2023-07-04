import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetUno,
    presetWebFonts,
  } from 'unocss'
  
  import transformerDirectives from '@unocss/transformer-directives'

  export default defineConfig({
    presets: [
      presetUno(),
      presetAttributify(),
      presetIcons({
        scale: 1.2,
        warn: true,
      }),
      presetWebFonts({
        fonts: {
          sans: 'DM Sans',
          serif: 'DM Serif Display',
          mono: 'DM Mono',
        },
      }),
    ],
    transformers: [
      transformerDirectives(),
    ]
  })
  