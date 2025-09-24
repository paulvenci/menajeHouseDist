<template>
    <v-navigation-drawer expand-on-hover permanent rail app v-model="drawer">
        <!-- Usuario -->
        <v-list>
            <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
                subtitle="sandra_a88@gmail.com" title="Sandra Adams"></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <!-- Menú -->
        <v-list density="compact" nav>
            <v-list-item v-for="item in menuItems" :title="item.title" :prepend-icon="item.icon" :key="item.value"
                @click="selectItem(item)">

            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup
    lang="ts">
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'

    const drawer = ref(true)
    const selected = ref('dashboard')
    const router = useRouter()

    const menuItems = [
        { title: 'Dashboard', value: 'dashboard', icon: 'mdi-view-dashboard', route: '/' },
        { title: 'Ventas', value: 'ventas', icon: 'mdi-cart', route: '/ventas' },
        { title: 'Clientes', value: 'clientes', icon: 'mdi-account', route: '/clientes' },
        { title: 'Historial Ventas', value: 'historialVenta', icon: 'mdi-chart-bar', route: '/historialVentas' }


    ]

    const selectItem = (item: any) => {
        selected.value = item.value
        router.push(item.route)
    }
</script>
