<template>
    <v-card class="bg-blue-grey-darken-4" elevation="2">
        <v-card-title class="text-white">Detalle de Compras</v-card-title>
        <v-card-text>
            <v-data-table :headers="headers" :items="filteredVentas" :loading="loading" class="bg-blue-grey-darken-3"
                item-class="text-white">
                <template v-slot:item.fecha="{ item }">
                    <span class="text-white">{{ formatDate(item.fecha) }}</span>
                </template>
                <template v-slot:item.cliente="{ item }">
                    <span class="text-white">{{ item.cliente || 'N/A' }}</span>
                </template>
                <template v-slot:item.codigo="{ item }">
                    <span class="text-white">{{ item.codigo }}</span>
                </template>
                <template v-slot:item.monto="{ item }">
                    <span class="text-white">${{ item.monto.toLocaleString('es-CL') }}</span>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    ventas: {
        type: Array,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    },
    filters: {
        type: Object,
        default: () => ({ client: 'Todos', period: 'Todo el período' })
    }
});

const headers = [
    { title: 'Fecha', key: 'fecha', width: '150px' },
    { title: 'Cliente', key: 'cliente', width: '200px' },
    { title: 'Código', key: 'codigo', width: '150px' },
    { title: 'Monto', key: 'monto', width: '150px', align: 'end' }
];

const filteredVentas = computed(() => {
    let filtered = [...props.ventas];

    // Filter by client
    if (props.filters.client !== 'Todos') {
        filtered = filtered.filter(venta => venta.cliente === props.filters.client);
    }

    // Filter by period
    if (props.filters.period !== 'Todo el período') {
        filtered = filtered.filter(venta => {
            const ventaDate = new Date(venta.fecha);
            const now = new Date();

            switch (props.filters.period) {
                case 'Hoy':
                    return ventaDate.toDateString() === now.toDateString();
                case 'Esta semana':
                    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                    return ventaDate >= weekStart;
                case 'Este mes':
                    return ventaDate.getMonth() === now.getMonth() &&
                        ventaDate.getFullYear() === now.getFullYear();
                case 'Últimos 30 días':
                    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return ventaDate >= thirtyDaysAgo;
                case 'Últimos 90 días':
                    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                    return ventaDate >= ninetyDaysAgo;
                default:
                    return true;
            }
        });
    }

    return filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
});

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};
</script>