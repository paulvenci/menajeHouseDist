<template>
    <v-main>
        <StatsCards :stats="stats" :loading="loading" />
        <v-container fluid class="mt-4">
            <v-card elevation="2">
                <v-card-title>Gráfico de Ventas Mensuales</v-card-title>
                <v-card-text>
                    <MonthlySalesChart :monthly-sales="monthlySales" />
                </v-card-text>
            </v-card>
        </v-container>
        <PendingWithdrawals :withdrawals="retirosStore.retiros" :loading="loading" />
        <PendingPayments :payments="pendingPayments" :loading="loading" />

    </v-main>
</template>

<script setup
    lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue'
    import { collection, onSnapshot } from 'firebase/firestore'
    import { db } from '../firebase'
    import StatsCards from '@/components/StatsCards.vue'
    import PendingWithdrawals from '@/components/PendingWithdrawals.vue'
    import PendingPayments from '@/components/PendingPayments.vue'
    import MonthlySalesChart from '@/components/MonthlySalesChart.vue'; // Importa el nuevo componente
    import { useRetirosStore } from '../stores/retirosStore';
    // Importa el store de Pinia
    import { useClientesStore } from '../stores/clientesStore' // Asegúrate de que la ruta sea correcta
    const retirosStore = useRetirosStore();
    const clientesStore = useClientesStore();
    import { useVentasStore } from '../stores/ventasStores'; // Importa el store de ventas
    const ventasStore = useVentasStore(); // Usa el store de ventas
    const monthlySales = ref({}); // Variable para almacenar los datos del gráfico
    // Interfaces para tipar los datos de Firestore
    interface Venta {
        id: string;
        monto: number;
        tipo: 'diaria' | 'live';
        fecha: any; // Timestamp de Firestore
    }

    // Interfaces
    // interface Retiro {
    //     id: string;
    //     ventaId: string;
    //     clienteId: string;
    //     monto: number;
    //     estado: string;
    //     fecha: string;
    //     retiradoPor?: string;
    //     fechaRetiro?: string;
    //     modoPago?: string;
    //     clienteNombre?: string;
    //     codigoVenta?: string;
    // }

    interface Pago {
        id: string;
        monto: number;
        estado: 'pendiente' | 'completado';
        cliente?: string;
        fecha?: any;
    }

    interface Stats {
        totalVentas: number;
        totalVentasLive: number;
        totalVentasDiarias: number;
        cantidadVentas: number;
    }

    // Estado reactivo para almacenar los datos
    const stats = ref<Stats>({ totalVentas: 0, totalVentasLive: 0, totalVentasDiarias: 0, cantidadVentas: 0 })
    // const pendingWithdrawals = ref<Retiro[]>([])
    const pendingPayments = ref<Pago[]>([])
    const loading = ref(true)

    let unsubscribeVentas: (() => void) | undefined;
    let unsubscribePagos: (() => void) | undefined;

    // Función para obtener el inicio y fin del mes actual
    const getCurrentMonthRange = () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        return { startOfMonth, endOfMonth };
    };

    // Nos conectamos a Firestore al montar el componente
    onMounted(async () => {
        // --- Estadísticas de Ventas ---
        const ventasCol = collection(db, 'ventas');
        unsubscribeVentas = onSnapshot(ventasCol, (snapshot) => {
            const { startOfMonth, endOfMonth } = getCurrentMonthRange();
            let total = 0, totalLive = 0, totalDiaria = 0, cantidad = 0;

            snapshot.forEach(doc => {
                const venta = doc.data() as Venta;
                // Verificar si la venta tiene fecha y está en el mes actual
                if (venta.fecha) {
                    const ventaDate = venta.fecha.toDate ? venta.fecha.toDate() : new Date(venta.fecha);
                    if (ventaDate >= startOfMonth && ventaDate <= endOfMonth) {
                        total += venta.monto || 0;
                        cantidad++;
                        if (venta.tipo === 'live') totalLive += venta.monto || 0;
                        else totalDiaria += venta.monto || 0;
                    }
                }
            });
            stats.value = { totalVentas: total, totalVentasLive: totalLive, totalVentasDiarias: totalDiaria, cantidadVentas: cantidad };
            loading.value = false;
        }, (error) => console.error("Error al obtener ventas:", error));


        // --- Pagos Pendientes ---
        // const pagosQuery = query(collection(db, 'pagos'), where('estado', '==', 'pendiente'));
        // unsubscribePagos = onSnapshot(pagosQuery, (snapshot) => pendingPayments.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pago)));

        // Carga los clientes y retiros al montar el componente
        try {
            await clientesStore.cargarClientes();
            await retirosStore.cargarRetirosDelMes();
            // Carga los datos de ventas mensuales al montar el componente
            monthlySales.value = await ventasStore.cargarVentasMensuales();
        } catch (error) {
            console.error("Error al cargar datos:", error);
        } finally {
            loading.value = false;
        }

        // Estas líneas ahora son redundantes y se reemplazan por la llamada al store
        // const retirosQuery = query(collection(db, 'retiros'), where('estado', '==', 'pendiente'));
        // unsubscribeRetiros = onSnapshot(retirosQuery, (snapshot) => {
        //     pendingWithdrawals.value = snapshot.docs.map(doc => {
        //         const data = doc.data() as Retiro;
        //         const cliente = clientesStore.clientes.find(c => c.id === data.solicitadoPor);
        //         return {
        //             ...data,
        //             id: doc.id,
        //             // Usa el nombre del cliente del store
        //             solicitadoPor: cliente ? cliente.nombre : 'Desconocido'
        //         };
        //     });
        //     loading.value = false;
        // });


    })

    // Limpiamos los listeners al desmontar para evitar fugas de memoria
    onUnmounted(() => {
        unsubscribeVentas?.();
        // Ya no necesitas desuscribirte de retiros si usas la acción 'cargarRetirosDelMes'
        // unsubscribeRetiros?.();
        unsubscribePagos?.();
    });
</script>
