
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Message } from 'primereact/message';
import { Panel } from 'primereact/panel';
import { Calendar } from 'primereact/calendar'; 
import CalificacionService from '../../../Service/CalificacionService';


const INDICADORES = ['A', 'B', 'C', 'D', 'E', 'F']; 
const CALIFICACION_MAXIMA = 100;


interface CalificacionProps {
    idActividad: any; 
    idAlumno: any;     
    onSaveSuccess: () => void;
}

export default function CargarCalificacion({
    idActividad,
    idAlumno,
    onSaveSuccess
}: CalificacionProps) {
    
    
    const [calificacionEspecifica, setCalificacionEspecifica] = useState<number | null>(null);
    const [indicadores, setIndicadores] = useState<Record<string, number | null>>({});
    const [fechaCaptura, setFechaCaptura] = useState<Date | null>(new Date());
    const [saving, setSaving] = useState(false);
    
    const isReady = idActividad && idAlumno;

    
    const handleIndicatorChange = (key: string, value: number | null) => {
        
        if (value !== null && value > CALIFICACION_MAXIMA) {
             value = CALIFICACION_MAXIMA;
        }
        setIndicadores(prev => ({ ...prev, [key]: value }));
    };

    if (!isReady) {
        return (
            <Message 
                severity="error" 
                text="Error: Debes completar la selección de Actividad y Alumno (Pasos 4 y 5)." 
                className="w-full" 
            />
        );
    }

    const handleGuardar = async () => { 
        
        if (calificacionEspecifica === null || calificacionEspecifica < 0 || !fechaCaptura) {
            alert("Por favor, ingrese la Calificación Específica y la Fecha de Captura.");
            return;
        }
        
        
        if (idAlumno === null) {
            alert("Error interno: ID de alumno no disponible.");
            return;
        }

        setSaving(true);
        
        
        const calificacionData = {
            
            fechaCaptura: fechaCaptura.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
            calificacionEspecifica: calificacionEspecifica,
            
            
            indicadorA: indicadores['A'] || 0,
            indicadorB: indicadores['B'] || 0,
            indicadorC: indicadores['C'] || 0,
            indicadorD: indicadores['D'] || 0,
            indicadorE: indicadores['E'] || 0,
            indicadorF: indicadores['F'] || 0,
            
            
            alumno: {
                idAlumno: idAlumno.idAlumno
            }
        };

        try {
            const response = await CalificacionService.create(calificacionData);

            
            console.log("Respuesta del Backend:", response);
            
            
            setCalificacionEspecifica(null);
            setIndicadores({});
            onSaveSuccess(); 

        } catch (error) {
            
            console.error("Error al guardar la calificación:", error);
            const errorMessage = (error as any).response?.data?.message || (error as Error).message || 'Error desconocido del servidor.';
            
        } finally {
            
            setSaving(false);
        }
    };

    return (
        <div className="p-fluid">
            <h3>Carga de Calificación Final</h3>

            {/* Resumen de la Selección */}
            <Panel header="Clave de Registro" className="mb-4" toggleable>
                <div className="grid">
                    <div className="col-12 md:col-6"><p><strong>ID Actividad (Clave 1):</strong> {idActividad.idActividad}</p></div>
                    <div className="col-12 md:col-6"><p><strong>ID Alumno (Clave 2):</strong> {idAlumno.idAlumno}</p></div>
                </div>
                <Message severity="info" text="Esta acción cargará la calificación en el sistema usando las claves de Actividad y Alumno." className="mt-3" />
            </Panel>

            {/* Input de Calificación y Fecha */}
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

            {/* Botón de Guardar */}
            <div className="mt-4 flex justify-content-end">
                <Button 
                    label={saving ? "Guardando..." : "Guardar Calificaciones"} 
                    icon="pi pi-save" 
                    onClick={handleGuardar} 
                    disabled={!isReady || saving || calificacionEspecifica === null || calificacionEspecifica < 0 || calificacionEspecifica > CALIFICACION_MAXIMA || !fechaCaptura}
                    severity="primary"
                />
            </div>
        </div>
    );
}