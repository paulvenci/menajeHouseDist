<template>
    <Bar id="monthly-sales-chart" :options="chartOptions" :data="chartData" />
</template>

<script setup
    lang="ts">
    import { ref, computed } from 'vue';
    import { Bar } from 'vue-chartjs';
    import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

    const props = defineProps({
        // Las ventas agregadas por mes. El formato será { '0': 1000, '1': 2500, ... }
        monthlySales: {
            type: Object,
            required: true
        }
    });

    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const chartData = computed(() => ({
        labels: meses,
        datasets: [
            {
                label: 'Ventas (CLP)',
                backgroundColor: '#42a5f5',
                data: meses.map((_, index) => props.monthlySales[index] || 0)
            }
        ]
    }));

    const chartOptions = ref({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Ventas Mensuales del Año Actual'
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value: any) {
                        // Formato para el eje Y
                        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
                    }
                }
            }
        }
    });
</script>