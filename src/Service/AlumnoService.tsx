import axios, { type AxiosResponse } from "axios";
import type { Alumno } from "../interface/AlumnoInterface";
const URL_BASE = "http://localhost:8080/alumno";

class AlumnoService {
    findAll(): Promise<AxiosResponse<Alumno[]>> {
        return axios.get(URL_BASE);
    }

    findById(idAlumno: number): Promise<AxiosResponse<Alumno>> {
        return axios.get(URL_BASE + '/' + idAlumno);
    }

    create(alumno: Alumno): Promise<AxiosResponse<Alumno>> {
        return axios.post(URL_BASE, alumno);
    }

    update(idAlumno: number, alumno: Alumno): Promise<AxiosResponse<void>> {
        return axios.put(URL_BASE + '/' + idAlumno, alumno);
    }

    delete(idAlumno: number): Promise<AxiosResponse<void>> {
        return axios.delete(URL_BASE + '/' + idAlumno);
    }
}

export default new AlumnoService();