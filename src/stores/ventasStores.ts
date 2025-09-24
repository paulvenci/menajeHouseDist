import { defineStore } from 'pinia'
import { collection, addDoc, getDocs, doc, orderBy, query, where, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

interface Venta {
    id?: string
    codigo: string
    monto: number
    cliente?: string
    tipo?: string
    fecha?: string
    modoPago?: string
}

export const useVentasStore = defineStore('ventas', {
    state: () => ({
        ventas: [] as Venta[]
    }),
    actions: {
        async cargarVentas() {
            const snapshot = await getDocs(collection(db, 'ventas'))
            this.ventas = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data()
            })) as Venta[]
        },

        async agregarVenta(venta: Venta) {
            const docRef = await addDoc(collection(db, 'ventas'), venta)
            this.ventas.unshift({ ...venta, id: docRef.id })
        },

        async eliminarVenta(id: string) {
            await deleteDoc(doc(db, 'ventas', id))
            this.ventas = this.ventas.filter((v) => v.id !== id)
        },

        async actualizarVenta(id: string, data: Partial<Venta>) {
            await updateDoc(doc(db, 'ventas', id), data)
            const index = this.ventas.findIndex((v) => v.id === id)
            if (index !== -1) {
                this.ventas[index] = { ...this.ventas[index], ...data }
            }
        },

        async cargarVentasMensuales() {
            try {
                const hoy = new Date();
                const primerDiaAnio = new Date(hoy.getFullYear(), 0, 1);
                const ultimoDiaAnio = new Date(hoy.getFullYear(), 11, 31);

                const ventasQuery = query(
                    collection(db, 'ventas'),
                    where('fecha', '>=', primerDiaAnio.toISOString()),
                    where('fecha', '<=', ultimoDiaAnio.toISOString())
                );

                const snapshot = await getDocs(ventasQuery);
                const ventasPorMes: { [key: number]: number } = {};

                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    const fecha = new Date(data.fecha);
                    const mes = fecha.getMonth(); // 0 = Enero, 1 = Febrero, etc.

                    ventasPorMes[mes] = (ventasPorMes[mes] || 0) + data.monto;
                });

                return ventasPorMes; // Retorna los datos agregados
            } catch (error) {
                console.error("Error al cargar ventas mensuales:", error);
                return {};
            }
        },
        // Acción para cargar ventas del día actual (ideal para Ventas.vue)
        async cargarVentasDelDia() {
            const hoy = new Date();
            const inicioDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).toISOString();

            const q = query(
                collection(db, 'ventas'),
                where('fecha', '>=', inicioDelDia),
                orderBy('fecha', 'desc') // Opcional, pero recomendado para mostrar las más recientes arriba
            );

            const snapshot = await getDocs(q);
            this.ventas = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data()
            })) as Venta[];
        },

        // Nueva acción para cargar todas las ventas (ideal para una nueva vista de historial)
        async cargarTodasLasVentas() {
            try {
                console.log('🔄 VentasStore: Iniciando carga de todas las ventas...');

                const q = query(
                    collection(db, 'ventas'),
                    orderBy('fecha', 'desc')
                );

                console.log('🔄 VentasStore: Ejecutando consulta a Firestore...');
                const snapshot = await getDocs(q);

                console.log('📊 VentasStore: Documentos obtenidos:', snapshot.size);

                this.ventas = snapshot.docs.map((docSnap) => {
                    const data = docSnap.data();
                    console.log('📄 Documento:', docSnap.id, data);
                    return {
                        id: docSnap.id,
                        ...data
                    };
                }) as Venta[];

                console.log('✅ VentasStore: Ventas cargadas exitosamente:', this.ventas.length);

            } catch (error) {
                console.error('❌ VentasStore: Error al cargar todas las ventas:', error);

                // Manejo seguro del error para TypeScript
                const errorDetails = error instanceof Error ? {
                    message: error.message,
                    stack: error.stack
                } : {
                    message: String(error),
                    stack: 'No disponible'
                };

                console.error('❌ Detalles del error:', errorDetails);
                throw error; // Re-lanzar el error para que lo maneje el componente
            }
        },
    }
})