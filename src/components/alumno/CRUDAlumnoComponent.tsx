import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';

// --- Imports de Alumno ---
import AlumnoService from '../../Service/AlumnoService';
import CrearAlumnoDialog from './dialog/CrearAlumnoDialog';
import DeleteAlumnoDialog from './dialog/DeleteAlumnoDialog';
import type { Alumno } from '../../interface/AlumnoInterface';
import type { DropdownChangeEvent } from 'primereact/dropdown';

// Interfaces y datos iniciales (redefinidos aquí para contexto)
interface AlumnoForm {
    nombre: string;
    apellidos: string;
    noControl: string;
    correo: string;
}

const emptyAlumnoForm: AlumnoForm = {
    nombre: '',
    apellidos: '',
    noControl: '',
    correo: '',
};

const emptyAlumno: Alumno = {
    idAlumno: null,
    nombre: '',
    apellidos: '',
    noControl: '',
    correo: '',
    calificaciones: [],
};

export default function CRUDAlumnoComponent() {
    
    // --- ESTADOS ---
    const [alumnos, setAlumnos] = useState<any>(null);
    const [alumnoDialog, setAlumnoDialog] = useState<boolean>(false);
    const [deleteAlumnoDialog, setDeleteAlumnoDialog] = useState<boolean>(false);
    
    const [alumno, setAlumno] = useState<Alumno>(emptyAlumno); 
    const [alumnoForm, setAlumnoForm] = useState<AlumnoForm>(emptyAlumnoForm);

    const [selectedAlumnos, setSelectedAlumnos] = useState<Alumno[] | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string | null>(null);
    
    const toast = useRef<any>(null);
    const dt = useRef<any>(null);

    // Carga inicial de datos
    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await AlumnoService.findAll();
                setAlumnos(response.data);
            } catch (error) {
                console.error("Error al cargar alumnos:", error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Fallo al cargar la lista de alumnos', life: 3000 });
            }
        };

        loadData();
    }, []);

    // --- Funciones de Manejo de Vistas y Estado ---

    const openNew = () => {
        setAlumnoForm(emptyAlumnoForm);
        setAlumno(emptyAlumno);
        setSubmitted(false);
        setAlumnoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAlumnoDialog(false);
    };

    const hideDeleteAlumnoDialog = () => {
        setDeleteAlumnoDialog(false);
    };

    const findIndexById = (idAlumno: number | null) => {
        let index = -1;
        if (!alumnos) return index;

        for (let i = 0; i < alumnos.length; i++) {
            if (alumnos[i].idAlumno === idAlumno) {
                index = i;
                break;
            }
        }
        return index;
    };

    // --- Funciones CRUD ---

    const saveAlumno = async () => {
        setSubmitted(true);
        
        // Validación de campos clave
        if (alumnoForm.nombre.trim() && alumnoForm.noControl.trim()) {
            
            // Combinar los datos del formulario con los del objeto Alumno (para edición)
            let _alumno = { ...alumno, ...alumnoForm }; 

            let _alumnos = alumnos ? [...alumnos] : [];

            try {
                if (_alumno.idAlumno) {
                    // --- ACTUALIZAR ---
                    await AlumnoService.update(_alumno.idAlumno, _alumno);
                    
                    const index = findIndexById(_alumno.idAlumno);
                    _alumnos[index] = _alumno;
                    
                    toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Alumno Actualizado', life: 3000 });
                } else {
                    // --- CREAR ---
                    // El DTO a enviar es _alumno (sin idAlumno)
                    const response = await AlumnoService.create(_alumno);
                    
                    // Asumimos que el backend devuelve el objeto Alumno COMPLETO (con idAlumno)
                    const nuevoAlumno: Alumno = response.data;
                    _alumnos.push(nuevoAlumno);
                    
                    toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Alumno Creado', life: 3000 });
                }

                setAlumnos(_alumnos);
                setAlumnoDialog(false);
                setAlumnoForm(emptyAlumnoForm);
                setAlumno(emptyAlumno);
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Fallo en la operación', life: 3000 });
                console.error("CRUD Error:", error);
            }
        }
    };

    const editAlumno = (alumno: Alumno) => {
        setAlumno({ ...alumno });
        
        // Cargar solo los campos del formulario
        setAlumnoForm({ 
            nombre: alumno.nombre,
            apellidos: alumno.apellidos,
            noControl: alumno.noControl,
            correo: alumno.correo,
        });
        setAlumnoDialog(true);
    };

    const confirmDeleteAlumno = (alumno: Alumno) => {
        setAlumno(alumno);
        setDeleteAlumnoDialog(true);
    };

    const deleteAlumno = async () => {
        if (!alumno.idAlumno) return;
        
        try {
            await AlumnoService.delete(alumno.idAlumno);
            let _alumnos = alumnos ? alumnos.filter((val: Alumno) => val.idAlumno !== alumno.idAlumno) : [];
            setAlumnos(_alumnos);
            setDeleteAlumnoDialog(false);
            setAlumno(emptyAlumno);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Alumno Eliminado', life: 3000 });
        } catch (error) {
             toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar', life: 3000 });
        }
    };

    // --- Manejadores de Input ---

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | DropdownChangeEvent, name: keyof AlumnoForm) => {
        const val = (e.target as HTMLInputElement).value || '';
        
        setAlumnoForm((prev) => ({
            ...prev,
            [name]: val,
        }));
    };
    
    // --- Plantillas de la Interfaz (Toolbar y Columnas) ---

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Nuevo Alumno" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const calificacionesBodyTemplate = (rowData: Alumno) => { 
        // Mostrar el número de calificaciones (puede ser 0 si no se envían)
        return <span>{(rowData.calificaciones ?? []).length}</span>;
    };
    
    const actionBodyTemplate = (rowData: Alumno) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editAlumno(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteAlumno(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Gestión de Alumnos</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} placeholder="Buscar..." />
            </IconField>
        </div>
    );
    
    // --- Renderizado Principal ---

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                <DataTable 
                    ref={dt} 
                    value={alumnos} 
                    selection={selectedAlumnos} 
                    onSelectionChange={(e) => setSelectedAlumnos(e.value as Alumno[])}
                    dataKey="idAlumno"  
                    paginator 
                    rows={10} 
                    rowsPerPageOptions={[5, 10, 25]}
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} alumnos" 
                    globalFilter={globalFilter} 
                    header={header}
                    emptyMessage="No se encontraron alumnos."
                >
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="idAlumno" header="ID" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="noControl" header="No. Control" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="nombre" header="Nombre" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="apellidos" header="Apellidos" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="correo" header="Correo" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column header="No. Calificaciones" body={calificacionesBodyTemplate} sortable style={{ minWidth: '10rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <CrearAlumnoDialog
                visible={alumnoDialog}
                alumnoForm={alumnoForm} 
                submitted={submitted}
                onHide={hideDialog}
                saveAlumno={saveAlumno}
                onInputChange={onInputChange} 
            />

            <DeleteAlumnoDialog
                visible={deleteAlumnoDialog}
                alumno={alumno}
                onHide={hideDeleteAlumnoDialog}
                deleteAlumno={deleteAlumno}
            />
        </div>
    );
}