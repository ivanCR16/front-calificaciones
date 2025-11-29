import React from "react";
import { BreadCrumb } from "primereact/breadcrumb";
import { useNavigate } from "react-router-dom";
import { type Asignatura } from "../../interface/AsignaturaInterface";

export default function NavigationHistory({ history:Array = [] }) {
    const navigate = useNavigate();

    const items = history.slice(0, -1).map((asignatura:Asignatura) => ({
        label: h.label,
        command: () => navigate(h.path)
    }));

    const home = history.length
        ? { label: history[history.length - 1].label }
        : null;

    return (
        <div className="my-3">
            <BreadCrumb model={items} home={home} />
        </div>
    );
}