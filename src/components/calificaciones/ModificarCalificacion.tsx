// src/components/ModificarCalificacionForm.tsx
import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import CalificacionService from '../../Service/CalificacionService';
import EditarCalificacionForm from './Pasos/EditarCalificacionForm';

// *** Importar Servicio y Componente de Edición ***

// Interfaz para un registro de calificación (basado en la tabla)
interface Calificacion {
    idCalificacion: number;
    calificacionEspecifica: number;
    fechaCaptura: string;
    indicadorA: number; 
    indicadorB: number; 
    indicadorC: number; 
    indicadorD: number; 
    indicadorE: number; 
    indicadorF: number; 
    idActividad: number;
    idAlumno: number;
    // Agrega aquí todas las propiedades de tu objeto Calificacion
}

export default function ModificarCalificacion() {
    const toast = useRef<any>(null);
    const dt = useRef<any>(null);

    // Estado para la búsqueda
    const [noControl, setNoControl] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Estado para la tabla de calificaciones
    const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
    
    // Estado para el diálogo de edición
    const [calificacionDialog, setCalificacionDialog] = useState(false);
    const [selectedCalificacion, setSelectedCalificacion] = useState<Calificacion | null>(null);

    // --- Lógica de Búsqueda (SIN CAMBIOS) ---
    const buscarCalificaciones = async () => {
        if (!noControl) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Ingrese el número de control.', life: 3000 });
            return;
        }

        setLoading(true);
        try {
            // Asumimos que CalificacionService.findByNoControl retorna un array de Calificacion
            const response = await CalificacionService.findByNoControl(noControl); 
            
            if (response.data && response.data.length > 0) {
                 // Asegurarse de que los indicadores sean numéricos si vienen como texto
                 const formattedData: Calificacion[] = response.data.map((item: any) => ({
                    ...item,
                    indicador_a: Number(item.indicador_a || 0),
                    indicador_b: Number(item.indicador_b || 0),
                    // ... etc.
                 }));
                 setCalificaciones(formattedData);
                 toast.current.show({ severity: 'success', summary: 'Éxito', detail: `Se encontraron ${response.data.length} calificaciones.`, life: 3000 });
            } else {
                 setCalificaciones([]);
                 toast.current.show({ severity: 'info', summary: 'Info', detail: 'No se encontraron calificaciones para ese No. Control.', life: 3000 });
            }
        } catch (error) {
            console.error("Error al buscar calificaciones:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al conectar con el servicio.', life: 3000 });
            setCalificaciones([]);
        } finally {
            setLoading(false);
        }
    };
    
    // --- Lógica de Acciones (SIN CAMBIOS EN EL COMPORTAMIENTO) ---
    
    // 1. Abrir diálogo de Edición
    const editCalificacion = (calificacion: Calificacion) => {
        setSelectedCalificacion(calificacion);
        setCalificacionDialog(true);
    };
    
    // 2. Cerrar Diálogo y Recargar (o actualizar localmente)
    const hideDialog = () => {
        setCalificacionDialog(false);
        setSelectedCalificacion(null);
    };

    // 3. Manejar éxito de actualización (llamado desde EditarCalificacionForm)
    const handleUpdateSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Actualizado', detail: 'La calificación se ha modificado correctamente.', life: 3000 });
        hideDialog();
        // 🛑 OPTIMIZACIÓN: Solo volver a buscar si la búsqueda por noControl está activa
        if (noControl) {
            buscarCalificaciones(); 
        }
    };
    
    // 4. Eliminación (Simulación de servicio)
    const deleteCalificacion = async (id: number) => {
        try {
            // await CalificacionService.delete(id); 
            setCalificaciones(prev => prev.filter(c => c.idCalificacion !== id));
            toast.current.show({ severity: 'success', summary: 'Eliminado', detail: 'Registro de calificación eliminado.', life: 3000 });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Fallo al eliminar el registro.', life: 3000 });
        }
    };

    // 5. Diálogo de Confirmación para Eliminar (SIN CAMBIOS)
    const confirmDeleteCalificacion = (calificacion: Calificacion) => {
        confirmDialog({
            message: `¿Está seguro de que desea eliminar la calificación con ID ${calificacion.idCalificacion}?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => deleteCalificacion(calificacion.idCalificacion),
        });
    };

    // --- Templates del DataTable (SIN CAMBIOS) ---
    
    const actionBodyTemplate = (rowData: Calificacion) => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button 
                    icon="pi pi-pencil" 
                    severity="warning" 
                    rounded 
                    tooltip="Editar"
                    onClick={() => editCalificacion(rowData)} 
                />
                <Button 
                    icon="pi pi-trash" 
                    severity="danger" 
                    rounded 
                    tooltip="Eliminar"
                    onClick={() => confirmDeleteCalificacion(rowData)} 
                />
            </div>
        );
    };
    
    // 🛑 REMOVEMOS EL calificacionDialogFooter Y DEJAMOS EL FOOTER VACÍO
    // La lógica de Guardar/Cancelar ahora está DENTRO de EditarCalificacionForm.tsx

    return (
        <div className="card">
            <Toast ref={toast} />
            <ConfirmDialog />

            {/* --- 1. Barra de Búsqueda (Toolbar) --- */}
            <Toolbar className="mb-4" start={
                <div className="flex align-items-center gap-2">
                    <label htmlFor="noControl" className="font-bold">Buscar por No. Control:</label>
                    <InputText 
                        id="noControl" 
                        value={noControl} 
                        onChange={(e) => setNoControl(e.target.value)} 
                        placeholder="Ej. 28TE0023" 
                    />
                    <Button 
                        label="Buscar" 
                        icon="pi pi-search" 
                        onClick={buscarCalificaciones} 
                        loading={loading}
                    />
                </div>
            } />
            
            {/* --- 2. Tabla de Resultados --- */}
            <DataTable 
                ref={dt} 
                value={calificaciones} 
                dataKey="idCalificacion"
                paginator 
                rows={10} 
                loading={loading}
                emptyMessage="Use la barra de búsqueda para listar calificaciones de un alumno."
            >
                <Column field="idCalificacion" header="ID" sortable></Column>
                <Column field="fechaCaptura" header="Fecha Captura" sortable></Column>
                <Column field="calificacionEspecifica" header="Calificación Final" sortable></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} header="Acciones"></Column>
            </DataTable>
            
            {/* --- 3. Diálogo de Edición --- */}
            <Dialog 
                visible={calificacionDialog} 
                style={{ width: '800px' }} // 🛑 Aumentamos el ancho para el formulario detallado
                header="Modificar Calificación" 
                modal 
                className="p-fluid" 
                onHide={hideDialog}
                // 🛑 EL FOOTER SE ELIMINA, YA QUE LOS BOTONES ESTÁN DENTRO DEL FORMULARIO
                footer={<></>} 
            >
                {selectedCalificacion && (
                    <EditarCalificacionForm
                        idCalificacion={selectedCalificacion.idCalificacion} // 🛑 Pasamos los datos
                        onUpdateSuccess={handleUpdateSuccess} // 🛑 Manejamos el éxito
                        onCancel={hideDialog} // 🛑 Manejamos la cancelación
                    />
                )}
            </Dialog>

        </div>
    );
}