import React, { useState, useRef, useEffect } from 'react';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import SeleccionarAsignatura from './Pasos/SeleccionarAsignatura';
import SeleccionarGrupo from './Pasos/SeleccionarGrupo';
import SeleccionarTema from './Pasos/SeleccionarTema';
import SeleccionarActividad from './Pasos/SeleccionarActividad';
import SeleccionarAlumno from './Pasos/SeleccionarAlumno';
import CargarCalificacion from './Pasos/CargarCalificacion';

interface SeleccionState {
    idAsignatura: number | null;
    idGrupo: number | null;
    idTema: number | null;
    idActividad: number | null;
    idAlumno: number | null;
}

export default function CargarCalificacionStepper() {
    const stepperRef = useRef<any>(null);
    const toast = useRef<any>(null);
    
    const [seleccion, setSeleccion] = useState<SeleccionState>({
        idAsignatura: null,
        idGrupo: null,
        idTema: null,
        idActividad: null,
        idAlumno: null,
    });
    
    const [idDocente, setIdDocente] = useState<any>(null); 

    useEffect(() => {
        const idUsuarioString = localStorage.getItem('access_token');
        
        if (idUsuarioString) {
            
            const id = parseInt(idUsuarioString, 10); 
            
            
            if (!isNaN(id)) {
                setIdDocente(id);
            } else {
                console.error("El valor en 'access_token' no es un número válido:", idUsuarioString);
            }
        } else {
            console.warn("No se encontró 'access_token' en localStorage.");
            
        }
    }, []); 

    
    const handleSeleccion = (key: keyof SeleccionState, id: number | null) => {
        setSeleccion(prev => ({ ...prev, [key]: id }));
        
        
    };

    
    const handleNext = (currentKey: keyof SeleccionState) => {
        if (seleccion[currentKey]) {
            stepperRef.current.nextCallback();
        } else {
            toast.current.show({ 
                severity: 'warn', 
                summary: 'Atención', 
                detail: `Debe seleccionar un ítem para avanzar.`, 
                life: 3000 
            });
        }
    };

    const handleResetForm = () => {
        
        setSeleccion({
            idAsignatura: null,
            idGrupo: null,
            idTema: null,
            idActividad: null,
            idAlumno: null,
        });
        
        stepperRef.current.setActiveStep(0);
        
        toast.current.show({ 
            severity: 'success', 
            summary: 'Calificación guardada correctamente.', 
            detail: 'Puede iniciar una nueva carga de calificación.' 
        });
    };
    
    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <Stepper ref={stepperRef} style={{ flexBasis: '70rem' }} linear>
                
                
                <StepperPanel header="Asignatura">
                    <SeleccionarAsignatura 
                        idDocente={idDocente}
                        onSelect={(id) => {
                            handleSeleccion('idAsignatura', id)
                        }}
                    />
                    <div className="flex pt-4 justify-content-end">
                        <Button 
                            label="Siguiente" 
                            icon="pi pi-arrow-right" 
                            iconPos="right" 
                            onClick={() => handleNext('idAsignatura')} 
                            disabled={!seleccion.idAsignatura}
                        />
                    </div>
                </StepperPanel>
                
                
                <StepperPanel header="Grupo">
                    <SeleccionarGrupo 
                        idAsignatura={seleccion.idAsignatura}
                        onSelect={(id) => handleSeleccion('idGrupo', id)}
                    />
                    <div className="flex pt-4 justify-content-between">
                        <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left" onClick={() => {
                            handleSeleccion('idAsignatura', null)
                            stepperRef.current.prevCallback()
                        }} />
                        <Button 
                            label="Siguiente" 
                            icon="pi pi-arrow-right" 
                            iconPos="right" 
                            onClick={() => handleNext('idGrupo')} 
                            disabled={!seleccion.idGrupo}
                        />
                    </div>
                </StepperPanel>
                
                
                <StepperPanel header="Tema">
                    <SeleccionarTema 
                        idAsignatura={seleccion.idAsignatura}
                        onSelect={(id) => handleSeleccion('idTema', id)}
                    />
                    <div className="flex pt-4 justify-content-between">
                        <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left" onClick={() => {
                            handleSeleccion('idGrupo', null)
                            stepperRef.current.prevCallback()
                        }} />
                        <Button 
                            label="Siguiente" 
                            icon="pi pi-arrow-right" 
                            iconPos="right" 
                            onClick={() => handleNext('idTema')} 
                            disabled={!seleccion.idTema}
                        />
                    </div>
                </StepperPanel>
                
                
                <StepperPanel header="Actividad">
                    <SeleccionarActividad 
                        idTema={seleccion.idTema}
                        onSelect={(id) => handleSeleccion('idActividad', id)}
                    />
                    <div className="flex pt-4 justify-content-between">
                        <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left" onClick={() => {
                            handleSeleccion('idTema', null)
                            stepperRef.current.prevCallback()
                        }} />
                        <Button 
                            label="Siguiente" 
                            icon="pi pi-arrow-right" 
                            iconPos="right" 
                            onClick={() => handleNext('idActividad')} 
                            disabled={!seleccion.idActividad}
                        />
                    </div>
                </StepperPanel>

                
                <StepperPanel header="Alumno">
                    <SeleccionarAlumno 
                        idGrupo={seleccion.idGrupo} 
                        onSelect={(id) => handleSeleccion('idAlumno', id)} 
                    />
                    <div className="flex pt-4 justify-content-between">
                        <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left" onClick={() => {
                            handleSeleccion('idActividad', null)
                            stepperRef.current.prevCallback()
                        }} />
                        <Button 
                            label="Siguiente" 
                            icon="pi pi-arrow-right" 
                            iconPos="right" 
                            onClick={() => handleNext('idAlumno')} 
                            disabled={!seleccion.idAlumno} 
                        />
                    </div>
                </StepperPanel>
                
                
                <StepperPanel header="6. Cargar Calificación">
                    <CargarCalificacion 
                        idActividad={seleccion.idActividad}
                        idAlumno={seleccion.idAlumno}
                        onSaveSuccess={handleResetForm} 
                    />
                    <div className="flex pt-4 justify-content-start">
                        
                        <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                    </div>
                </StepperPanel>
                
            </Stepper>
        </div>
    );
}