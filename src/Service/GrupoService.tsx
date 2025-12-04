import axios, { type AxiosResponse } from "axios";
import type { Grupo } from "../interface/GrupoInterface";
const URL_BASE = "http://localhost:8080/grupo";

class GrupoService {
    findAll(): Promise<AxiosResponse<Grupo[]>> {
        return axios.get(URL_BASE);
    }

    findById(idGrupo: number): Promise<AxiosResponse<Grupo>> {
        return axios.get(URL_BASE + '/' + idGrupo);
    }

    create(grupo: Grupo): Promise<AxiosResponse<Grupo>> {
        return axios.post(URL_BASE, grupo);
    }

    update(idGrupo: number, grupo: Grupo): Promise<AxiosResponse<void>> {
        return axios.put(URL_BASE + '/' + idGrupo, grupo);
    }

    delete(idGrupo: number): Promise<AxiosResponse<void>> {
        return axios.delete(URL_BASE + '/' + idGrupo);
    }

    findStudentsByGroupId(idGrupo: number){
        return axios.get(`${URL_BASE}/${idGrupo}/alumnos`);
    }
}

export default new GrupoService();