import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';

import DocenteService from '../../Service/DocenteService';

interface Docente {
    idDocente: number;
    nombre: string;
    apellido: string;
    usuario: string;
    hash_password: string;
}

export default function CRUDDocenteComponent() {

    const emptyDocente: Docente = {
        idDocente: 0,
        nombre: '',
        apellido: '',
        usuario: '',
        hash_password: ''
    };

    const [ docentes, setDocentes ] = useState<Docente[]>([]);
    const [ docente, setDocente ] = useState<Docente>(emptyDocente);

    const [ docenteDialog, setDocenteDialog ] = useState<boolean>(false);
    const [ deleteDocenteDialog, setDeleteDocenteDialog ] = useState<boolean>(false);
    const [ submitted, setSubmitted ] = useState<boolean>(false);
    const [ globalFilter, setGlobalFilter ] = useState<string>('');

    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        DocenteService.findAll().then(res => setDocentes(res.data));
    }, []);

    const openNew = () => {
        setDocente({ ...emptyDocente });
        setSubmitted(false);
        setDocenteDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDocenteDialog(false);
    };

    const hideDeleteDialog = () => {
        setDeleteDocenteDialog(false);
    };

    const saveDocente = async () => {
        setSubmitted(true);

        if (!docente.nombre.trim() 
            || !docente.apellido.trim()
            || !docente.usuario.trim()
            || !docente.hash_password.trim()) return;

        let lista = [...docentes];
        let item = { ...docente };

        if (item.idDocente) {
            await DocenteService.update(item.idDocente, item);
            const index = lista.findIndex(d => d.idDocente === item.idDocente);
            lista[index] = item;

            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Docente actualizado', life: 3000 });
        } else {
            const response = await DocenteService.create(item);
            item.idDocente = response.data.idDocente;
            lista.push(item);

            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Docente creado', life: 3000 });
        }

        setDocentes(lista);
        setDocenteDialog(false);
        setDocente(emptyDocente);
    };

    const editDocente = (row: Docente) => {
        setDocente({ ...row });
        setDocenteDialog(true);
    };

    const confirmDelete = (row: Docente) => {
        setDocente(row);
        setDeleteDocenteDialog(true);
    };

    const deleteDocente = async () => {
        await DocenteService.delete(docente.idDocente);
        setDocentes(docentes.filter(d => d.idDocente !== docente.idDocente));
        setDeleteDocenteDialog(false);

        toast.current?.show({ severity: 'success', summary: 'Eliminado', detail: 'Docente eliminado', life: 3000 });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setDocente({ ...docente, [field]: e.target.value });
    };

    const actionBodyTemplate = (rowData: Docente) => (
        <>
            <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editDocente(rowData)} />
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDelete(rowData)} />
        </>
    );

    const header = (
        <div className="flex justify-content-between">
            <h4 className="m-0">Gestión de Docentes</h4>
            <InputText 
                type="search" 
                placeholder="Buscar..." 
                onInput={(e: React.FormEvent<HTMLInputElement>) => setGlobalFilter((e.target as HTMLInputElement).value)} 
            />
        </div>
    );

    const dialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveDocente} />
        </>
    );

    const deleteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
            <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteDocente} />
        </>
    );

    return (
        <div>
            <Toast ref={toast} />

            <div className="card">
                <Toolbar 
                    className="mb-4" 
                    left={() => <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />} 
                />
                
                <DataTable
                    ref={dt}
                    value={docentes}
                    dataKey="idDocente"
                    paginator rows={10}
                    header={header}
                    globalFilter={globalFilter}
                >
                    <Column field="idDocente" header="ID" sortable></Column>
                    <Column field="nombre" header="Nombre" sortable></Column>
                    <Column field="apellido" header="Apellido" sortable></Column>
                    <Column field="usuario" header="Usuario" sortable></Column>
                    <Column field="hash_password" header="Password Hash"></Column>
                    <Column body={actionBodyTemplate} exportable={false}></Column>
                </DataTable>
            </div>

            {/* MODAL */}
            <Dialog 
                visible={docenteDialog} 
                style={{ width: '35rem' }} 
                header="Datos del Docente" 
                modal 
                footer={dialogFooter} 
                onHide={hideDialog}
            >
                <div className="field">
                    <label>Nombre</label>
                    <InputText 
                        value={docente.nombre} 
                        onChange={(e) => onInputChange(e, 'nombre')}
                        className={classNames({ 'p-invalid': submitted && !docente.nombre })}
                    />
                </div>

                <div className="field">
                    <label>Apellido</label>
                    <InputText 
                        value={docente.apellido} 
                        onChange={(e) => onInputChange(e, 'apellido')}
                        className={classNames({ 'p-invalid': submitted && !docente.apellido })}
                    />
                </div>

                <div className="field">
                    <label>Usuario</label>
                    <InputText 
                        value={docente.usuario} 
                        onChange={(e) => onInputChange(e, 'usuario')}
                        className={classNames({ 'p-invalid': submitted && !docente.usuario })}
                    />
                </div>

                <div className="field">
                    <label>Password Hash</label>
                    <InputText 
                        value={docente.hash_password} 
                        onChange={(e) => onInputChange(e, 'hash_password')}
                        className={classNames({ 'p-invalid': submitted && !docente.hash_password })}
                    />
                </div>
            </Dialog>

            <Dialog visible={deleteDocenteDialog} header="Confirmar" modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                <span>¿Eliminar al docente <b>{docente.nombre} {docente.apellido}</b>?</span>
            </Dialog>
        </div>
    );
}
