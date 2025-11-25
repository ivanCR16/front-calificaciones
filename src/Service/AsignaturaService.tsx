import axios, { type AxiosResponse } from "axios";
import type { Asignatura } from "../interface/AsignaturaInterface";
const URL_BASE = "http://localhost:8080/asignatura";

class AsignaturaService {
    findAll(): Promise<AxiosResponse<Asignatura[]>> {
        return axios.get(URL_BASE);
    }

    findById(idAsignatura: number): Promise<AxiosResponse<Asignatura>> {
        return axios.get(URL_BASE + '/' + idAsignatura);
    }

    create(asignatura: Asignatura): Promise<AxiosResponse<Asignatura>> {
        return axios.post(URL_BASE, asignatura);
    }

    update(idAsignatura: number, asignatura: Asignatura): Promise<AxiosResponse<void>> {
        return axios.put(URL_BASE + '/' + idAsignatura, asignatura);
    }

    delete(idAsignatura: number): Promise<AxiosResponse<void>> {
        return axios.delete(URL_BASE + '/' + idAsignatura);
    }
}

export default new AsignaturaService();