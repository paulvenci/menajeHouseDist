import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/lib/styles/main.sass'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Autenticacion
import { initAuthGuard } from './authGuard'
initAuthGuard(() => {
    createApp(App).use(vuetify).use(router).mount('#app')
})
import { createPinia } from 'pinia'

const pinia = createPinia()

// Router
import { router } from './router'

// Iconos (opcional: Material Design Icons)
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
    components,
    directives,
})

createApp(App)
    .use(vuetify)
    .use(router)
    .use(pinia)
    .mount('#app')
