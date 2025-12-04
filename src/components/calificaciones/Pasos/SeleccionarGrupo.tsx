// src/components/Pasos/SeleccionarGrupo.tsx
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message'; 
import AsignaturaService from '../../../Service/AsignaturaService'; // Servicio para la API

// Interfaces
interface Grupo {
    idGrupo: number;
    nombre: string;
    identificador: string;
    descripcion: string;
}

// Actualizamos la interfaz para reflejar que idAsignatura es un objeto
interface AsignaturaDetalle {
    idAsignatura: number;
    nombre: string;
    // Añadir otras propiedades si son necesarias
}

interface SeleccionarGrupoProps {
    idAsignatura: any | null; // El padre pasa el objeto de la asignatura
    onSelect: (id: number) => void;
}

// Simulación de datos de grupos (Solo para referencia, la API real está siendo usada)
/*
const mockGrupos: Grupo[] = [
    { idGrupo: 201, nombre: 'A-2025', identificador: 'G-A25', descripcion: 'Grupo A de turno matutino' },
    // ...
];
*/

export default function SeleccionarGrupo({ idAsignatura, onSelect }: SeleccionarGrupoProps) {
    
    const [grupos, setGrupos] = useState<Grupo[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedGrupo, setSelectedGrupo] = useState<Grupo | null>(null);

    // Cargar grupos cuando el idAsignatura cambie
    useEffect(() => {
        // Asegurarse de que el objeto de asignatura y su ID estén presentes
        if (idAsignatura && idAsignatura.idAsignatura) {
            setLoading(true);
            setSelectedGrupo(null); // Limpiar selección al cargar nuevos grupos
            
            // --- Lógica de Llamada API REAL ---
            // Usamos el ID de la asignatura para buscar sus grupos
            AsignaturaService.findGroups(idAsignatura.idAsignatura)
                .then(response => {
                    setGrupos(response.data);
                })
                .catch(error => {
                    console.error("Error al cargar grupos:", error);
                    setGrupos([]);
                })
                .finally(() => setLoading(false));
        } else {
            setGrupos([]);
            setSelectedGrupo(null);
        }
    }, [idAsignatura]);

    // Función para manejar la confirmación de la selección y notificar al padre
    const handleConfirmarSeleccion = () => {
        if (selectedGrupo) {
            // Llama a la función del padre para actualizar el estado global
            onSelect(selectedGrupo.idGrupo);
        }
    };
    
    // Si no hay idAsignatura, muestra un mensaje de advertencia
    if (!idAsignatura || !idAsignatura.idAsignatura) {
        return (
            <Message 
                severity="warn" 
                text="Por favor, regrese al paso 1 y seleccione una asignatura." 
                className="w-full" 
            />
        );
    }

    return (
        <div>
            <h3>Seleccione un Grupo (Asignatura: **{idAsignatura.nombre}**)</h3>
            
            <DataTable 
                value={grupos} 
                loading={loading}
                // Permitir selección de fila única
                selectionMode="single"
                selection={selectedGrupo}
                onSelectionChange={(e) => {
                    setSelectedGrupo(e.value) 
                    onSelect(e.value)
                }} 
                dataKey="idGrupo"
                emptyMessage="No se encontraron grupos para esta asignatura."
                rows={5}
                paginator
            >
                {/* Columna de radio/checkbox para la selección de fila */}
                <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                <Column field="idGrupo" header="Identificador" sortable></Column>
                <Column field="identificador" header="Nombre del Grupo" sortable></Column>
                {/* La columna de Acción (botón "Seleccionar") fue eliminada */}
            </DataTable>
        </div>
    );
}