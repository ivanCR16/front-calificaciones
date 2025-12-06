import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Message } from 'primereact/message'; 
import AsignaturaService from '../../../Service/AsignaturaService';

interface Grupo {
    idGrupo: number;
    nombre: string;
    identificador: string;
    descripcion: string;
}

interface AsignaturaDetalle {
    idAsignatura: number;
    nombre: string;
}

interface SeleccionarGrupoProps {
    idAsignatura: any | null;
    onSelect: (id: number) => void;
}


export default function SeleccionarGrupo({ idAsignatura, onSelect }: SeleccionarGrupoProps) {
    
    const [grupos, setGrupos] = useState<Grupo[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedGrupo, setSelectedGrupo] = useState<Grupo | null>(null);

    useEffect(() => {
        if (idAsignatura && idAsignatura.idAsignatura) {
            setLoading(true);
            setSelectedGrupo(null);
            
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

    const handleConfirmarSeleccion = () => {
        if (selectedGrupo) {
            onSelect(selectedGrupo.idGrupo);
        }
    };
    
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
                <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                <Column field="idGrupo" header="Identificador" sortable></Column>
                <Column field="identificador" header="Nombre del Grupo" sortable></Column>
            </DataTable>
        </div>
    );
}