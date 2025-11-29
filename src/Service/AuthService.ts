import { use } from "react";
const URL_BASE = "http://localhost:8080/docente";
import axios, { type AxiosResponse } from "axios";

async function hashPassword(password:string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // Convertir buffer a string hex
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    return hashHex.substring(0, 8);
}

export const registerUser = async (nombre:string, apellido:string, username:string, password:string) => {
    try {
        const hash_password = await hashPassword(password);
        const docente = {
            nombre,
            apellido,
            usuario:username,
            hash_password
        };
        const response = await fetch("http://localhost:8080/docente", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                grant_type: "password",
                ...docente
            })
        });

        //const response = await axios.post(URL_BASE, docente);
        //console.log(response.status === 201);

        if (!response.ok) {
            throw new Error("No se pudo registrar el usuario");
        }

        return response;

        
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (username:string, password:string) => {
    try {
        const hash_password = await hashPassword(password);
        const response = await fetch("http://localhost:8080/docente/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                grant_type: "password",
                usuario: username ,
                hash_password
            })
        });

        if (!response.ok) throw new Error("Credenciales incorrectas");

        const data = await response.json();

        // Guarda tokens o refreshtokens
        localStorage.setItem("access_token", data.idDocente);
        console.log(data.idDocente)
        return data;
    } catch (error) {
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem("access_token");
};

export const isAuthenticated = () => {
    return Boolean(localStorage.getItem("access_token"));
};
