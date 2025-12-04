// src/components/Pasos/SeleccionarTema.tsx
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message'; 

// *** Importación simulada: Reemplaza con tu servicio real para Temas ***
// Asumiremos que el servicio de Asignatura también tiene un método para obtener temas
import AsignaturaService from '../../../Service/AsignaturaService'; 

// Interfaces
interface Tema {
    idTema: number;
    titulo: string;
    identificador: string;
    descripcion: string;
}

interface SeleccionarTemaProps {
    idAsignatura: any; // ID de la asignatura seleccionada
    onSelect: (id: number) => void;
}

// Simulación de datos (En un caso real, esto vendría de AsignaturaService)
const mockTemas: Tema[] = [
    { idTema: 301, titulo: 'Introducción a React Hooks', identificador: 'TEMA-01', descripcion: 'Conceptos de useState y useEffect.' },
    { idTema: 302, titulo: 'Gestión del Estado Global', identificador: 'TEMA-02', descripcion: 'Uso de Context API o Redux.' },
    { idTema: 303, titulo: 'Testing y Despliegue', identificador: 'TEMA-03', descripcion: 'Pruebas unitarias y CI/CD.' },
];

export default function SeleccionarTema({ idAsignatura, onSelect }: SeleccionarTemaProps) {
    
    const [temas, setTemas] = useState<Tema[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTema, setSelectedTema] = useState<Tema | null>(null);

    // Cargar temas cuando el idAsignatura cambie
    useEffect(() => {
        if (idAsignatura) {
            setLoading(true);
            setSelectedTema(null); // Limpiar selección anterior
            
            // --- Lógica de Llamada API REAL ---
            AsignaturaService.findTopicsByAsignaturaId(idAsignatura.idAsignatura)
                .then(response => {
                    setTemas(response.data);
                })
                .catch(error => {
                    console.error("Error al cargar temas:", error);
                    setTemas([]);
                })
                .finally(() => setLoading(false));
           

            // --- Simulación (Reemplazar con el código de arriba) ---
            /* console.log(`Buscando temas para la Asignatura ID: ${idAsignatura}`);
            setTimeout(() => {
                setTemas(mockTemas); 
                setLoading(false);
            }, 800); */
        } else {
            setTemas([]);
            setSelectedTema(null);
        }
    }, [idAsignatura]);

    // Función para manejar la confirmación de la selección y notificar al padre
    const handleConfirmarSeleccion = () => {
        if (selectedTema) {
            // Llama a la función del padre para actualizar el estado global
            onSelect(selectedTema.idTema);
        }
    };
    
    // Si no hay idAsignatura, muestra un mensaje de advertencia
    if (!idAsignatura) {
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
            <h3>Seleccione un Tema (Asignatura ID: {idAsignatura.idAsignatura})</h3>
            
            <DataTable 
                value={temas} 
                loading={loading}
                selectionMode="single"
                selection={selectedTema}
                onSelectionChange={(e) => {
                    setSelectedTema(e.value)
                    onSelect(e.value)
                }} 
                dataKey="idTema"
                emptyMessage="No se encontraron temas para esta asignatura."
                rows={5}
                paginator
            >
                <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                <Column field="idTema" header="Identificador" sortable></Column>
                <Column field="nombre" header="Título del Tema" sortable></Column>
                <Column field="descripcion" header="Descripción"></Column>
            </DataTable>
            
            {/* Mensaje de selección y botón para avanzar */}
            {/* {selectedTema && (
                <div className="mt-3 p-3 bg-blue-100 border-round flex justify-content-between align-items-center">
                    <span>Tema Seleccionado: **{selectedTema.titulo}**</span>
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