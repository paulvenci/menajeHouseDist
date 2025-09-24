<template>
    <v-container fluid class="pa-4 pa-md-6">
        <div class="barra-fija">
            <v-card elevation="3" class="barra-combinada">
                <!-- Versión móvil -->
                <div class="d-flex d-md-none flex-column pa-3" style="gap: 12px;">
                    <div class="d-flex justify-space-between align-center">
                        <v-btn color="primary" variant="tonal" prepend-icon="mdi-account-plus" @click="dialog = true"
                            class="text-none" size="small">
                            Nuevo Cliente
                        </v-btn>
                        <v-btn icon="mdi-magnify" variant="text" @click="mostrarBuscador = !mostrarBuscador">
                        </v-btn>
                    </div>
                    <v-text-field v-if="mostrarBuscador" v-model="filtro" label="Buscar Cliente" variant="outlined"
                        density="comfortable" prepend-inner-icon="mdi-magnify" clearable hide-details></v-text-field>
                </div>

                <!-- Versión desktop -->
                <div class="d-none d-md-flex align-center justify-space-between pa-md-4 " style="height: 70px">
                    <div class=" d-flex align-center" style="width: 200px">

                        <v-btn color="primary" variant="tonal" prepend-icon="mdi-account-plus" @click="dialog = true"
                            class="text-none" size="default" block>
                            Nuevo Cliente
                        </v-btn>

                    </div>

                    <div class="d-flex align-center" style="width: 60%">
                        <v-text-field class="flex-1" v-model="filtro" label="Buscar Cliente" variant="outlined"
                            density="comfortable" prepend-inner-icon="mdi-magnify" clearable
                            hide-details></v-text-field>
                    </div>
                </div>
            </v-card>
        </div>
        <!-- Listado de clientes -->

        <v-row class="mt-4">
            <v-col v-for="cliente in clientesFiltrados" :key="cliente.id" cols="12" sm="6" md="4" lg="3">
                <v-card class="mx-auto elevation-3 contact-card">
                    <v-card-item>
                        <div class="d-flex align-center mb-2">
                            <v-avatar color="primary" class="mr-4">
                                <span class="text-h6 text-white">
                                    {{ cliente.nombre?.charAt(0).toUpperCase() || '?' }}
                                </span>
                            </v-avatar>
                            <div class="flex-grow-1">
                                <v-card-title class="text-truncate pa-0">
                                    {{ cliente.nombre }}
                                </v-card-title>
                            </div>
                            <v-menu>
                                <template v-slot:activator="{ props }">
                                    <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props">
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item @click="editarCliente(cliente)">
                                        <template v-slot:prepend>
                                            <v-icon color="primary">mdi-pencil</v-icon>
                                        </template>
                                        <v-list-item-title>Editar</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="eliminarCliente(cliente.id)" color="error">
                                        <template v-slot:prepend>
                                            <v-icon color="error">mdi-delete</v-icon>
                                        </template>
                                        <v-list-item-title>Eliminar</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                    </v-card-item>

                    <v-card-text class="pt-2">
                        <div class="d-flex align-center mb-2">
                            <v-icon size="small" color="primary" class="mr-2">
                                mdi-email
                            </v-icon>
                            <span class="text-body-2 text-medium-emphasis text-truncate">
                                {{ cliente.email }}
                            </span>
                        </div>
                        <div class="d-flex align-center">
                            <v-icon size="small" color="primary" class="mr-2">
                                mdi-phone
                            </v-icon>
                            <span class="text-body-2 text-medium-emphasis">
                                {{ cliente.telefono }}
                            </span>
                        </div>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-btn variant="text" prepend-icon="mdi-phone" block @click="llamarCliente(cliente.telefono)">
                            Llamar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>


    <!-- Modal para agregar/editar cliente -->
    <v-dialog v-model="dialog" max-width="400">
        <v-card>
            <v-card-title>{{ isEditing ? 'Editar Cliente' : 'Agregar Cliente' }}</v-card-title>
            <v-card-text>
                <v-text-field v-model="nuevoCliente.nombre" label="Nombre del cliente" outlined
                    :rules="[v => !!v || 'El nombre es obligatorio']"></v-text-field>
                <v-text-field v-model="nuevoCliente.email" label="Email del cliente" outlined
                    :rules="[v => !!v || 'El email es obligatorio']"></v-text-field>
                <v-text-field v-model="nuevoCliente.telefono" label="Teléfono del cliente" outlined
                    :rules="[v => !!v || 'El teléfono es obligatorio']"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="cerrarDialog">Cancelar</v-btn>
                <v-btn text color="primary" @click="guardarCliente">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<script setup
    lang="ts">
    import { useClientesStore } from '../stores/clientesStore'
    import { onMounted, ref, computed } from 'vue'
    // Computed property para filtrar clientes

    const filtro = ref('')
    // const sectionName = ref('Clientes')
    const clientesStore = useClientesStore()
    const dialog = ref(false)
    const isEditing = ref(false)
    const mostrarBuscador = ref(false)
    const nuevoCliente = ref({
        id: '',
        nombre: '',
        email: '',
        telefono: ''
    })

    onMounted(() => {
        clientesStore.cargarClientes()
    })

    // Computed property para filtrar clientes
    const clientesFiltrados = computed(() => {
        const busqueda = (filtro.value || '').toLowerCase()
        return clientesStore.clientes.filter(cliente =>
            (cliente.nombre?.toLowerCase()?.includes(busqueda) || '') ||
            (cliente.email?.toLowerCase()?.includes(busqueda) || '') ||
            (cliente.telefono?.toLowerCase()?.includes(busqueda) || '')
        )
    })

    // Funciones para el modal
    const cerrarDialog = () => {
        dialog.value = false
        isEditing.value = false
        nuevoCliente.value = {
            id: '',
            nombre: '',
            email: '',
            telefono: ''
        }
    }

    const guardarCliente = async () => {
        if (!nuevoCliente.value) return

        if (isEditing.value && nuevoCliente.value.id) {
            // Actualizar cliente existente
            await clientesStore.actualizarCliente(
                nuevoCliente.value.id,
                nuevoCliente.value.nombre,
                nuevoCliente.value.email,
                nuevoCliente.value.telefono
            )
        } else {
            // Agregar nuevo cliente
            await clientesStore.agregarCliente(
                nuevoCliente.value.nombre,
                nuevoCliente.value.telefono,
                nuevoCliente.value.email
            )
        }
        cerrarDialog()
    }
    const editarCliente = (cliente: any) => {
        nuevoCliente.value = { ...cliente }
        isEditing.value = true
        dialog.value = true
    }

    const eliminarCliente = async (id: string) => {
        if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            await clientesStore.eliminarCliente(id)
        }
    }

    const llamarCliente = (telefono: string) => {
        window.open(`tel:${telefono}`);
    }
</script>

<style scoped>
.barra-fija {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin: -16px -16px 16px -16px;
    padding: 8px;
}

.barra-combinada {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
    .barra-fija {
        margin: -16px -16px 12px -16px;
        padding: 12px;
    }
}

.contact-card {
    transition: transform 0.2s, box-shadow 0.2s;
    border-radius: 12px;
}

.contact-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1) !important;
}

.v-card-title {
    font-size: 1.1rem;
    font-weight: 600;
}
</style>