import axios, { type AxiosResponse } from "axios";
const URL_BASE = "http://localhost:8080/docente";
class DocenteService {
    findAll(): Promise<AxiosResponse<any, any>> {
        return axios.get(URL_BASE);
    }
    findById(idDocente: number): Promise<AxiosResponse<any, any>> {
        return axios.get(`${URL_BASE}/${idDocente}`);
    }
    
    create(docente: object): Promise<AxiosResponse<any, any>> {
        return axios.post(URL_BASE, docente);
    }
    
    update(idDocente: number, docente: object): Promise<AxiosResponse<any, any>> {
        return axios.put(`${URL_BASE}/${idDocente}`, docente);
    }
    delete(idDocente: number): Promise<AxiosResponse<any, any>> {
        return axios.delete(`${URL_BASE}/${idDocente}`);
    }

    findAsignaturas(idDocente: number){
        return axios.get(`${URL_BASE}/${idDocente}/asignaturas`);
    }
}
export default new DocenteService();