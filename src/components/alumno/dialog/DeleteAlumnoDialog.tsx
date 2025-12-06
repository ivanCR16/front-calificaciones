import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
// Importamos la interfaz Alumno
import type { Alumno } from '../../../interface/AlumnoInterface';

// Definición de Props para el componente
interface DeleteAlumnoDialogProps {
    alumno: Alumno; // Recibe el objeto Alumno a eliminar
    visible: boolean;
    onHide: () => void;
    deleteAlumno: () => void; // Función para confirmar la eliminación
}

const DeleteAlumnoDialog: React.FC<DeleteAlumnoDialogProps> = ({
    alumno,
    visible,
    onHide,
    deleteAlumno,
}) => {

    // Pie de Diálogo (Footer de Confirmación)
    const deleteAlumnoDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={onHide} />
            <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteAlumno} />
        </React.Fragment>
    );

    return (
        <Dialog 
            visible={visible} 
            style={{ width: '32rem' }} 
            breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
            header="Confirmar Eliminación de Alumno" 
            modal 
            footer={deleteAlumnoDialogFooter} 
            onHide={onHide}
        >
            <div className="confirmation-content flex align-items-center">
                {/* Ícono de advertencia de PrimeIcons */}
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem', color: 'var(--red-500)' }} />
                
                {alumno && (
                    <span>
                        ¿Está seguro de que desea eliminar al alumno **{alumno.nombre} {alumno.apellidos}**?
                        <br/>
                        <small>No. Control: {alumno.noControl}</small>
                    </span>
                )}
            </div>
        </Dialog>
    );
};

export default DeleteAlumnoDialog;