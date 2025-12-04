// src/components/Pasos/SeleccionarActividad.tsx
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message'; 
import TemaService from '../../../Service/TemaService';

// Interfaces
interface Actividad {
    idActividad: number;
    nombre: string;
    tipo: string;
    fechaEntrega: string; // Ejemplo de formato de fecha
}

interface SeleccionarActividadProps {
    idTema: any; // ID del tema seleccionado en el paso anterior
    onSelect: (id: number) => void;
}

// Simulación de datos (En un caso real, esto vendría de ActividadService)
const mockActividades: Actividad[] = [
    { idActividad: 401, nombre: 'Laboratorio de useState', tipo: 'Práctica', fechaEntrega: '2025-12-10' },
    { idActividad: 402, nombre: 'Ensayo sobre useEffect', tipo: 'Teórico', fechaEntrega: '2025-12-15' },
    { idActividad: 403, nombre: 'Quiz de Hooks', tipo: 'Evaluación', fechaEntrega: '2025-12-08' },
];

export default function SeleccionarActividad({ idTema, onSelect }: SeleccionarActividadProps) {
    
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedActividad, setSelectedActividad] = useState<Actividad | null>(null);

    // Cargar actividades cuando el idTema cambie
    useEffect(() => {
        if (idTema) {
            setLoading(true);
            setSelectedActividad(null); // Limpiar selección anterior
            
            // --- Lógica de Llamada API REAL ---
            TemaService.findActivitiesByTopicId(idTema.idTema)
                .then(response => {
                    setActividades(response.data);
                })
                .catch(error => {
                    console.error("Error al cargar actividades:", error);
                    setActividades([]);
                })
                .finally(() => setLoading(false));
           

            // --- Simulación (Reemplazar con el código de arriba) ---
            /* console.log(`Buscando actividades para el Tema ID: ${idTema}`);
            setTimeout(() => {
                setActividades(mockActividades); 
                setLoading(false);
            }, 800); */
        } else {
            setActividades([]);
            setSelectedActividad(null);
        }
    }, [idTema]);

    // Función para manejar la confirmación de la selección y notificar al padre
    const handleConfirmarSeleccion = () => {
        if (selectedActividad) {
            // Llama a la función del padre para actualizar el estado global
            onSelect(selectedActividad.idActividad);
        }
    };
    
    // Si no hay idTema, muestra un mensaje de advertencia
    if (!idTema) {
        return (
            <Message 
                severity="warn" 
                text="Por favor, regrese al paso 3 y seleccione un tema." 
                className="w-full" 
            />
        );
    }

    return (
        <div>
            <h3>Seleccione una Actividad (Tema ID: {idTema.idTema})</h3>
            
            <DataTable 
                value={actividades} 
                loading={loading}
                selectionMode="single"
                selection={selectedActividad}
                onSelectionChange={(e) => {
                    setSelectedActividad(e.value)
                    onSelect(e.value)
                }} 
                dataKey="idActividad"
                emptyMessage="No se encontraron actividades para este tema."
                rows={5}
                paginator
            >
                <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                <Column field="nombre" header="Nombre de la actividad" sortable></Column>
                <Column field="descripcion" header="Descripcion"></Column>
                <Column field="valorActividad" header="Valor de la actividad" sortable></Column>
            </DataTable>
            
            {/* Mensaje de selección y botón para avanzar */}
            {/* {selectedActividad && (
                <div className="mt-3 p-3 bg-blue-100 border-round flex justify-content-between align-items-center">
                    <span>Actividad Seleccionada: **{selectedActividad.nombre}**</span>
                    <Button 
                        label="Confirmar y Continuar" 
                        icon="pi pi-arrow-right" 
                        iconPos="right"
                        onClick={handleConfirmarSeleccion} 
                    />
                </div>
            )} */}
        </div>
    );
}