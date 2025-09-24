<script setup
    lang="ts">
    import { ref, computed } from 'vue';
    // import { useClientesStore } from '../stores/clientesStore';
    import { useRetirosStore } from '../stores/retirosStore';
    import RetiroDialog from './RetiroDialog.vue'; // Tendrás que crear este componente
    import type { Retiro } from '../stores/retirosStore';
    // Props
    const props = defineProps<{
        withdrawals: Retiro[];
        loading: boolean;
    }>();

    // Stores
    // const clientesStore = useClientesStore();
    const retirosStore = useRetirosStore();

    // Estado del diálogo
    const dialog = ref(false);
    const selectedRetiro = ref<Retiro | null>(null);

    // Encabezados de la tabla
    const headers = ref([
        { title: 'Fecha Venta', key: 'fecha' },
        { title: 'Cliente', key: 'cliente' },
        { title: 'Código Venta', key: 'codigoVenta' },
        { title: 'Monto Venta', key: 'monto' },
        { title: 'Estado', key: 'estado' },
        { title: 'Retirado Por', key: 'retiradoPor' },
        { title: 'Fecha Retiro', key: 'fechaRetiro' },

    ]);

    // Ordenar los retiros por fecha y cliente
    const sortedWithdrawals = computed(() => {
        return [...props.withdrawals].sort((a, b) => {
            const dateA = new Date(a.fecha).getTime();
            const dateB = new Date(b.fecha).getTime();
            if (dateA !== dateB) {
                return dateA - dateB;
            }
            return (a.clienteNombre || '').localeCompare(b.clienteNombre || '');
        });
    });

    // Abrir el diálogo para procesar un retiro
    const openDialog = (item: Retiro) => {
        selectedRetiro.value = item;
        dialog.value = true;
    };

    // Cerrar el diálogo
    const closeDialog = () => {
        dialog.value = false;
        selectedRetiro.value = null;
    };
</script>
<style scoped>
.v-data-table.hover-effect :deep(.v-data-table__tr):hover {
    background-color: #f5f5f5;
    /* Un color de fondo claro al pasar el mouse */
    cursor: pointer;
    /* Muestra un cursor de puntero para indicar que es clickeable */
    transition: background-color 0.2s ease-in-out;
    /* Transición suave solo para el color */
}

/* Opcional: Estilo para las filas al hacer clic */
.v-data-table.hover-effect :deep(.v-data-table__tr.v-data-table__tr--active) {
    background-color: #e0e0e0;
    /* Color al seleccionar la fila */
}
</style>
<template>
    <v-container fluid>
        <v-card elevation="2">
            <v-card-title class="d-flex align-center">
                Listado de Retiros del Mes
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" prepend-icon="mdi-refresh"
                    @click="retirosStore.cargarRetirosDelMes()">
                    Actualizar
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-data-table :headers="headers" :items="sortedWithdrawals" :loading="loading"
                    no-data-text="No hay retiros registrados este mes" class="elevation-1 hover-effect" item-key="id"
                    @click:row="(_: any, { item }: { item: Retiro }) => openDialog(item)">
                    <template v-slot:item.fecha="{ item }">
                        {{ new Date(item.fecha).toLocaleDateString('es-CL', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }) }}
                    </template>
                    <template v-slot:item.estado="{ item }">
                        <v-chip :color="item.estado === 'pendiente' ? 'orange' : 'green'">
                            {{ item.estado === 'pendiente' ? 'Pendiente' : 'Retirado' }}
                        </v-chip>
                    </template>
                    <template v-slot:item.fechaRetiro="{ item }">
                        {{ item.fechaRetiro ? new Date(item.fechaRetiro).toLocaleDateString('es-CL', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }) : 'Sin Fecha' }}
                    </template>
                    <template v-slot:item.monto="{ item }">
                        ${{ item.monto.toLocaleString('es-CL') }}
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>

    <RetiroDialog :visible="dialog" :retiro="selectedRetiro" @update:visible="closeDialog" />
</template>