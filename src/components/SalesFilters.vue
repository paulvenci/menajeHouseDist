<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" md="6">
                <v-card class="bg-blue-grey-darken-4" elevation="2">
                    <v-card-item>
                        <v-card-title class="text-white">Filtro por Cliente</v-card-title>
                    </v-card-item>
                    <v-card-text>
                        <v-select v-model="selectedClient" :items="clientOptions" label="Seleccionar Cliente"
                            variant="outlined" bg-color="blue-grey-darken-3" class="text-white"></v-select>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card class="bg-blue-grey-darken-4" elevation="2">
                    <v-card-item>
                        <v-card-title class="text-white">Periodo</v-card-title>
                    </v-card-item>
                    <v-card-text>
                        <v-select v-model="selectedPeriod" :items="periodOptions" label="Seleccionar Periodo"
                            variant="outlined" bg-color="blue-grey-darken-3" class="text-white"></v-select>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    ventas: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['filter-changed']);

const selectedClient = ref('Todos');
const selectedPeriod = ref('Todo el período');

const clientOptions = computed(() => {
    const clients = [...new Set(props.ventas.map(v => v.cliente).filter(Boolean))];
    return ['Todos', ...clients];
});

const periodOptions = [
    'Todo el período',
    'Hoy',
    'Esta semana',
    'Este mes',
    'Últimos 30 días',
    'Últimos 90 días'
];

watch([selectedClient, selectedPeriod], () => {
    emit('filter-changed', {
        client: selectedClient.value,
        period: selectedPeriod.value
    });
});
</script>