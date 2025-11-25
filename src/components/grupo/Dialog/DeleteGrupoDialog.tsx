import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import type { Grupo } from '../../../interface/GrupoInterface';

interface DeleteGrupoDialogProps {
    grupo: Grupo;
    visible: boolean;
    onHide: () => void;
    deleteGrupo: () => void;
}

const DeleteGrupoDialog: React.FC<DeleteGrupoDialogProps> = ({
    grupo,
    visible,
    onHide,
    deleteGrupo,
}) => {

    const deleteGrupoDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={onHide} />
            <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteGrupo} />
        </React.Fragment>
    );

    return (
        <Dialog 
            visible={visible} 
            style={{ width: '32rem' }} 
            breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
            header="Confirmar Eliminación de Grupo" 
            modal 
            footer={deleteGrupoDialogFooter} 
            onHide={onHide}
        >
            <div className="confirmation-content flex align-items-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem', color: 'var(--red-500)' }} />
                
                {grupo && (
                    <span>
                        ¿Está seguro de que desea eliminar el grupo **{grupo.identificador}**?
                    </span>
                )}
            </div>
        </Dialog>
    );
};

export default DeleteGrupoDialog;