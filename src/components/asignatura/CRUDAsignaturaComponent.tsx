import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import AsignaturaService from "../../Service/AsignaturaService.tsx";
import { useAuth } from "../../auth/AuthContext.tsx";
// import { useNavigation } from "../../navigation/NavigationContext.tsx";

export interface Asignatura {
    idAsignatura: number;
    nombre: string;
    docente: object;
}

export default function CRUDAsignaturaComponent() {
    
    const emptyAsignatura: Asignatura = {
        idAsignatura: 0,
        nombre: '',
        docente:{}
    };

    const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
    const [asignatura, setAsignatura] = useState<Asignatura>(emptyAsignatura);

    const [asignaturaDialog, setAsignaturaDialog] = useState(false);
    const [deleteAsignaturaDialog, setDeleteAsignaturaDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);

    const dt = useRef<DataTable<Asignatura[]>>(null);

    useEffect(() => {
        // Replace with query by id docente
        const user = JSON.parse(localStorage.getItem('user') || '');
        console.log(user);

        AsignaturaService.findAll()
            .then((response) => setAsignaturas(response.data))
            .catch(e => console.log(e));
    }, []);

    const openNew = () => {
        setAsignatura(emptyAsignatura);
        setSubmitted(false);
        setAsignaturaDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAsignaturaDialog(false);
    };

    const hideDeleteAsignaturaDialog = () => {
        setDeleteAsignaturaDialog(false);
    };

    const findIndexById = (idAsignatura: number) => {
        return asignaturas.findIndex(a => a.idAsignatura === idAsignatura);
    };

    const saveAsignatura = async () => {
        setSubmitted(true);
        if (asignatura.nombre.trim()) {
            asignatura.docente = {
                idDocente: user.idDocente
            };
            console.log("before::",asignatura);
            const _asignaturas = [...asignaturas];
            const _asignatura = { ...asignatura };

            if (asignatura.idAsignatura) {
                console.log("##########",asignatura);
                console.log("##########",asignatura.idAsignatura);
                AsignaturaService.update(asignatura.idAsignatura, asignatura);
                const index = findIndexById(asignatura.idAsignatura);
                _asignaturas[index] = _asignatura;

                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Asignatura Actualizada',
                    life: 3000
                });

            } else {
                console.log("##########",_asignatura);
                _asignatura.idAsignatura = await createAsignatura(_asignatura);

                _asignaturas.push(_asignatura);

                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Asignatura Creada',
                    life: 3000
                });
            }

            setAsignaturas(_asignaturas);
            setAsignaturaDialog(false);
            setAsignatura(emptyAsignatura);
        }
    };

    const createAsignatura = async (_asignatura: Asignatura) => {
        let idAsignaturaResponse = 0;

        
        const { idAsignatura, ...newAsignatura } = _asignatura;

        await AsignaturaService.create(newAsignatura)
            .then((response) => {
                idAsignaturaResponse = response.data.idAsignatura;
            })
            .catch(error => console.log(error));

        return idAsignaturaResponse;
    };

    const editAsignatura = (asignatura: Asignatura) => {
        setAsignatura({ ...asignatura });
        setAsignaturaDialog(true);
    };

    const confirmDeleteAsignatura = (asignatura: Asignatura) => {
        setAsignatura(asignatura);
        setDeleteAsignaturaDialog(true);
    };

    const deleteAsignatura = () => {
        const _asignaturas = asignaturas.filter(a =>
            a.idAsignatura !== asignatura.idAsignatura
        );

        AsignaturaService.delete(asignatura.idAsignatura);
        setAsignaturas(_asignaturas);
        setDeleteAsignaturaDialog(false);
        setAsignatura(emptyAsignatura);

        toast.current?.show({
            severity: 'success',
            summary: 'Resultado',
            detail: 'Asignatura Eliminada',
            life: 3000
        });
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value || '';
        setAsignatura({ ...asignatura, nombre: val });
    };

    const leftToolbarTemplate = () => (
        <div className='flex flex-wrap gap-2'>
            <Button label='Nueva' icon='pi pi-plus' severity='success' onClick={openNew} />
        </div>
    );

    const rightToolbarTemplate = () => (
        <Button label='Exportar' icon='pi pi-upload' className='p-button-help' onClick={exportCSV} />
    );

    const actionBodyTemplate = (rowData: Asignatura) => (
        <>
            <Button icon='pi pi-pencil' rounded outlined className='mr-2' onClick={() => editAsignatura(rowData)} />
            <Button icon='pi pi-trash' rounded outlined severity='danger' onClick={() => confirmDeleteAsignatura(rowData)} />
        </>
    );

    const header = (
        <div className='flex flex-wrap gap-2 align-items-center justify-content-between'>
            <h4 className='m-0'>Gestión de Asignaturas</h4>
            <IconField iconPosition='left'>
                <InputIcon className='pi pi-search' />
                <InputText type='search' placeholder='Buscar...' onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    setGlobalFilter(target.value);
                }} />
            </IconField>
        </div>
    );

    const asignaturaDialogFooter = (
        <>
            <Button label='Cancelar' icon='pi pi-times' outlined onClick={hideDialog} />
            <Button label='Guardar' icon='pi pi-check' onClick={saveAsignatura} />
        </>
    );

    const deleteAsignaturaDialogFooter = (
        <>
            <Button label='No' icon='pi pi-times' outlined onClick={hideDeleteAsignaturaDialog} />
            <Button label='Sí' icon='pi pi-check' severity='danger' onClick={deleteAsignatura} />
        </>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className='card'>
                <Toolbar className='mb-4' left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable
                    ref={dt}
                    value={asignaturas}
                    dataKey='idAsignatura'
                    paginator rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    currentPageReportTemplate='Mostrando de {first} a {last} de {totalRecords} asignaturas'
                    globalFilter={globalFilter}
                    header={header}
                >
                    <Column field='idAsignatura' header='ID' sortable style={{ minWidth: '5rem' }}></Column>
                    <Column field='nombre' header='Nombre' sortable style={{ minWidth: '10rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={asignaturaDialog} style={{ width: '32rem' }}
                    header='Detalles de asignatura' modal className='p-fluid'
                    footer={asignaturaDialogFooter} onHide={hideDialog}>

                <div className='field'>
                    <label htmlFor='nombre' className='font-bold'>Nombre</label>
                    <InputText id='nombre' value={asignatura.nombre} onChange={onInputChange}
                               required autoFocus className={classNames({ 'p-invalid': submitted && !asignatura.nombre })} />
                </div>
            </Dialog>

            <Dialog visible={deleteAsignaturaDialog} style={{ width: '32rem' }}
                    header='Confirmar' modal footer={deleteAsignaturaDialogFooter}
                    onHide={hideDeleteAsignaturaDialog}>

                <div className='confirmation-content'>
                    <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
                    {asignatura && (
                        <span>¿Estás seguro de eliminar la asignatura <b>{asignatura.nombre}</b>?</span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
