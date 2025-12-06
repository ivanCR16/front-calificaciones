import axios, { type AxiosResponse } from "axios";
const URL_BASE = "http://localhost:8080/calificacion";
class CalificacionService {
    findAll(): Promise<AxiosResponse<any, any>> {
        return axios.get(URL_BASE);
    }
    findById(idCalificacion: number): Promise<AxiosResponse<any, any>> {
        return axios.get(`${URL_BASE}/${idCalificacion}`);
    }
    
    create(calificacion: object): Promise<AxiosResponse<any, any>> {
        return axios.post(URL_BASE, calificacion);
    }
    
    update(idCalificacion: number, calificacion: object): Promise<AxiosResponse<any, any>> {
        return axios.put(`${URL_BASE}/${idCalificacion}`, calificacion);
    }
    delete(idCalificacion: number): Promise<AxiosResponse<any, any>> {
        return axios.delete(`${URL_BASE}/${idCalificacion}`);
    }

    findByNoControl(NoControl: string): Promise<AxiosResponse<any, any>> {
        return axios.get(`${URL_BASE}/alumno/noControl/${NoControl}`);
    }
}
export default new CalificacionService();