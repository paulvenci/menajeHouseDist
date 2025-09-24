<template>
    <v-container fluid>
        <v-card elevation="2">
            <v-card-title>Pagos Pendientes</v-card-title>
            <v-card-text>
                <v-data-table :headers="headers" :items="payments" :loading="loading"
                    no-data-text="No hay pagos pendientes" items-per-page-text="Pagos por página">
                    <template v-slot:item.monto="{ item }">
                        ${{ item.monto.toLocaleString('es-MX') }}
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-btn color="success" size="small" @click="approvePayment(item.id)">Marcar Pagado</v-btn>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup
    lang="ts">
    import { ref } from 'vue';
    import { doc, updateDoc } from 'firebase/firestore';
    import { db } from '../firebase';

    interface Pago {
        id: string;
        monto: number;
        estado: 'pendiente' | 'completado';
        cliente?: string;
        fecha?: any; // Idealmente, formatear este campo de tipo Timestamp
    }

    defineProps<{
        payments: Pago[];
        loading: boolean;
    }>();

    const headers = ref([
        { text: 'Cliente', value: 'cliente' },
        { text: 'Monto', value: 'monto' },
        { text: 'Fecha', value: 'fecha' },
        { text: 'Acciones', value: 'actions', sortable: false },
    ]);

    async function approvePayment(id: string) {
        try {
            const paymentRef = doc(db, 'pagos', id);
            await updateDoc(paymentRef, { estado: 'completado' });
            // Aquí podrías mostrar una notificación de éxito.
        } catch (error) {
            console.error("Error al marcar el pago:", error);
        }
    }
</script>