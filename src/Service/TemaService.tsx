import axios from "axios";

const API_URL = "http://localhost:8080/api/tema";

export class TemaService {

    getAll() {
        return axios.get(API_URL);
    }

    getById(id: number) {
        return axios.get(`${API_URL}/${id}`);
    }

    create(tema: any) {
        return axios.post(API_URL, tema);
    }

    update(id: number, tema: any) {
        return axios.put(`${API_URL}/${id}`, tema);
    }

    delete(id: number) {
        return axios.delete(`${API_URL}/${id}`);
    }
}

export default new TemaService();

