<template>
    <v-app-bar color="primary" dark app>
        <v-toolbar-title class="d-flex align-center">
            <v-img src="../assets/logo.png" max-width="40" class="mr-2" />
            <span>{{ sectionName }}</span>s
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-menu offset-y>
            <template #activator="{ props }">
                <v-avatar v-bind="props" size="40" class="cursor-pointer">
                    <v-img :src="avatar" />
                </v-avatar>
            </template>
            <v-list>
                <v-list-item @click="changeAvatar">Cambiar foto</v-list-item>
                <v-list-item @click="changePassword">Cambiar contraseña</v-list-item>
                <v-list-item @click="logout">Cerrar sesión</v-list-item>
            </v-list>
        </v-menu>
    </v-app-bar>
</template>

<script setup
    lang="ts">
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { signOut } from 'firebase/auth'
    import { auth } from '../firebase'
    const sectionName = ref('Dashboard')
    const avatar = ref('/default-avatar.png')
    const router = useRouter()

    const changeAvatar = () => alert('Funcionalidad cambiar avatar')
    const changePassword = () => alert('Funcionalidad cambiar contraseña')
    const logout = async () => {
        await signOut(auth)
        router.push('/')
    }
    defineProps<{ sectionName: string }>()

</script>
