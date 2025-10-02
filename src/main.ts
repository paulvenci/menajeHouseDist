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
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                dark: false,
                colors: {
                    primary: '#1976D2',
                    secondary: '#424242',
                    accent: '#82B1FF',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FB8C00',
                }
            },
            dark: {
                dark: true,
                colors: {
                    primary: '#2196F3',
                    secondary: '#424242',
                    accent: '#FF4081',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FB8C00',
                }
            }
        }
    }
})

createApp(App)
    .use(vuetify)
    .use(router)
    .use(pinia)
    .mount('#app')
