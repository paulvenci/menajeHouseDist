<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" sm="6" md="3">
                <v-card class="bg-blue-grey-darken-4" elevation="2">
                    <v-card-item>
                        <v-card-title class="text-white">Total Compras</v-card-title>
                        <v-card-subtitle class="text-blue-grey-lighten-2">Cantidad total de compras</v-card-subtitle>
                    </v-card-item>
                    <v-card-text class="text-h4 text-white">
                        {{ stats.totalCompras }}
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-card class="bg-blue-grey-darken-4" elevation="2">
                    <v-card-item>
                        <v-card-title class="text-white">Monto Total Gastado</v-card-title>
                        <v-card-subtitle class="text-blue-grey-lighten-2">Suma de todos los montos</v-card-subtitle>
                    </v-card-item>
                    <v-card-text class="text-h4 text-white">
                        ${{ stats.montoTotal.toLocaleString('es-CL') }}
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-card class="bg-blue-grey-darken-4" elevation="2">
                    <v-card-item>
                        <v-card-title class="text-white">Promedio por Compra</v-card-title>
                        <v-card-subtitle class="text-blue-grey-lighten-2">Monto promedio</v-card-subtitle>
                    </v-card-item>
                    <v-card-text class="text-h4 text-white">
                        ${{ stats.promedioCompra.toLocaleString('es-CL') }}
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-card class="bg-blue-grey-darken-4" elevation="2">
                    <v-card-item>
                        <v-card-title class="text-white">N° Cliente</v-card-title>
                        <v-card-subtitle class="text-blue-grey-lighten-2">Cantidad de clientes únicos</v-card-subtitle>
                    </v-card-item>
                    <v-card-text class="text-h4 text-white">
                        {{ stats.numeroClientes }}
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const props = defineProps({
    stats: {
        type: Object,
        required: true
    }
});
</script>