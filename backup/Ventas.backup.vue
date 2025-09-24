<template>
    <v-container fluid class="pa-4">
        <!-- Menú de acciones superior -->
        <v-row class="mb-4">
            <v-toolbar>
                <template v-slot:append>
                    <div class="d-flex ga-1">
                        <v-btn color="primary" elevation="2" @click="dialogFiltro = true">Abrir</v-btn>
                        <v-btn color="success" elevation="2" @click="guardarVentas">Guardar</v-btn>
                        <v-btn color="warning" elevation="2" @click="limpiarVentas">Limpiar</v-btn>
                        <v-btn color="info" elevation="2" @click="agruparVentas">Agrupar</v-btn>

                        <v-btn color="primary" class="ml-4" elevation="2" @click="dialog = true">
                            <v-icon left>mdi-account-plus</v-icon>
                            Agregar Cliente
                        </v-btn>
                    </div>
                </template>
            </v-toolbar>
            <v-snackbar v-model="snackbar" :timeout="2000" color="success">
                Resumen actualizado ✅
                <template v-slot:actions>
                    <v-btn color="white" variant="text" @click="snackbar = false">
                        Close
                    </v-btn>
                </template>
            </v-snackbar>


            <!-- Diálogo agregar cliente -->
            <v-dialog v-model="dialog" max-width="400">
                <v-card>
                    <v-card-title>Agregar Cliente</v-card-title>
                    <v-card-text>
                        <v-text-field v-model="nuevoCliente" label="Nombre del cliente" outlined
                            :rules="[v => !!v || 'El nombre es obligatorio']" />
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="cerrarDialog">Cancelar</v-btn>
                        <v-btn text color="primary" @click="guardarCliente">Guardar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <!-- Diálogo filtro ventas -->
            <v-dialog v-model="dialogFiltro" max-width="400">
                <v-card>
                    <v-card-title>Filtrar Ventas</v-card-title>
                    <v-card-text>
                        <v-date-picker v-model="filtroFecha" />
                        <v-select v-model="filtroTipo" :items="['diaria', 'live']" label="Tipo de venta" clearable />
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="dialogFiltro = false">Cancelar</v-btn>
                        <v-btn text color="primary" @click="abrirVentasFiltradas">Abrir</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </v-row>

        <!-- Registrar Venta y Ventas Agregadas -->
        <v-row>
            <!-- Registrar Venta -->
            <v-col cols="12" md="5">
                <v-card outlined class="pa-4">
                    <v-card-title class="d-flex align-center">
                        Registrar Venta
                        <v-btn icon size="small" class="ml-2" @click="modoEdicion = !modoEdicion"
                            :color="modoEdicion ? 'warning' : 'primary'">
                            <v-icon>{{ modoEdicion ? 'mdi-check' : 'mdi-drag' }}</v-icon>
                        </v-btn>
                        <v-chip v-if="modoEdicion" size="small" color="warning" class="ml-2">
                            Modo edición
                        </v-chip>
                    </v-card-title>

                    <v-tabs v-model="tipoSeleccionado" background-color="primary" dark grow>
                        <v-tab :class="{ 'tab-activo': tipoSeleccionado === 'diaria' }" value="diaria">
                            Diaria
                        </v-tab>
                        <v-tab :class="{ 'tab-activo': tipoSeleccionado === 'live' }" value="live">
                            Live
                        </v-tab>
                    </v-tabs>

                    <v-form ref="formVenta" class="mt-4">
                        <draggable v-model="camposFormulario" :disabled="!modoEdicion" item-key="id"
                            class="campos-draggable" @start="drag = true" @end="onDragEnd">
                            <template #item="{ element: campo }">
                                <div class="campo-formulario mb-3" :class="{ 'modo-edicion': modoEdicion }">
                                    <div v-if="modoEdicion" class="d-flex align-center mb-1">
                                        <v-icon class="mr-2" color="grey">mdi-drag</v-icon>
                                        <span class="text-caption text-grey">{{ campo.label }}</span>
                                    </div>

                                    <!-- Campo Código -->
                                    <v-text-field v-if="campo.tipo === 'codigo'" :label="campo.label"
                                        v-model="nuevaVenta.codigo" :rules="[v => !!v || 'El código es obligatorio']"
                                        required />

                                    <!-- Campo Monto -->
                                    <v-number-input v-else-if="campo.tipo === 'monto'" control-variant="hidden"
                                        :label="campo.label" v-model="nuevaVenta.monto" type="number" prefix="$"
                                        :rules="[v => !!v || 'El monto es obligatorio']" required />

                                    <!-- Campo Cliente -->
                                    <v-autocomplete v-else-if="campo.tipo === 'cliente'" :label="campo.label"
                                        v-model="nuevaVenta.cliente" :items="clientesStore.clientes.map(c => c.nombre)"
                                        clearable />
                                </div>
                            </template>
                        </draggable>

                        <v-btn color="primary" class="mt-4" @click="registrarVenta">Registrar</v-btn>
                    </v-form>
                </v-card>
            </v-col>

            <!-- Ventas Agregadas -->
            <v-col cols="12" md="7">
                <v-card outlined class="pa-4 scrollable-list">
                    <v-card-title>Ventas Agregadas</v-card-title>

                    <v-list dense>
                        <v-slide-y-transition group>
                            <v-list-item class="hover-item mb-2" v-for="(Venta, index) in ventasAgregadas" :key="index">
                                <!-- Contenido principal -->
                                <template #default>
                                    <div>
                                        <v-list-item-title>
                                            <strong>{{ Venta.cliente || 'Cliente desconocido' }}</strong>
                                        </v-list-item-title>
                                        <div>
                                            <strong>{{ Venta.codigo }}</strong> |
                                            <strong>{{ formatoMoneda(Venta.monto) }}</strong> |
                                            <small>{{ Venta.tipo }} - {{ formatFecha(Venta.fecha) }}</small>
                                        </div>
                                    </div>
                                </template>

                                <!-- Botones alineados a la derecha -->
                                <template #append>
                                    <v-btn icon color="primary" @click="editarVenta(index)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn class="ml-4" icon color="error" @click="eliminarVenta(index)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </template>
                            </v-list-item>
                        </v-slide-y-transition>
                    </v-list>
                </v-card>
            </v-col>

        </v-row>

        <!-- Resumen de Ventas -->
        <v-row class="mt-4">
            <v-col cols="12">
                <v-card outlined class="pa-4">
                    <v-card-title>Resumen de Ventas</v-card-title>
                    <v-expansion-panels multiple>
                        <v-expansion-panel v-for="(resumen, index) in resumenVentas" :key="index">
                            <v-expansion-panel-title>
                                <div class="flex justify-between w-full">
                                    <span class="mr-2">{{ resumen.cliente }}</span>
                                    <span class="font-bold">{{ formatoMoneda(resumen.total) }}</span>
                                </div>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <v-textarea v-model="resumen.texto" label="Detalle para cliente" auto-grow outlined />
                                <div class="text-right mt-2">
                                    <v-btn color="primary" size="small"
                                        @click="copiarTexto(resumen.texto)">Copiar</v-btn>
                                </div>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup
    lang="ts">
    import { ref, reactive, onMounted } from 'vue'
    import { useClientesStore } from '../stores/clientesStore'
    import { db } from '../firebase'
    import { collection, addDoc, getDocs } from 'firebase/firestore'
    import draggable from 'vuedraggable'

    // const timeout = ref(2000)
    const clientesStore = useClientesStore()
    onMounted(() => { clientesStore.cargarClientes() })
    // const sectionName = ref('Ventas Nuevas')

    interface Venta {
        codigo: string
        monto: number
        cliente?: string
        tipo?: string
        fecha?: string
    }

    interface Resumen {
        cliente: string
        total: number
        ventas: Venta[]
        texto: string
    }

    const ventasAgregadas = ref<Venta[]>([])
    const resumenVentas = ref<Resumen[]>([])
    const nuevaVenta = reactive<Venta>({ codigo: '', monto: 0, cliente: '', tipo: 'diaria', fecha: '' })

    const dialog = ref(false)
    const nuevoCliente = ref('')
    const snackbar = ref(false)
    const tipoSeleccionado = ref('diaria')
    const dialogFiltro = ref(false)
    const filtroFecha = ref('')
    const filtroTipo = ref('')
    const modoEdicion = ref(false)
    const camposFormulario = ref([
        { id: 'codigo', label: 'Código', tipo: 'codigo' },
        { id: 'monto', label: 'Monto', tipo: 'monto' },
        { id: 'cliente', label: 'Cliente (opcional)', tipo: 'cliente' },
    ])
    const drag = ref(false)

    // Cargar orden personalizado de campos al iniciar
    onMounted(() => {
        const ordenGuardado = localStorage.getItem('ordenCamposVentas')
        if (ordenGuardado) {
            try {
                camposFormulario.value = JSON.parse(ordenGuardado)
            } catch (e) {
                console.log('Error al cargar orden de campos, usando orden por defecto')
            }
        }
    })

    // Guardar orden cuando cambie
    function guardarOrdenCampos() {
        localStorage.setItem('ordenCamposVentas', JSON.stringify(camposFormulario.value))
    }

    // Función que se ejecuta cuando termina el drag and drop
    function onDragEnd() {
        drag.value = false
        guardarOrdenCampos()
    }


    const formatoMoneda = (valor: number) =>
        new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(valor)

    // const formatFecha = (fecha: string) => fecha ? new Date(fecha).toLocaleDateString('es-CL') : ''
    function formatFecha(fecha?: string | Date) {
        if (!fecha) return ''
        const d = typeof fecha === 'string' ? new Date(fecha) : fecha
        return d.toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit' })
    }
    function registrarVenta() {
        if (!nuevaVenta.codigo || !nuevaVenta.monto) {
            alert('Por favor completa los campos obligatorios')
            return
        }
        ventasAgregadas.value.unshift({ ...nuevaVenta, tipo: tipoSeleccionado.value, fecha: new Date().toISOString() })
        nuevaVenta.codigo = ''
        nuevaVenta.monto = 0
        nuevaVenta.cliente = ''
    }

    function editarVenta(index: number) {
        const c = ventasAgregadas.value[index]
        nuevaVenta.codigo = c.codigo
        nuevaVenta.monto = c.monto
        nuevaVenta.cliente = c.cliente
        tipoSeleccionado.value = c.tipo || 'diaria'
        ventasAgregadas.value.splice(index, 1)
    }

    function eliminarVenta(index: number) {
        ventasAgregadas.value.splice(index, 1)
    }

    function agruparVentas() {
        const grupos: Record<string, Venta[]> = {}
        ventasAgregadas.value.forEach((c) => {
            const cliente = c.cliente || 'Cliente desconocido'
            if (!grupos[cliente]) grupos[cliente] = []
            grupos[cliente].push(c)
        })

        resumenVentas.value = Object.entries(grupos).map(([cliente, ventas]) => {
            const total = ventas.reduce((acc, c) => acc + c.monto, 0)
            const detalle = ventas.map(c => `- Código: ${c.codigo}, Monto: ${formatoMoneda(c.monto)}`).join('\n')
            const texto = `Estimado(a) ${cliente},

Este es el detalle de sus compras:

${detalle}

TOTAL: ${formatoMoneda(total)}

Por favor transferir a la siguiente cuenta: 
Nombre: Alicia Yolhet Arias Cea
Banco: Mercado Pago
Tipo de Cuenta: Vista
N° de cuenta: 1038060282
Rut: 10376458-0

¡¡Gracias!! 😊
Equipo de Menaje House`
            return { cliente, total, ventas, texto }
        })

        snackbar.value = true
    }

    function copiarTexto(texto: string) {
        navigator.clipboard.writeText(texto).then(() => {
            alert('Texto copiado al portapapeles ✅')
        })
    }

    function cerrarDialog() {
        dialog.value = false
        nuevoCliente.value = ''
    }

    function guardarCliente() {
        if (!nuevoCliente.value) return
        clientesStore.agregarCliente(nuevoCliente.value)
        nuevaVenta.cliente = nuevoCliente.value
        cerrarDialog()
    }

    function limpiarVentas() {
        ventasAgregadas.value = []
        resumenVentas.value = []
    }

    async function guardarVentas() {
        try {
            for (const venta of ventasAgregadas.value) {
                await addDoc(collection(db, "ventas"), {
                    codigo: venta.codigo,
                    monto: venta.monto,
                    cliente: venta.cliente || "Cliente desconocido",
                    tipo: venta.tipo || 'diaria',
                    fecha: venta.fecha || new Date().toISOString()
                })
            }
            alert("✅ Ventas guardadas en Firestore")
        } catch (err) {
            console.error("Error guardando ventas:", err)
            alert("❌ Ocurrió un error al guardar ventas")
        }
    }

    async function abrirVentasFiltradas() {
        try {
            ventasAgregadas.value = []
            const querySnapshot = await getDocs(collection(db, "ventas"))
            querySnapshot.forEach((doc) => {
                const data = doc.data() as Venta
                let mostrar = true

                // Filtrar por fecha si hay seleccionada
                if (filtroFecha) {
                    const ventaFecha = new Date(data.fecha || '').toLocaleDateString('es-CL')
                    const filtro = new Date(filtroFecha.value).toLocaleDateString('es-CL')
                    if (ventaFecha !== filtro) mostrar = false
                }

                // Filtrar por tipo si hay seleccionado
                if (filtroTipo && data.tipo !== filtroTipo.value) {
                    mostrar = false
                }

                if (mostrar) ventasAgregadas.value.push(data)
            })
            dialogFiltro.value = false
            // alert("📂 Ventas cargadas desde Firestore")
        } catch (err) {
            console.error("Error abriendo ventas:", err)
            alert("❌ Error cargando ventas")
        }
    }

</script>

<style scoped>
.scrollable-list {
    max-height: 400px;
    overflow-y: auto;
}

.hover-item {
    transition: background-color 0.2s ease;
    border-radius: 8px;
}

.hover-item:hover {
    background-color: #e0e0e0;
}

.tab-activo {
    background-color: #673ab7;
    /* color que quieras */
    border-radius: 8px;
    color: white !important;
}

.campos-draggable {
    min-height: 50px;
}

.campo-formulario {
    transition: all 0.3s ease;
    border-radius: 8px;
    padding: 8px;
}

.campo-formulario.modo-edicion {
    background-color: #f5f5f5;
    border: 2px dashed #e0e0e0;
    cursor: grab;
}

.campo-formulario.modo-edicion:hover {
    background-color: #e8f5e8;
    border-color: #4caf50;
}

.campo-formulario.modo-edicion:active {
    cursor: grabbing;
}

.sortable-ghost {
    opacity: 0.5;
    background-color: #e3f2fd !important;
    border: 2px dashed #2196f3 !important;
}

.sortable-chosen {
    background-color: #fff3e0 !important;
    border: 2px solid #ff9800 !important;
}
</style>
