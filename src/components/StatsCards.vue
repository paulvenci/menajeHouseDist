<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" sm="6" md="3">
                <v-card :loading="loading" elevation="2">
                    <v-card-item>
                        <v-card-title>Ventas Totales</v-card-title>
                        <v-card-subtitle>Total ventas, {{ mesActual }} </v-card-subtitle>
                    </v-card-item>
                    <v-card-text class="text-h4">
                        ${{ stats.totalVentas.toLocaleString('es-CL') }}
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-card :loading="loading" elevation="2">
                    <v-card-item>
                        <v-card-title>Ventas Live</v-card-title>
                        <v-card-subtitle>Total Live, {{ mesActual }}</v-card-subtitle>
                    </v-card-item>
                    <v-card-text class="text-h4">
                        ${{ stats.totalVentasLive.toLocaleString('es-CL') }}
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-card :loading="loading" elevation="2">
                    <v-card-item>
                        <v-card-title>Ventas Diarias</v-card-title>
                        <v-card-subtitle>Total Diaras, {{ mesActual }}</v-card-subtitle>
                    </v-card-item>
                    <v-card-text class="text-h4">
                        ${{ stats.totalVentasDiarias.toLocaleString('es-CL') }}
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-card :loading="loading" elevation="2">
                    <v-card-item>
                        <v-card-title># de Ventas</v-card-title>
                        <v-card-subtitle>Cantidad ventas, {{ mesActual }}</v-card-subtitle>
                    </v-card-item>
                    <v-card-text class="text-h4">
                        {{ stats.cantidadVentas }}
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup
    lang="ts">
    interface Stats {
        totalVentas: number;
        totalVentasLive: number;
        totalVentasDiarias: number;
        cantidadVentas: number;
    }
    // En tu <script setup>
    import { computed } from 'vue';

    const mesActual = computed(() => {
        // Crea un objeto de fecha para el momento actual
        const fecha = new Date();
        // Usa toLocaleDateString para obtener el nombre del mes
        return fecha.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
    });
    defineProps<{
        stats: Stats;
        loading: boolean;
    }>();
</script>