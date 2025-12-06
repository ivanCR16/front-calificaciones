
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message'; 
import TemaService from '../../../Service/TemaService';


interface Actividad {
    idActividad: number;
    nombre: string;
    tipo: string;
    fechaEntrega: string; 
}

interface SeleccionarActividadProps {
    idTema: any; 
    onSelect: (id: number) => void;
}


const mockActividades: Actividad[] = [
    { idActividad: 401, nombre: 'Laboratorio de useState', tipo: 'Práctica', fechaEntrega: '2025-12-10' },
    { idActividad: 402, nombre: 'Ensayo sobre useEffect', tipo: 'Teórico', fechaEntrega: '2025-12-15' },
    { idActividad: 403, nombre: 'Quiz de Hooks', tipo: 'Evaluación', fechaEntrega: '2025-12-08' },
];

export default function SeleccionarActividad({ idTema, onSelect }: SeleccionarActividadProps) {
    
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedActividad, setSelectedActividad] = useState<Actividad | null>(null);

    
    useEffect(() => {
        if (idTema) {
            setLoading(true);
            setSelectedActividad(null); 
            
            
            TemaService.findActivitiesByTopicId(idTema.idTema)
                .then(response => {
                    setActividades(response.data);
                })
                .catch(error => {
                    console.error("Error al cargar actividades:", error);
                    setActividades([]);
                })
                .finally(() => setLoading(false));
           

            
           
        } else {
            setActividades([]);
            setSelectedActividad(null);
        }
    }, [idTema]);

    
    const handleConfirmarSeleccion = () => {
        if (selectedActividad) {
            
            onSelect(selectedActividad.idActividad);
        }
    };
    
    
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