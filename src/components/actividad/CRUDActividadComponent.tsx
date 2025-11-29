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
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';

import ActividadService from '../../Service/ActividadService';
//import TemaService from '../services/TemaService';

interface Tema {
    idTema: number;
    nombre: string;
}

interface Actividad {
    idActividad: number;
    tema: Tema | null;
    nombre: string;
    descripcion: string;
    calificacionEspecifica: number;
    valorActividad: number;
    indicadorA: number;
    indicadorB: number;
    indicadorC: number;
    indicadorD: number;
    indicadorE: number;
    indicadorF: number;
    instrumento: string;
    metodoA: string;
    metodoB: string;
    metodoC: string;
}

export default function CRUDActividadComponent() {

    const emptyActividad: Actividad = {
        idActividad: 0,
        tema: null,
        nombre: '',
        descripcion: '',
        calificacionEspecifica: 0,
        valorActividad: 0,
        indicadorA: 0,
        indicadorB: 0,
        indicadorC: 0,
        indicadorD: 0,
        indicadorE: 0,
        indicadorF: 0,
        instrumento: '',
        metodoA: '',
        metodoB: '',
        metodoC: ''
    };

    const [ actividades, setActividades ] = useState<Actividad[]>([]);
    const [ actividad, setActividad ] = useState<Actividad>(emptyActividad);

    const [ temas, setTemas ] = useState<Tema[]>([]);
    const [ actividadDialog, setActividadDialog ] = useState<boolean>(false);
    const [ deleteActividadDialog, setDeleteActividadDialog ] = useState<boolean>(false);
    const [ submitted, setSubmitted ] = useState<boolean>(false);
    const [ globalFilter, setGlobalFilter ] = useState<string>('');

    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        ActividadService.findAll().then(res => setActividades(res.data));
        //TemaService.findAll().then((res: { data: React.SetStateAction<Tema[]>; }) => setTemas(res.data));
    }, []);

    const openNew = () => {
        setActividad({...emptyActividad});
        setSubmitted(false);
        setActividadDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setActividadDialog(false);
    };

    const hideDeleteDialog = () => {
        setDeleteActividadDialog(false);
    };

    const saveActividad = async () => {
        setSubmitted(true);

        if (!actividad.nombre.trim() || !actividad.descripcion.trim() || !actividad.tema) return;

        let lista = [...actividades];
        let item = { ...actividad };

        if (item.idActividad) {
            await ActividadService.update(item.idActividad, item);
            const index = lista.findIndex(a => a.idActividad === item.idActividad);
            lista[index] = item;

            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Actividad actualizada', life: 3000 });
        } else {
            const response = await ActividadService.create(item);
            item.idActividad = response.data.idActividad;
            lista.push(item);

            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Actividad creada', life: 3000 });
        }

        setActividades(lista);
        setActividadDialog(false);
        setActividad(emptyActividad);
    };

    const editActividad = (row: Actividad) => {
        setActividad({ ...row });
        setActividadDialog(true);
    };

    const confirmDelete = (row: Actividad) => {
        setActividad(row);
        setDeleteActividadDialog(true);
    };

    const deleteActividad = async () => {
        await ActividadService.delete(actividad.idActividad);
        setActividades(actividades.filter(a => a.idActividad !== actividad.idActividad));
        setDeleteActividadDialog(false);

        toast.current?.show({ severity: 'success', summary: 'Eliminado', detail: 'Actividad eliminada', life: 3000 });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setActividad({ ...actividad, [field]: e.target.value });
    };

    const onNumberChange = (e: any, field: string) => {
        setActividad({ ...actividad, [field]: e.value });
    };

    const onTemaChange = (e: any) => {
        setActividad({ ...actividad, tema: e.value });
    };

    const actionBodyTemplate = (rowData: Actividad) => (
        <>
            <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editActividad(rowData)} />
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDelete(rowData)} />
        </>
    );

    const header = (
        <div className="flex justify-content-between">
            <h4 className="m-0">Gestión de Actividades</h4>
            <InputText type="search" placeholder="Buscar..." onInput={(event: React.FormEvent<HTMLInputElement>, validatePattern: boolean) => setGlobalFilter(event.target.value)} />
        </div>
    );

    const dialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveActividad} />
        </>
    );

    const deleteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
            <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteActividad} />
        </>
    );

    return (
        <div>
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="mb-4" left={() => <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />} />
                
                <DataTable
                    ref={dt}
                    value={actividades}
                    dataKey="idActividad"
                    paginator rows={10}
                    header={header}
                    globalFilter={globalFilter}
                >
                    <Column field="idActividad" header="ID" sortable></Column>
                    <Column field="nombre" header="Nombre" sortable></Column>
                    <Column field="descripcion" header="Descripción"></Column>
                    <Column header="Tema" body={(row) => row.tema?.nombre}></Column>
                    <Column field="valorActividad" header="Valor"></Column>
                    <Column body={actionBodyTemplate} exportable={false}></Column>
                </DataTable>
            </div>

            {/* Modal */}
            <Dialog visible={actividadDialog} style={{ width: '40rem' }} header="Datos de Actividad" modal footer={dialogFooter} onHide={hideDialog}>
                
                <div className="field">
                    <label>Tema</label>
                    <Dropdown value={actividad.tema} options={temas} optionLabel="nombre" placeholder="Seleccione un tema"
                        onChange={onTemaChange} className={classNames({ 'p-invalid': submitted && !actividad.tema })}/>
                </div>

                <div className="field">
                    <label>Nombre</label>
                    <InputText value={actividad.nombre} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange(e, 'nombre')}
                        className={classNames({ 'p-invalid': submitted && !actividad.nombre })}/>
                </div>

                <div className="field">
                    <label>Descripción</label>
                    <InputText value={actividad.descripcion} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange(e, 'descripcion')}
                        className={classNames({ 'p-invalid': submitted && !actividad.descripcion })}/>
                </div>

                <h5>Indicadores</h5>

                {['indicadorA','indicadorB','indicadorC','indicadorD','indicadorE','indicadorF'].map(ind => (
                    <div key={ind} className="field">
                        <label>{ind}</label>
                        {/*@ts-ignore*/}
                        <InputNumber value={actividad[ind]} onValueChange={(e) => onNumberChange(e, ind)} />
                    </div>
                ))}

                <div className="field">
                    <label>Valor Actividad</label>
                    <InputNumber value={actividad.valorActividad} onValueChange={(e) => onNumberChange(e, 'valorActividad')} />
                </div>

                <div className="field">
                    <label>Calificación Específica</label>
                    <InputNumber value={actividad.calificacionEspecifica} onValueChange={(e) => onNumberChange(e, 'calificacionEspecifica')} mode="decimal" minFractionDigits={1}/>
                </div>

                <h5>Métodos e instrumento</h5>

                <div className="field">
                    <label>Instrumento</label>
                    <InputText value={actividad.instrumento} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange(e, 'instrumento')} />
                </div>

                <div className="field">
                    <label>Método A</label>
                    <InputText value={actividad.metodoA} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange(e, 'metodoA')} />
                </div>

                <div className="field">
                    <label>Método B</label>
                    <InputText value={actividad.metodoB} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange(e, 'metodoB')} />
                </div>

                <div className="field">
                    <label>Método C</label>
                    <InputText value={actividad.metodoC} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange(e, 'metodoC')} />
                </div>

            </Dialog>

            <Dialog visible={deleteActividadDialog} header="Confirmar" modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                <span>¿Eliminar actividad <b>{actividad.nombre}</b>?</span>
            </Dialog>
        </div>
    );
}
