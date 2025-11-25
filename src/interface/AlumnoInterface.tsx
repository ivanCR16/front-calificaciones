import type { Calificacion } from "./CalificacionInterface";

export interface Alumno {
    idAlumno:       number | null;
    nombre:         string;
    apellidos:      string;
    no_control:     string;
    correo:         string;
    calificaciones: Calificacion[];
}
