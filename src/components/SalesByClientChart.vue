<template>
    <Pie id="sales-by-client-chart" :options="chartOptions" :data="chartData" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)

const props = defineProps({
    ventas: {
        type: Array,
        required: true
    }
})

const chartData = computed(() => {
    const salesByClient = {}

    props.ventas.forEach(venta => {
        if (venta.cliente) {
            salesByClient[venta.cliente] = (salesByClient[venta.cliente] || 0) + venta.monto
        }
    })

    const clients = Object.keys(salesByClient)
    const amounts = Object.values(salesByClient)

    // Generate colors for each client
    const colors = clients.map((_, index) => {
        const hue = (index * 137.5) % 360 // Golden angle approximation for better color distribution
        return `hsl(${hue}, 70%, 50%)`
    })

    return {
        labels: clients,
        datasets: [
            {
                label: 'Ventas por Cliente',
                backgroundColor: colors,
                data: amounts,
                borderWidth: 2,
                borderColor: '#fff'
            }
        ]
    }
})

const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: 'Distribución de Ventas por Cliente',
            color: '#fff',
            font: {
                size: 16
            }
        },
        legend: {
            labels: {
                color: '#fff',
                font: {
                    size: 12
                }
            }
        },
        tooltip: {
            callbacks: {
                label: function (context) {
                    let label = context.label || ''
                    if (label) {
                        label += ': '
                    }
                    if (context.parsed !== null) {
                        label += new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(context.parsed)
                    }
                    return label
                }
            }
        }
    }
})
</script>