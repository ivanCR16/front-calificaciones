// src/components/CargarCalificacionStepper.tsx
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

// Componentes de tabla a crear (simulados)
/* import SeleccionarAsignatura from './SeleccionarAsignatura';
import SeleccionarGrupo from './SeleccionarGrupo';
import SeleccionarTema from './SeleccionarTema';
import SeleccionarActividad from './SeleccionarActividad';
import CargarCalificacionFinal from './CargarCalificacionFinal'; // Paso final */

// --- Interfaz para el estado de la selección ---
interface SeleccionState {
    idAsignatura: number | null;
    idGrupo: number | null;
    idTema: number | null;
    idActividad: number | null;
    idAlumno: number | null; // El alumno se seleccionará en el último paso
}

export default function CargarCalificacionStepper() {
    const stepperRef = useRef<any>(null);
    const toast = useRef<any>(null);
    
    // Estado para guardar la selección jerárquica
    const [seleccion, setSeleccion] = useState<SeleccionState>({
        idAsignatura: null,
        idGrupo: null,
        idTema: null,
        idActividad: null,
        idAlumno: null,
    });
    
    // Inicializamos en null para indicar que la carga del ID está pendiente
    const [idDocente, setIdDocente] = useState<any>(null); 

    // Utilizamos useEffect para cargar el ID del docente directamente del localStorage
    useEffect(() => {
        // 1. Obtener la cadena de texto (que contiene el ID)
        const idUsuarioString = localStorage.getItem('access_token');
        
        if (idUsuarioString) {
            // 2. Convertir la cadena a número entero
            const id = parseInt(idUsuarioString, 10); 
            
            // 3. Validar que la conversión haya sido exitosa (no sea NaN)
            if (!isNaN(id)) {
                setIdDocente(id);
            } else {
                console.error("El valor en 'access_token' no es un número válido:", idUsuarioString);
            }
        } else {
            console.warn("No se encontró 'access_token' en localStorage.");
            // Opcional: Redirigir al login si no hay token/ID
        }
    }, []); // Array vacío para ejecutar solo una vez al montar

    // Función para manejar la selección en un paso
    const handleSeleccion = (key: keyof SeleccionState, id: number | null) => {
        setSeleccion(prev => ({ ...prev, [key]: id }));
        // Lógica para avanzar automáticamente al siguiente paso (si es necesario)
        //stepperRef.current.nextCallback();
    };

    // Función de avance con validación simple
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
        // 1. Limpia todos los estados de selección
        setSeleccion({
            idAsignatura: null,
            idGrupo: null,
            idTema: null,
            idActividad: null,
            idAlumno: null,
        });
        // 2. Mueve el stepper de vuelta al primer paso
        stepperRef.current.setActiveStep(0);
        // 3. Muestra un mensaje de éxito
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
                
                {/* --- Paso 1: Asignatura --- */}
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
                
                {/* --- Paso 2: Grupo --- */}
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
                
                {/* --- Paso 3: Tema --- */}
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
                
                {/* --- Paso 4: Actividad --- */}
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

                {/* --- Paso 5: Alumno (NUEVO PASO) --- */}
                <StepperPanel header="Alumno">
                    <SeleccionarAlumno // <-- COMPONENTE INTEGRADO
                        idGrupo={seleccion.idGrupo} // <-- Pasamos el ID del grupo (Paso 2)
                        onSelect={(id) => handleSeleccion('idAlumno', id)} // <-- Actualiza el ID del Alumno
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
                            disabled={!seleccion.idAlumno} // <-- Se habilita cuando se selecciona el alumno
                        />
                    </div>
                </StepperPanel>
                
                {/* --- Paso 6: Cargar Calificación (FINAL) --- */}
                <StepperPanel header="6. Cargar Calificación">
                    <CargarCalificacion // <-- COMPONENTE FINAL INTEGRADO
                        idActividad={seleccion.idActividad}
                        idAlumno={seleccion.idAlumno}
                        onSaveSuccess={handleResetForm} // <-- Pasamos el handler de éxito
                    />
                    <div className="flex pt-4 justify-content-start">
                        {/* Solo el botón de 'Atrás' es necesario, ya que el 'Guardar' está en el componente hijo */}
                        <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                    </div>
                </StepperPanel>
                
            </Stepper>
        </div>
    );
}