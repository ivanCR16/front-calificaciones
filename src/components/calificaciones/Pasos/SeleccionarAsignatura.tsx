// src/components/SeleccionarAsignatura.tsx
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import AsignaturaService from '../../../Service/AsignaturaService';
import DocenteService from '../../../Service/DocenteService';

// Interfaces de ejemplo (usar las reales si están disponibles)
interface Asignatura {
    idAsignatura: number;
    nombre: string;
    identificador: string;
}

interface SeleccionarAsignaturaProps {
    idDocente: number;
    onSelect: (id: number) => void;
}

export default function SeleccionarAsignatura({ idDocente, onSelect }: SeleccionarAsignaturaProps) {
    
    const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
    const [selectedAsignatura, setSelectedAsignatura] = useState<Asignatura | null>(null);
    const [loading, setLoading] = useState(true);

    // Cargar asignaturas al montar el componente (usando el idDocente)
    useEffect(() => {
        if (idDocente) {
            setLoading(true);
            // Simulación de la llamada a la API
            DocenteService.findAsignaturas(idDocente)
                .then(response => {
                    setAsignaturas(response.data);
                })
                .catch(error => {
                    console.error("Error al cargar asignaturas:", error);
                    setAsignaturas([]);
                })
                .finally(() => setLoading(false));
        }
    }, [idDocente]);

    // Botón de acción en cada fila
    const actionBodyTemplate = (rowData: Asignatura) => {
        return (
            <Button 
                label="Seleccionar" 
                icon="pi pi-check" 
                onClick={() => setSelectedAsignatura(rowData)} 
                outlined
            />
        );
    };

    return (
        <div>
            <h3>Seleccione una Asignatura (Docente ID: {idDocente})</h3>
            
            <DataTable 
                value={asignaturas} 
                loading={loading}
                selectionMode="single"
                selection={selectedAsignatura}
                onSelectionChange={(e) => {
                    setSelectedAsignatura(e.value)
                    onSelect(e.value)
                }}
                dataKey="idAsignatura"
                emptyMessage="No se encontraron asignaturas."
                rows={5}
                paginator
            >
                <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                <Column field="idAsignatura" header="Identificador" sortable></Column>
                <Column field="nombre" header="Nombre" sortable></Column>
            </DataTable>
            
            {/* {selectedAsignatura && (
                <div className="mt-3 p-3 bg-blue-100 border-round">
                    Asignatura Seleccionada: **{selectedAsignatura.nombre}**
                    <Button 
                        label="Confirmar y Continuar" 
                        icon="pi pi-arrow-right" 
                        className="ml-3" 
                        onClick={() => onSelect(selectedAsignatura.idAsignatura)} 
                    />
                </div>
            )} */}
        </div>
    );
}