import type { Calificacion } from "./CalificacionInterface";

export interface Alumno {
    idAlumno:       number | null;
    nombre:         string;
    apellidos:      string;
    noControl:     string;
    correo:         string;
    calificaciones: Calificacion[];
}
