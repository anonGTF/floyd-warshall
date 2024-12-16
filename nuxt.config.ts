export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  imports: {
    dirs: [
      'composables/**',
      'models/**'
    ]
  },

  css: ['leaflet/dist/leaflet.css'],

  hooks: {
    "prerender:routes"({ routes }) {
      routes.clear()
    }
  },

  router: {
    options: {
      hashMode: true
    }
  },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-vuefire',
    '@nuxt/icon',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/leaflet',
    '@samk-dev/nuxt-vcalendar',
    '@pinia/nuxt'
  ],

  piniaPluginPersistedstate: {
    storage: 'localStorage',
    debug: true,
  },

  vuefire: {
    auth: {
      enabled: true
    },
    config: {
      apiKey: 'AIzaSyAte9WA1rctVlvrrjafpKV6ofWwhj00r4I',
      authDomain: 'floyd-warshall.firebaseapp.com',
      projectId: 'floyd-warshall',
      storageBucket: 'floyd-warshall.appspot.com',
      messagingSenderId: '128742027092',
      appId: '1:128742027092:web:141519a6e7900bc8c3e2c1',
      measurementId: 'G-S4TL15J43S'
    }
  }
})