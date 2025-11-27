import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";

import TemaService from "components/tema/TemaService";
import AsignaturaService from "components/asignatura/AsignaturaService";

import { Tema } from "components/tema/Tema";
import { Asignatura } from "components/asignatura/Asignatura";

export default function CRUDTemaComponent() {

    const emptyTema: Tema = {
        idTema: 0,
        nombre: "",
        descripcion: "",
        asignatura: { idAsignatura: 0, nombre: "", docente: { idDocente: 0, nombre: "" } }
    };

    const [temas, setTemas] = useState<Tema[]>([]);
    const [tema, setTema] = useState<Tema>(emptyTema);
    const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);

    const [temaDialog, setTemaDialog] = useState<boolean>(false);
    const [deleteTemaDialog, setDeleteTemaDialog] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>("");

    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Tema>>(null);

    // Cargar temas y asignaturas
    useEffect(() => {
        TemaService.findAll().then((res) => setTemas(res.data));
        AsignaturaService.findAll().then((res) => setAsignaturas(res.data));
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

    const saveTema = async () => {
        setSubmitted(true);

        if (tema.nombre.trim() && tema.descripcion.trim() && tema.asignatura.idAsignatura) {
            const _temas = [...temas];
            const _tema = { ...tema };

            if (tema.idTema) {
                await TemaService.update(tema.idTema, _tema);
                const index = _temas.findIndex(t => t.idTema === tema.idTema);
                _temas[index] = _tema;

                toast.current?.show({
                    severity: "success",
                    summary: "Éxito",
                    detail: "Tema actualizado",
                    life: 2000
                });

            } else {
                const response = await TemaService.create({
                    nombre: _tema.nombre,
                    descripcion: _tema.descripcion,
                    asignatura: { idAsignatura: _tema.asignatura.idAsignatura }
                });

                _tema.idTema = response.data.idTema;
                _temas.push(_tema);

                toast.current?.show({
                    severity: "success",
                    summary: "Éxito",
                    detail: "Tema creado",
                    life: 2000
                });
            }

            setTemas(_temas);
            setTemaDialog(false);
            setTema(emptyTema);
        }
    };

    const editTema = (rowData: Tema) => {
        setTema({ ...rowData });
        setTemaDialog(true);
    };

    const confirmDeleteTema = (rowData: Tema) => {
        setTema(rowData);
        setDeleteTemaDialog(true);
    };

    const deleteTema = async () => {
        await TemaService.delete(tema.idTema);

        setTemas(temas.filter((t) => t.idTema !== tema.idTema));
        setDeleteTemaDialog(false);
        setTema(emptyTema);

        toast.current?.show({
            severity: "success",
            summary: "Eliminado",
            detail: "Tema eliminado correctamente",
            life: 2000
        });
    };

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

    const actionBodyTemplate = (rowData: Tema) => (
        <>
            <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editTema(rowData)} />
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteTema(rowData)} />
        </>
    );

    return (
        <div className="card">
            <Toast ref={toast} />

            <Toolbar
                className="mb-4"
                left={<Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />}
            />

            <DataTable
                ref={dt}
                value={temas}
                paginator rows={10}
                globalFilter={globalFilter}
                dataKey="idTema"
            >
                <Column field="idTema" header="ID" sortable style={{ minWidth: "6rem" }} />
                <Column field="nombre" header="Nombre" sortable />
                <Column field="descripcion" header="Descripción" sortable />
                <Column field="asignatura.nombre" header="Asignatura" sortable />
                <Column body={actionBodyTemplate} header="Acciones" />
            </DataTable>

            {/* Dialog Crear/Editar */}
            <Dialog
                visible={temaDialog}
                style={{ width: "30rem" }}
                header="Detalles del Tema"
                footer={temaDialogFooter}
                modal
                onHide={hideDialog}
            >
                <div className="field">
                    <label htmlFor="nombre">Nombre</label>
                    <InputText
                        id="nombre"
                        value={tema.nombre}
                        onChange={(e) => setTema({ ...tema, nombre: e.target.value })}
                        className={classNames({ "p-invalid": submitted && !tema.nombre })}
                    />
                </div>

                <div className="field">
                    <label htmlFor="descripcion">Descripción</label>
                    <InputText
                        id="descripcion"
                        value={tema.descripcion}
                        onChange={(e) => setTema({ ...tema, descripcion: e.target.value })}
                        className={classNames({ "p-invalid": submitted && !tema.descripcion })}
                    />
                </div>

                <div className="field">
                    <label>Asignatura</label>
                    <Dropdown
                        value={tema.asignatura}
                        onChange={(e) => setTema({ ...tema, asignatura: e.value })}
                        options={asignaturas}
                        optionLabel="nombre"
                        placeholder="Selecciona una asignatura"
                        className={classNames({ "p-invalid": submitted && !tema.asignatura.idAsignatura })}
                    />
                </div>
            </Dialog>

            {/* Dialog Eliminar */}
            <Dialog
                visible={deleteTemaDialog}
                header="Confirmar"
                modal
                style={{ width: "25rem" }}
                footer={deleteTemaDialogFooter}
                onHide={hideDeleteTemaDialog}
            >
                <span>¿Seguro que deseas eliminar el tema <b>{tema.nombre}</b>?</span>
            </Dialog>
        </div>
    );
}