
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Message } from 'primereact/message'; 



import AsignaturaService from '../../../Service/AsignaturaService'; 


interface Tema {
    idTema: number;
    titulo: string;
    identificador: string;
    descripcion: string;
}

interface SeleccionarTemaProps {
    idAsignatura: any; 
    onSelect: (id: number) => void;
}


const mockTemas: Tema[] = [
    { idTema: 301, titulo: 'Introducción a React Hooks', identificador: 'TEMA-01', descripcion: 'Conceptos de useState y useEffect.' },
    { idTema: 302, titulo: 'Gestión del Estado Global', identificador: 'TEMA-02', descripcion: 'Uso de Context API o Redux.' },
    { idTema: 303, titulo: 'Testing y Despliegue', identificador: 'TEMA-03', descripcion: 'Pruebas unitarias y CI/CD.' },
];

export default function SeleccionarTema({ idAsignatura, onSelect }: SeleccionarTemaProps) {
    
    const [temas, setTemas] = useState<Tema[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTema, setSelectedTema] = useState<Tema | null>(null);

    
    useEffect(() => {
        if (idAsignatura) {
            setLoading(true);
            setSelectedTema(null); 
            
            
            AsignaturaService.findTopicsByAsignaturaId(idAsignatura.idAsignatura)
                .then(response => {
                    setTemas(response.data);
                })
                .catch(error => {
                    console.error("Error al cargar temas:", error);
                    setTemas([]);
                })
                .finally(() => setLoading(false));
           

            
           
        } else {
            setTemas([]);
            setSelectedTema(null);
        }
    }, [idAsignatura]);

    
    const handleConfirmarSeleccion = () => {
        if (selectedTema) {
            
            onSelect(selectedTema.idTema);
        }
    };
    
    
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
        </div>
    );
}