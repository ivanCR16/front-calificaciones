
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message'; 



import GrupoService from '../../../Service/GrupoService'; 


interface Alumno {
    idAlumno: number;
    codigo: string; 
    nombreCompleto: string;
}

interface SeleccionarAlumnoProps {
    idGrupo: any; 
    onSelect: (id: number) => void;
}


const mockAlumnos: Alumno[] = [
    { idAlumno: 501, codigo: 'EST-1001', nombreCompleto: 'García, Ana Sofía' },
    { idAlumno: 502, codigo: 'EST-1002', nombreCompleto: 'Pérez, Juan Camilo' },
    { idAlumno: 503, codigo: 'EST-1003', nombreCompleto: 'Rodríguez, Luis Manuel' },
    { idAlumno: 504, codigo: 'EST-1004', nombreCompleto: 'Torres, Daniela Belén' },
];

export default function SeleccionarAlumno({ idGrupo, onSelect }: SeleccionarAlumnoProps) {
    
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);

    
    useEffect(() => {
        if (idGrupo) {
            setLoading(true);
            setSelectedAlumno(null); 
            
            
            GrupoService.findStudentsByGroupId(idGrupo.idGrupo)
                .then(response => {
                    setAlumnos(response.data);
                })
                .catch(error => {
                    console.error("Error al cargar alumnos:", error);
                    setAlumnos([]);
                })
                .finally(() => setLoading(false));
           

            
           
        } else {
            setAlumnos([]);
            setSelectedAlumno(null);
        }
    }, [idGrupo]);

    
    const handleConfirmarSeleccion = () => {
        if (selectedAlumno) {
            
            onSelect(selectedAlumno.idAlumno);
        }
    };
    
    
    if (!idGrupo) {
        return (
            <Message 
                severity="warn" 
                text="Por favor, regrese al paso 2 y seleccione un grupo." 
                className="w-full" 
            />
        );
    }

    return (
        <div>
            <h3>Seleccione el Alumno (Grupo ID: {idGrupo.idGrupo})</h3>
            
            <DataTable 
                value={alumnos} 
                loading={loading}
                selectionMode="single"
                selection={selectedAlumno}
                onSelectionChange={(e) => {
                    setSelectedAlumno(e.value)
                    onSelect(e.value)
                }} 
                dataKey="idAlumno"
                emptyMessage="No se encontraron alumnos en este grupo."
                rows={5}
                paginator
            >
                <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                <Column field="noControl" header="Num control" sortable></Column>
                <Column field="nombre" header="Nombre" sortable></Column>
                <Column field="apellidos" header="Apellidos" sortable></Column>
                <Column field="correo" header="Correo" sortable></Column>
            </DataTable>
            
            {/* Mensaje de selección y botón para avanzar */}
            {/* {selectedAlumno && (
                <div className="mt-3 p-3 bg-blue-100 border-round flex justify-content-between align-items-center">
                    <span>Alumno Seleccionado: **{selectedAlumno.nombreCompleto}**</span>
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