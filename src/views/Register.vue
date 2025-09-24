<template>
    <v-app>
        <v-main>
            <v-container class="d-flex align-center justify-center" style="height: 100vh;">
                <v-card class="pa-6" max-width="400">
                    <h2 class="text-center mb-4">Crear Cuenta</h2>
                    <v-text-field v-model="email" label="Correo electrónico" type="email" outlined dense />
                    <v-text-field v-model="password" label="Contraseña" type="password" outlined dense />
                    <v-btn block color="primary" class="mt-4" @click="register" :loading="loading">
                        Registrarse
                    </v-btn>
                    <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
                </v-card>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup
    lang="ts">
    import { ref } from 'vue'
    import { createUserWithEmailAndPassword } from 'firebase/auth'
    import { auth } from '../firebase'

    const email = ref('')
    const password = ref('')
    const error = ref<string | null>(null)
    const loading = ref(false)

    const register = async () => {
        error.value = null
        loading.value = true
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
            console.log("Usuario creado:", userCredential.user)
            alert("✅ Cuenta creada con: " + userCredential.user.email)
        } catch (err: any) {
            error.value = "Error: " + err.message
        } finally {
            loading.value = false
        }
    }
</script>
