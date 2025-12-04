import axios from "axios";

const URL_BASE = "http://localhost:8080/asignatura";

class AsignaturaService {

    findAll() {
        return axios.get(URL_BASE);
    }

    findById(id: number) {
        return axios.get(`${URL_BASE}/${id}`);
    }

    create(asignatura: object) {
        return axios.post(URL_BASE, asignatura);
    }

    update(id: number, asignatura: object) {
        return axios.put(`${URL_BASE}/${id}`, asignatura);
    }

    delete(id: number) {
        return axios.delete(`${URL_BASE}/${id}`);
    }

    findGroups(idAsignatura: number){
        return axios.get(`${URL_BASE}/${idAsignatura}/grupos`);
    }

    findTopicsByAsignaturaId(idAsignatura: number){
        return axios.get(`${URL_BASE}/${idAsignatura}/temas`);
    }
}

export default new AsignaturaService();
