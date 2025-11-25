import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';

import CrearGrupoDialog from './Dialog/CrearGrupoDialog';
import DeleteGrupoDialog from './Dialog/DeleteGrupoDialog';
import GrupoService from '../../Service/GrupoService';
import AsignaturaService from '../../Service/AsignaturaService';
import type { Grupo } from '../../interface/GrupoInterface';
import type { Asignatura } from '../../interface/AsignaturaInterface';
import type { DropdownChangeEvent } from 'primereact/dropdown';

const emptyGrupoForm = {
    identificador: '',
    asignatura: null, 
};

const emptyGrupo: Grupo = {
    idGrupo: null,
    identificador: '',
    alumnos: [],
};

export default function CRUDGrupoComponent() {
    
    const [grupos, setGrupos] = useState<any>(null);
    const [grupoDialog, setGrupoDialog] = useState<boolean>(false);
    const [deleteGrupoDialog, setDeleteGrupoDialog] = useState<boolean>(false);
    
    const [grupo, setGrupo] = useState<Grupo>(emptyGrupo); 
    
    const [grupoForm, setGrupoForm] = useState<any>(emptyGrupoForm);

    const [selectedGrupos, setSelectedGrupos] = useState<Grupo[] | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string | null>(null);
    const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
    
    const toast = useRef<any>(null);
    const dt = useRef<any>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const gruposResponse = await GrupoService.findAll();
                setGrupos(gruposResponse.data);

                const asignaturasResponse = await AsignaturaService.findAll();
                setAsignaturas(asignaturasResponse.data);

            } catch (error) {
                console.error("Error al cargar datos iniciales:", error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Fallo al cargar los datos iniciales (Grupos y Asignaturas)', life: 3000 });
            }
        };

        loadData();
    }, []);

    const openNew = () => {
        setGrupoForm(emptyGrupoForm);
        setGrupo(emptyGrupo);
        setSubmitted(false);
        setGrupoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setGrupoDialog(false);
    };

    const hideDeleteGrupoDialog = () => {
        setDeleteGrupoDialog(false);
    };

    const findIndexById = (idGrupo: number | null) => {
        let index = -1;
        if (!grupos) return index;

        for (let i = 0; i < grupos.length; i++) {
            if (grupos[i].idGrupo === idGrupo) {
                index = i;
                break;
            }
        }
        return index;
    };

    const saveGrupo = async () => {
        setSubmitted(true);
        
        if (grupoForm.identificador.trim() && grupoForm.asignatura) {
            
            const grupoData: any = {
                identificador: grupoForm.identificador,
                asignatura: {
                    idAsignatura: grupoForm.asignatura.idAsignatura,
                },
            };

            let _grupos = grupos ? [...grupos] : [];
            let _grupo = { ...grupo };

            try {
                if (_grupo.idGrupo) {
                    await GrupoService.update(_grupo.idGrupo, grupoData); 
                    
                    const index = findIndexById(_grupo.idGrupo);
                    
                    _grupos[index] = { ..._grupos[index], identificador: grupoData.identificador };
                    
                    toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Grupo Actualizado', life: 3000 });
                } else {
                    const response = await GrupoService.create(grupoData);
                    
                    const nuevoGrupo: Grupo = response.data;
                    console.log(nuevoGrupo)
                    _grupos.push(nuevoGrupo);
                    
                    toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Grupo Creado', life: 3000 });
                }

                setGrupos(_grupos);
                setGrupoDialog(false);
                setGrupoForm(emptyGrupoForm);
                setGrupo(emptyGrupo);
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Fallo en la operación', life: 3000 });
                console.error("CRUD Error:", error);
            }
        }
    };

    const editGrupo = (grupo: Grupo) => {
        setGrupo({ ...grupo });
        
        const asignaturaEjemplo = { idAsignatura: 1, nombre: 'Programación Web' };
        
        setGrupoForm({ 
            identificador: grupo.identificador,
            asignatura: asignaturaEjemplo
        });
        setGrupoDialog(true);
    };

    const confirmDeleteGrupo = (grupo: Grupo) => {
        setGrupo(grupo);
        setDeleteGrupoDialog(true);
    };

    const deleteGrupo = async () => {
        if (!grupo.idGrupo) return;
        
        try {
            await GrupoService.delete(grupo.idGrupo);
            let _grupos = grupos ? grupos.filter((val: Grupo) => val.idGrupo !== grupo.idGrupo) : [];
            setGrupos(_grupos);
            setDeleteGrupoDialog(false);
            setGrupo(emptyGrupo);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Grupo Eliminado', life: 3000 });
        } catch (error) {
             toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar', life: 3000 });
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement> | DropdownChangeEvent, name: keyof any) => {
        let val: any;

        if (name === 'asignatura') {
            val = (e as DropdownChangeEvent).value; 
        } else {
            val = (e.target as HTMLInputElement).value || '';
        }

        setGrupoForm((prev: any) => ({
            ...prev,
            [name]: val,
        }));
    };
    
    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Nuevo Grupo" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Exportar CSV" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const alumnosBodyTemplate = (rowData: any) => { 
        return <span>{rowData.alumnos?.length}</span>;
    };
    
    const actionBodyTemplate = (rowData: Grupo) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editGrupo(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteGrupo(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Gestión de Grupos</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} placeholder="Buscar..." />
            </IconField>
        </div>
    );
    
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable 
                    ref={dt} 
                    value={grupos} 
                    selection={selectedGrupos} 
                    onSelectionChange={(e) => setSelectedGrupos(e.value as Grupo[])}
                    dataKey="idGrupo"  
                    paginator 
                    rows={10} 
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} grupos" 
                    globalFilter={globalFilter} 
                    header={header}
                    emptyMessage="No se encontraron grupos."
                >
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="idGrupo" header="ID" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="identificador" header="Identificador" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column header="No. Alumnos" body={alumnosBodyTemplate} sortable style={{ minWidth: '10rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <CrearGrupoDialog
                asignaturas={asignaturas}
                visible={grupoDialog}
                grupoForm={grupoForm}
                submitted={submitted}
                onHide={hideDialog}
                saveGrupo={saveGrupo}
                onInputChange={onInputChange}
            />

            <DeleteGrupoDialog
                visible={deleteGrupoDialog}
                grupo={grupo}
                onHide={hideDeleteGrupoDialog}
                deleteGrupo={deleteGrupo}
            />
        </div>
    );
}