

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: [
    '@pinia/nuxt',
    '@unocss/nuxt'
  ],
  css: [
    "~/node_modules/bootstrap/dist/css/bootstrap.min.css"
  ],
  app: {
    head: {
      script: [
        {src: "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js", defer: true},
        {src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js", defer: true}
      ]
    },
    pageTransition: {name: "page", "mode": "in-out"}
  },
  imports: {
    dirs: ['resources']
  },
  components: [
    '~/components',
    '~/components/modals',
    '~/components/layout'
  ]
})
