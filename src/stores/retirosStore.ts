// stores/retirosStore.ts
import { defineStore } from 'pinia';
import { collection, addDoc, getDocs, doc, updateDoc, query, where, orderBy, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
// import { useVentasStore } from './ventasStores';
import { useClientesStore } from './clientesStore';

export interface Retiro {
    id?: string;
    ventaId: string;
    clienteId: string;
    monto: number;
    estado: 'pendiente' | 'completado' | 'cancelado';
    fecha: string;
    retiradoPor?: string;
    fechaRetiro?: string;
    modoPago?: string;
    clienteNombre?: string;
    codigoVenta?: string;
    tipoVenta?: string;
}

export const useRetirosStore = defineStore('retiros', {
    state: () => ({
        retiros: [] as Retiro[]
    }),
    actions: {
        async cargarRetirosDelMes() {
            try {
                // Obtenemos el primer y último día del mes actual como objetos de tipo Date
                const hoy = new Date();
                const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
                const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

                // CORRECCIÓN: La consulta ahora compara cadenas de texto (ISO Strings)
                const retirosQuery = query(
                    collection(db, 'retiros'),
                    where('fecha', '>=', primerDiaMes.toISOString()),
                    where('fecha', '<=', ultimoDiaMes.toISOString()),
                    orderBy('fecha')
                );
                const snapshot = await getDocs(retirosQuery);
                // ESTA LÍNEA ES CRUCIAL
                console.log("Documentos leídos:", snapshot.docs.map(doc => doc.data()));

                // const snapshot = await getDocs(retirosQuery);
                const retirosTemp: Retiro[] = [];
                const clientesStore = useClientesStore();
                // const ventasStore = useVentasStore();

                console.log(snapshot.docs);
                for (const docSnap of snapshot.docs) {
                    const data = docSnap.data() as Retiro;
                    const cliente = clientesStore.clientes.find(c => c.id === data.clienteId);

                    const ventaDoc = await getDoc(doc(db, 'ventas', data.ventaId));
                    const ventaData = ventaDoc.exists() ? ventaDoc.data() : {};
                    const codigoVenta = ventaData.codigo || 'N/A';
                    const tipoVenta = ventaData.tipo || 'N/A';

                    retirosTemp.push({
                        id: docSnap.id,
                        ...data,
                        clienteNombre: cliente ? cliente.nombre : 'Desconocido',
                        codigoVenta: codigoVenta,
                        tipoVenta: tipoVenta,
                    });
                }
                this.retiros = retirosTemp;

            } catch (error) {
                console.error("Error al cargar retiros:", error);
                throw error;
            }
        },

        async procesarRetiro(retiroId: string, data: { retiradoPor: string }) {
            try {
                const docRef = doc(db, 'retiros', retiroId);
                await updateDoc(docRef, {
                    ...data,
                    estado: 'completado',
                    fechaRetiro: new Date().toISOString()
                });
                console.log("✅ Retiro procesado exitosamente");
                const index = this.retiros.findIndex(r => r.id === retiroId);
                if (index !== -1) {
                    this.retiros[index].estado = 'completado';
                    this.retiros[index].retiradoPor = data.retiradoPor;
                    // this.retiros[index].modoPago = data.modoPago;
                    this.retiros[index].fechaRetiro = new Date().toISOString();
                }
            } catch (error) {
                console.error("❌ Error al procesar retiro:", error);
                throw error;
            }
        },

        async agregarRetiro(retiro: Omit<Retiro, 'id'>) {
            try {
                const docRef = await addDoc(collection(db, 'retiros'), retiro);
                this.retiros.unshift({ ...retiro, id: docRef.id });
                console.log("✅ Retiro pendiente creado");
            } catch (error) {
                console.error("❌ Error al crear retiro:", error);
                throw error;
            }
        }
    }
});