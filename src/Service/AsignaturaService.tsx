import axios from "axios";

const API_URL = "http://localhost:8080/api/asignatura";

export class AsignaturaService {

    getAll() {
        return axios.get(API_URL);
    }

    getById(id: number) {
        return axios.get(`${API_URL}/${id}`);
    }

    create(asignatura: any) {
        return axios.post(API_URL, asignatura);
    }

    update(id: number, asignatura: any) {
        return axios.put(`${API_URL}/${id}`, asignatura);
    }

    delete(id: number) {
        return axios.delete(`${API_URL}/${id}`);
    }
}

export default new AsignaturaService();
