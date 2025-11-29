import React from "react";
import { BreadCrumb } from "primereact/breadcrumb";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "./NavigationContext";

export default function SchoolBreadcrumb() {
    const navigate = useNavigate();
    const { breadcrumb } = useNavigation();

    const items = [];

    if (breadcrumb.asignatura) {
        items.push({
            label: breadcrumb.asignatura.label,
            command: () => navigate(`/asignatura/${breadcrumb.asignatura.id}`)
        });
    }

    if (breadcrumb.grupo) {
        items.push({
            label: breadcrumb.grupo.label,
            command: () => navigate(`/asignatura/${breadcrumb.asignatura.id}/grupo/${breadcrumb.grupo.id}`)
        });
    }

    if (breadcrumb.tema) {
        items.push({
            label: breadcrumb.tema.label,
            command: () => navigate(`/grupo/${breadcrumb.grupo.id}/tema/${breadcrumb.tema.id}`)
        });
    }

    if (breadcrumb.actividad) {
        items.push({
            label: breadcrumb.actividad.label,
            command: () =>
                navigate(`/tema/${breadcrumb.tema.id}/actividad/${breadcrumb.actividad.id}`)
        });
    }

    const home = breadcrumb.alumno
        ? { label: breadcrumb.alumno.label }
        : null;

    return (
        <div className="p-2">
            <BreadCrumb model={items} home={home} />
        </div>
    );
}
