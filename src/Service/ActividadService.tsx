import axios, { type AxiosResponse } from "axios";
const URL_BASE = "http://localhost:8080/actividad";
class ActividadService {
    findAll(): Promise<AxiosResponse<any, any>> {
        return axios.get(URL_BASE);
    }
    findById(idActividad: number): Promise<AxiosResponse<any, any>> {
        return axios.get(`${URL_BASE}/${idActividad}`);
    }
    
    create(actividad: object): Promise<AxiosResponse<any, any>> {
        return axios.post(URL_BASE, actividad);
    }
    
    update(idActividad: number, actividad: object): Promise<AxiosResponse<any, any>> {
        return axios.put(`${URL_BASE}/${idActividad}`, actividad);
    }
    delete(idActividad: number): Promise<AxiosResponse<any, any>> {
        return axios.delete(`${URL_BASE}/${idActividad}`);
    }
}
export default new ActividadService();