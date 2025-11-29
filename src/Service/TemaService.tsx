import axios from "axios";

const URL_BASE = "http://localhost:8080/tema";

class TemaService {

    findAll() {
        return axios.get(URL_BASE);
    }

    findById(id: number) {
        return axios.get(`${URL_BASE}/${id}`);
    }

    create(tema: object) {
        return axios.post(URL_BASE, tema);
    }

    update(id: number, tema: object) {
        return axios.put(`${URL_BASE}/${id}`, tema);
    }

    delete(id: number) {
        return axios.delete(`${URL_BASE}/${id}`);
    }
}

export default new TemaService();