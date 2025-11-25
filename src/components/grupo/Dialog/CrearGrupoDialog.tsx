import React from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown, type DropdownChangeEvent } from 'primereact/dropdown'; 
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import type { Asignatura } from '../../../interface/AsignaturaInterface';
import type { Grupo } from '../../../interface/GrupoInterface';

export interface GrupoData {
    identificador: string;
    asignatura: {
        idAsignatura: number;
    };
}

export interface GrupoForm {
    identificador: string;
    asignatura: Asignatura | null;
}

interface GrupoDialogProps {
    asignaturas: Asignatura[];
    grupoForm: Grupo;
    visible: boolean;
    submitted: boolean;
    onHide: () => void;
    saveGrupo: () => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement> | DropdownChangeEvent, name: keyof GrupoForm) => void;
}

const GrupoDialog: React.FC<GrupoDialogProps> = ({
    asignaturas,
    grupoForm,
    visible,
    submitted,
    onHide,
    saveGrupo,
    onInputChange,
}) => {
    
    const grupoDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={onHide} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveGrupo} />
        </React.Fragment>
    );

    return (
        <Dialog 
            visible={visible} 
            style={{ width: '32rem' }} 
            breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
            header="Crear Nuevo Grupo" 
            modal 
            className="p-fluid" 
            footer={grupoDialogFooter}
            onHide={onHide}
        >
            
            <div className="field">
                <label htmlFor="identificador" className="font-bold">
                    Identificador del Grupo
                </label>
                <InputText 
                    id="identificador" 
                    value={grupoForm.identificador} 
                    onChange={(e) => onInputChange(e, 'identificador')} 
                    required 
                    autoFocus 
                    className={classNames({ 'p-invalid': submitted && !grupoForm.identificador })} 
                />
                {submitted && !grupoForm.identificador && <small className="p-error">El identificador es requerido.</small>}
            </div>
            
            <div className="field">
                <label htmlFor="asignatura" className="font-bold">
                    Asignatura
                </label>
                <Dropdown 
                    id="asignatura"
                    value={grupoForm.idAsignatura} 
                    options={asignaturas} 
                    optionLabel="nombre" 
                    onChange={(e) => onInputChange(e, 'asignatura')} 
                    placeholder="Seleccione una Asignatura"
                    required 
                    className={classNames({ 'p-invalid': submitted && !grupoForm.idAsignatura })} 
                />
                 {submitted && !grupoForm.idAsignatura && <small className="p-error">La asignatura es requerida.</small>}
            </div>

        </Dialog>
    );
};

export default GrupoDialog;