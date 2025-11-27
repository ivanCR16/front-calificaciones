import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import {AsignaturaService} from "../../Service/AsignaturaService.tsx";
import type {Asignatura} from "../../interface/Asignatura.ts";
import {Dialog} from "primereact/dialog";

export default function CRUDAsignaturaComponent() {

    const emptyAsignatura: Asignatura = {
        idAsignatura: 0,
        nombre: ''
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
        loadAsignaturas();
    }, []);

    const loadAsignaturas = () => {
        AsignaturaService.getAll().then((res) => setAsignaturas(res.data));
    };

    const openNew = () => {
        setAsignatura(emptyAsignatura);
        setSubmitted(false);
        setAsignaturaDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAsignaturaDialog(false);
    };

    const hideDeleteDialog = () => {
        setDeleteAsignaturaDialog(false);
    };

    const saveAsignatura = async () => {
        setSubmitted(true);

        if (asignatura.nombre.trim()) {
            const data = { nombre: asignatura.nombre };

            if (asignatura.idAsignatura === 0) {

                const response = await AsignaturaService.create(data);
                setAsignaturas([...asignaturas, response.data]);

                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Asignatura creada',
                    life: 3000
                });

            } else {

                await AsignaturaService.update(asignatura.idAsignatura, asignatura);

                const updated = asignaturas.map((a) =>
                    a.idAsignatura === asignatura.idAsignatura ? asignatura : a
                );

                setAsignaturas(updated);

                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Asignatura actualizada',
                    life: 3000
                });
            }

            setAsignaturaDialog(false);
            setAsignatura(emptyAsignatura);
        }
    };

    const editAsignatura = (rowData: Asignatura) => {
        setAsignatura({ ...rowData });
        setAsignaturaDialog(true);
    };

    const confirmDeleteAsignatura = (rowData: Asignatura) => {
        setAsignatura(rowData);
        setDeleteAsignaturaDialog(true);
    };

    const deleteAsignatura = async () => {
        await AsignaturaService.delete(asignatura.idAsignatura);

        const updated = asignaturas.filter(a =>
            a.idAsignatura !== asignatura.idAsignatura
        );

        setAsignaturas(updated);
        setDeleteAsignaturaDialog(false);

        toast.current?.show({
            severity: 'success',
            summary: 'Eliminada',
            detail: 'Asignatura eliminada',
            life: 3000
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAsignatura({ ...asignatura, nombre: value });
    };

    const leftToolbarTemplate = () => (
        <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />
    );

    const rightToolbarTemplate = () => (
        <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={() => dt.current?.exportCSV()} />
    );

    const actionBodyTemplate = (rowData: Asignatura) => (
        <>
            <Button icon="pi pi-pencil" rounded outlined className="mr-2"
                    onClick={() => editAsignatura(rowData)} />
            <Button icon="pi pi-trash" rounded outlined severity="danger"
                    onClick={() => confirmDeleteAsignatura(rowData)} />
        </>
    );

    const header = (
        <div className="flex justify-content-between align-items-center">
            <h4 className="m-0">Gestión de Asignaturas</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText placeholder="Buscar..."
                           onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} />
            </IconField>
        </div>
    );

    const asignaturaDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveAsignatura} />
        </>
    );

    const deleteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
            <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteAsignatura} />
        </>
    );

    return (
        <div className="card">
            <Toast ref={toast} />

            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />

            <DataTable
                ref={dt}
                value={asignaturas}
                paginator rows={10}
                dataKey="idAsignatura"
                globalFilter={globalFilter}
                header={header}
            >
                <Column field="idAsignatura" header="ID" sortable style={{ minWidth: '6rem' }} />
                <Column field="nombre" header="Nombre" sortable style={{ minWidth: '12rem' }} />
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />
            </DataTable>

            <Dialog visible={asignaturaDialog} style={{ width: '30rem' }}
                    header="Detalles de la Asignatura" modal className="p-fluid"
                    footer={asignaturaDialogFooter} onHide={hideDialog}>

                <div className="field">
                    <label htmlFor="nombre">Nombre</label>
                    <InputText
                        id="nombre"
                        value={asignatura.nombre}
                        onChange={onInputChange}
                        required autoFocus
                        className={classNames({ 'p-invalid': submitted && !asignatura.nombre })}
                    />
                </div>

            </Dialog>

            <Dialog visible={deleteAsignaturaDialog} style={{ width: '30rem' }}
                    header="Confirmar" modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    ¿Deseas eliminar <b>{asignatura.nombre}</b>?
                </div>
            </Dialog>
        </div>
    );
}
