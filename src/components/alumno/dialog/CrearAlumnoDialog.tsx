import React from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

// Interfaz para el formulario de Alumno
interface AlumnoForm {
    nombre: string;
    apellidos: string;
    no_control: string;
    correo: string;
}

// 1. Definición de Props para el componente
interface AlumnoDialogProps {
    alumnoForm: AlumnoForm;
    visible: boolean;
    submitted: boolean;
    onHide: () => void;
    saveAlumno: () => void;
    // Maneja los cambios de todos los campos de texto
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: keyof AlumnoForm) => void;
}

const CrearAlumnoDialog: React.FC<AlumnoDialogProps> = ({
    alumnoForm,
    visible,
    submitted,
    onHide,
    saveAlumno,
    onInputChange,
}) => {
    
    // Pie de Diálogo (Footer)
    const alumnoDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={onHide} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveAlumno} />
        </React.Fragment>
    );

    return (
        <Dialog 
            visible={visible} 
            style={{ width: '32rem' }} 
            breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
            header="Detalles del Alumno" 
            modal 
            className="p-fluid" 
            footer={alumnoDialogFooter}
            onHide={onHide}
        >
            
            {/* Campo: Nombre */}
            <div className="field">
                <label htmlFor="nombre" className="font-bold">
                    Nombre
                </label>
                <InputText 
                    id="nombre" 
                    value={alumnoForm.nombre} 
                    onChange={(e) => onInputChange(e, 'nombre')} 
                    required 
                    autoFocus 
                    className={classNames({ 'p-invalid': submitted && !alumnoForm.nombre })} 
                />
                {submitted && !alumnoForm.nombre && <small className="p-error">El nombre es requerido.</small>}
            </div>
            
            {/* Campo: Apellidos */}
            <div className="field">
                <label htmlFor="apellidos" className="font-bold">
                    Apellidos
                </label>
                <InputText 
                    id="apellidos" 
                    value={alumnoForm.apellidos} 
                    onChange={(e) => onInputChange(e, 'apellidos')} 
                    required 
                    className={classNames({ 'p-invalid': submitted && !alumnoForm.apellidos })} 
                />
                {submitted && !alumnoForm.apellidos && <small className="p-error">Los apellidos son requeridos.</small>}
            </div>

            {/* Campo: No. Control */}
            <div className="field">
                <label htmlFor="no_control" className="font-bold">
                    Número de Control
                </label>
                <InputText 
                    id="no_control" 
                    value={alumnoForm.no_control} 
                    onChange={(e) => onInputChange(e, 'no_control')} 
                    required 
                    className={classNames({ 'p-invalid': submitted && !alumnoForm.no_control })} 
                />
                {submitted && !alumnoForm.no_control && <small className="p-error">El número de control es requerido.</small>}
            </div>

            {/* Campo: Correo */}
            <div className="field">
                <label htmlFor="correo" className="font-bold">
                    Correo
                </label>
                <InputText 
                    id="correo" 
                    value={alumnoForm.correo} 
                    onChange={(e) => onInputChange(e, 'correo')} 
                    required 
                    className={classNames({ 'p-invalid': submitted && !alumnoForm.correo })} 
                />
                {submitted && !alumnoForm.correo && <small className="p-error">El correo es requerido.</small>}
            </div>

        </Dialog>
    );
};

export default CrearAlumnoDialog;