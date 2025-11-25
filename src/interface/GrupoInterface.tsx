import type { Alumno } from "./AlumnoInterface";

export interface Grupo {
    idGrupo:       number | null;
    identificador: string;
    idAsignatura?: number | null;
    alumnos?:       Alumno[];
}