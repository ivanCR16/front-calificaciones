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
import TemaService from "../../Service/TemaService.tsx";

export interface Tema {
    idTema: number;
    nombre: string;
    descripcion: string;
}

export default function CRUDTemaComponent() {

    const emptyTema: Tema = {
        idTema: 0,
        nombre: '',
        descripcion: ''
    };

    const [temas, setTemas] = useState<Tema[]>([]);
    const [tema, setTema] = useState<Tema>(emptyTema);

    const [temaDialog, setTemaDialog] = useState<boolean>(false);
    const [deleteTemaDialog, setDeleteTemaDialog] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');

    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Tema[]>>(null);

    useEffect(() => {
        TemaService.findAll().then((response) => setTemas(response.data));
    }, []);

    const openNew = () => {
        setTema(emptyTema);
        setSubmitted(false);
        setTemaDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setTemaDialog(false);
    };

    const hideDeleteTemaDialog = () => {
        setDeleteTemaDialog(false);
    };

    const findIndexById = (idTema: number) => {
        return temas.findIndex(t => t.idTema === idTema);
    };

    const saveTema = async () => {
        setSubmitted(true);

        if (tema.nombre.trim() && tema.descripcion.trim()) {

            const _temas = [...temas];
            const _tema = { ...tema };

            if (tema.idTema) {
                await TemaService.update(tema.idTema, tema);
                const index = findIndexById(tema.idTema);
                _temas[index] = _tema;

                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Tema Actualizado',
                    life: 3000
                });

            } else {
                _tema.idTema = await getIdTema(_tema);
                _temas.push(_tema);

                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Tema Creado',
                    life: 3000
                });
            }

            setTemas(_temas);
            setTemaDialog(false);
            setTema(emptyTema);
        }
    };

    const getIdTema = async (_tema: Tema) => {
        let idTema = 0;
        const newTema = {
            nombre: _tema.nombre,
            descripcion: _tema.descripcion
        };

        await TemaService.create(newTema)
            .then(response => idTema = response.data.idTema)
            .catch(err => console.log(err));

        return idTema;
    };

    const editTema = (tema: Tema) => {
        setTema({ ...tema });
        setTemaDialog(true);
    };

    const confirmDeleteTema = (tema: Tema) => {
        setTema(tema);
        setDeleteTemaDialog(true);
    };

    const deleteTema = () => {
        const _temas = temas.filter(t => t.idTema !== tema.idTema);
        TemaService.delete(tema.idTema);

        setTemas(_temas);
        setDeleteTemaDialog(false);
        setTema(emptyTema);

        toast.current?.show({
            severity: 'success',
            summary: 'Resultado',
            detail: 'Tema Eliminado',
            life: 3000
        });
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Tema) => {
        const val = e.target.value || '';
        setTema(prev => ({ ...prev, [field]: val }));
    };

    const leftToolbarTemplate = () => (
        <div className="flex flex-wrap gap-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />
        </div>
    );

    const rightToolbarTemplate = () => (
        <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
    );

    const actionBodyTemplate = (rowData: Tema) => (
        <>
            <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editTema(rowData)} />
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteTema(rowData)} />
        </>
    );

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Gestión de Temas</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText
                    type="search"
                    placeholder="Buscar..."
                    onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
                />
            </IconField>
        </div>
    );

    const temaDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveTema} />
        </>
    );

    const deleteTemaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteTemaDialog} />
            <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteTema} />
        </>
    );

    return (
        <div>
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />

                <DataTable
                    ref={dt}
                    value={temas}
                    dataKey="idTema"
                    paginator rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    globalFilter={globalFilter}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando de {first} a {last} de {totalRecords} temas"
                    header={header}
                >
                    <Column field="idTema" header="ID" sortable style={{ minWidth: '5rem' }} />
                    <Column field="nombre" header="Nombre" sortable style={{ minWidth: '10rem' }} />
                    <Column field="descripcion" header="Descripción" sortable style={{ minWidth: '12rem' }} />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />
                </DataTable>
            </div>

            <Dialog
                visible={temaDialog}
                style={{ width: '32rem' }}
                header="Detalles del Tema"
                modal
                className="p-fluid"
                footer={temaDialogFooter}
                onHide={hideDialog}
            >
                <div className="field">
                    <label htmlFor="nombre" className="font-bold">Nombre</label>
                    <InputText
                        id="nombre"
                        value={tema.nombre}
                        onChange={(e) => onInputChange(e, 'nombre')}
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !tema.nombre })}
                    />
                </div>

                <div className="field">
                    <label htmlFor="descripcion" className="font-bold">Descripción</label>
                    <InputText
                        id="descripcion"
                        value={tema.descripcion}
                        onChange={(e) => onInputChange(e, 'descripcion')}
                        required
                        className={classNames({ 'p-invalid': submitted && !tema.descripcion })}
                    />
                </div>
            </Dialog>

            <Dialog
                visible={deleteTemaDialog}
                style={{ width: '32rem' }}
                header="Confirmar"
                modal
                footer={deleteTemaDialogFooter}
                onHide={hideDeleteTemaDialog}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {tema && (
                        <span>
                            ¿Estás seguro de eliminar el tema <b>{tema.nombre}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
