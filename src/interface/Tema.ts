import type {Asignatura} from "./Asignatura.ts";

export interface Tema {
    idTema: number;
    nombre: string;
    descripcion: string;
    asignatura: Asignatura;
}
