// biome-ignore assist/source/organizeImports: <explanation>
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Ventas from '../views/Ventas.vue'
import Clientes from '../views/Clientes.vue'
import HistorialVentas from '../views/historialVentas.vue'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

const routes = [
    { path: '/', component: Login, meta: { layout: 'empty' } },
    { path: '/login', component: Login, meta: { layout: 'empty' } },
    { path: '/register', component: Register, meta: { layout: 'default' } },
    { path: '/dashboard', component: Dashboard, meta: { layout: 'default', section: "Dashboard", requiresAuth: true } },
    { path: '/ventas', component: Ventas, meta: { layout: 'default', section: "Ventas", requiresAuth: true } },
    { path: '/clientes', component: Clientes, meta: { layout: 'default', section: "Clientes", requiresAuth: true } },
    { path: '/historialVentas', component: HistorialVentas, meta: { layout: 'default', section: "Historial Ventas", requiresAuth: true } },

]


const router = createRouter({
    history: createWebHistory(),
    routes,
})
router.beforeEach(async (to) => {
    const requiresAuth = to.meta.requiresAuth
    await new Promise(resolve => onAuthStateChanged(auth, resolve))
    const currentUser = auth.currentUser

    if (requiresAuth && !currentUser) {
        // Redirige al login si la ruta requiere autenticación y no hay usuario
        return { path: '/' }
    } else if ((to.path === '/' || to.path === '/register') && currentUser) {
        // Redirige al dashboard si ya hay un usuario y está en la página de inicio o registro
        return { path: '/dashboard' }
    }

    // Si no hay redirección, la navegación continúa
    return true
})
// router.beforeEach((to, next) => {
//     const requiresAuth = to.meta.requiresAuth
//     const currentUser = auth.currentUser

//     if (requiresAuth && !currentUser) {
//         next('/') // Redirige al login
//     } else if ((to.path === '/' || to.path === '/register') && currentUser) {
//         next('/dashboard')
//     } else {
//         next()
//     }
// })

export { router }
