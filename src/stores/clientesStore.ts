import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'

export const useClientesStore = defineStore('clientes', () => {
    const clientes = ref<{ id: string, nombre: string, email: string, telefono: string }[]>([])

    // Cargar clientes desde Firestore
    async function cargarClientes() {
        clientes.value = []
        const snapshot = await getDocs(collection(db, 'clientes'))
        snapshot.forEach((docItem) => {
            clientes.value.push({ id: docItem.id, nombre: docItem.data().nombre, email: docItem.data().email, telefono: docItem.data().telefono })
        })
    }

    // Agregar cliente a Firestore
    async function agregarCliente(nombre: string, email: string, telefono: string) {
        const docRef = await addDoc(collection(db, 'clientes'), { nombre, email, telefono })
        clientes.value.push({ id: docRef.id, nombre, email, telefono })
    }

    // Actualizar cliente
    async function actualizarCliente(id: string, nombre: string, email: string, telefono: string) {
        await updateDoc(doc(db, 'clientes', id), { nombre, email, telefono })
        const index = clientes.value.findIndex(c => c.id === id)
        if (index !== -1) {
            clientes.value[index] = { id, nombre, email, telefono }
        }
    }

    // Eliminar cliente
    async function eliminarCliente(id: string) {
        await deleteDoc(doc(db, 'clientes', id))
        clientes.value = clientes.value.filter(c => c.id !== id)
    }

    return { clientes, cargarClientes, agregarCliente, actualizarCliente, eliminarCliente }
})
