
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Message } from 'primereact/message';
import { Panel } from 'primereact/panel';
import { Calendar } from 'primereact/calendar';
import { ProgressSpinner } from 'primereact/progressspinner'; 
import CalificacionService from '../../../Service/CalificacionService';


const INDICADORES = ['A', 'B', 'C', 'D', 'E', 'F']; 
const CALIFICACION_MAXIMA = 100;


interface CalificacionData {
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
}


interface EditarCalificacionProps {
    idCalificacion: number; 
    onUpdateSuccess: () => void;
    onCancel: () => void;
}

export default function EditarCalificacionForm({
    idCalificacion, 
    onUpdateSuccess,
    onCancel
}: EditarCalificacionProps) {
    
    const [initialLoading, setInitialLoading] = useState(true); 
    const [data, setData] = useState<CalificacionData | null>(null); 
    
    
    const [calificacionEspecifica, setCalificacionEspecifica] = useState<number | null>(null);
    const [fechaCaptura, setFechaCaptura] = useState<any>(null);
    const [indicadores, setIndicadores] = useState<Record<string, number | null>>({});
    const [saving, setSaving] = useState(false);

    
    useEffect(() => {
        const fetchCalificacion = async () => {
            setInitialLoading(true);
            try {
                
                const response = await CalificacionService.findById(idCalificacion);
                const fetchedData: CalificacionData = response.data;
                setData(fetchedData);
                
                
                setCalificacionEspecifica(fetchedData.calificacionEspecifica);
                
                setFechaCaptura(new Date(fetchedData.fechaCaptura)); 
                setIndicadores({
                    'A': fetchedData.indicadorA,
                    'B': fetchedData.indicadorB,
                    'C': fetchedData.indicadorC,
                    'D': fetchedData.indicadorD,
                    'E': fetchedData.indicadorE,
                    'F': fetchedData.indicadorF,
                });

            } catch (error) {
                console.error("Error al buscar la calificación por ID:", error);
                
                setData(null);
            } finally {
                setInitialLoading(false);
            }
        };

        if (idCalificacion) {
            fetchCalificacion();
        } else {
            onCancel(); 
        }
    }, [idCalificacion, onCancel]); 

    
    const handleIndicatorChange = (key: string, value: number | null) => {
        if (value !== null && value > CALIFICACION_MAXIMA) {
             value = CALIFICACION_MAXIMA;
        }
        setIndicadores(prev => ({ ...prev, [key]: value }));
    };

    
    const handleActualizar = async () => { 
        
        const currentDate = new Date();
        if (!data) return; 
        
        
        if (calificacionEspecifica === null || calificacionEspecifica < 0 || !fechaCaptura) {
            alert("Por favor, ingrese la Calificación Específica y la Fecha de Captura.");
            return;
        }
        
        setSaving(true);
        
        
        const calificacionData = {
            fechaCaptura: currentDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
            calificacionEspecifica: calificacionEspecifica,
            indicadorA: indicadores['A'] || 0,
            indicadorB: indicadores['B'] || 0,
            indicadorC: indicadores['C'] || 0,
            indicadorD: indicadores['D'] || 0,
            indicadorE: indicadores['E'] || 0,
            indicadorF: indicadores['F'] || 0,
        };
        console.log("ACTUALIZAR",data.idCalificacion, calificacionData)

        try {
            
            await CalificacionService.update(data.idCalificacion, calificacionData); 
            onUpdateSuccess(); 
        } catch (error) {
            console.error("Error al actualizar la calificación:", error);
            const errorMessage = (error as any).response?.data?.message || (error as Error).message || 'Error desconocido del servidor.';
            alert(`❌ Error al actualizar: ${errorMessage}`);
        } finally {
            setSaving(false);
        }
    };
    
    
    if (initialLoading) {
        return (
            <div className="flex justify-content-center p-5">
                <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" animationDuration=".5s" />
                <p className="ml-3">Cargando datos de la calificación...</p>
            </div>
        );
    }

    
    if (!data) {
        return (
            <div className="p-5">
                <Message severity="error" text="Fallo al obtener el registro de calificación. Verifique el servicio y el ID." className="w-full" />
                <div className="flex justify-content-end mt-4">
                    <Button label="Cerrar" icon="pi pi-times" onClick={onCancel} />
                </div>
            </div>
        );
    }
    
    
    return (
        <div className="p-fluid">
            <h3>Modificación de Calificación Final</h3> 

            {/* Resumen del registro a modificar */}
            <Panel header="Clave de Registro" className="mb-4" toggleable>
                <div className="grid">
                    <div className="col-12 md:col-6"><p><strong>ID Calificación:</strong> {data.idCalificacion}</p></div>
                </div>
                <Message severity="warn" text="Estás editando un registro existente. Los campos se cargan automáticamente." className="mt-3" />
            </Panel>

            {/* Input de Calificación y Fecha (Campos de formulario) */}
            <Panel header="Calificación Principal y Fecha" className="mb-4">
                <div className="grid">
                    <div className="col-12 md:col-6 p-field">
                        <label htmlFor="calificacionEspecifica" className="font-bold mb-2 block">Calificación Específica (0-{CALIFICACION_MAXIMA}):</label>
                        <InputNumber 
                            id="calificacionEspecifica" 
                            value={calificacionEspecifica} 
                            onValueChange={(e) => setCalificacionEspecifica(e.value)} 
                            mode="decimal"
                            min={0}
                            max={CALIFICACION_MAXIMA}
                            maxFractionDigits={2}
                            placeholder="Nota principal"
                            className="mt-2"
                        />
                    </div>
                    <div className="col-12 md:col-6 p-field">
                        <label htmlFor="fechaCaptura" className="font-bold mb-2 block">Fecha de Captura:</label>
                        <Calendar 
                            id="fechaCaptura" 
                            value={fechaCaptura} 
                            onChange={(e) => setFechaCaptura(e.value as Date)} 
                            dateFormat="dd-mm-yy"
                            showIcon 
                            className="mt-2"
                            disabled
                        />
                    </div>
                </div>
            </Panel>
            
            {/* Formulario de Indicadores */}
            <Panel header="Calificación por Indicador" className="mb-4">
                <div className="grid">
                    {INDICADORES.map(key => (
                        <div key={key} className="col-12 md:col-4 p-field">
                            <label htmlFor={`indicador_${key.toLowerCase()}`} className="font-bold mb-2 block">
                                Indicador {key} (Máx: {CALIFICACION_MAXIMA})
                            </label>
                            <InputNumber 
                                id={`indicador_${key.toLowerCase()}`} 
                                value={indicadores[key]} 
                                onValueChange={(e) => handleIndicatorChange(key, e.value)} 
                                mode="decimal"
                                min={0}
                                max={CALIFICACION_MAXIMA}
                                maxFractionDigits={2}
                                placeholder={`Nota de Indicador ${key}`}
                                className="mt-2"
                            />
                        </div>
                    ))}
                </div>
            </Panel>

            {/* Botón de Guardar y Cancelar */}
            <div className="mt-4 flex justify-content-end gap-2">
                <Button 
                    label="Cancelar" 
                    icon="pi pi-times" 
                    onClick={onCancel} 
                    severity="secondary"
                    outlined
                />
                <Button 
                    label={saving ? "Actualizando..." : "Actualizar Calificaciones"} 
                    icon="pi pi-refresh" 
                    onClick={handleActualizar}
                    disabled={saving || calificacionEspecifica === null || calificacionEspecifica < 0 || calificacionEspecifica > CALIFICACION_MAXIMA || !fechaCaptura}
                    severity="warning" 
                />
            </div>
        </div>
    );
}