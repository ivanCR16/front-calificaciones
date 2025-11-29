import React, { use, useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../../Service/AuthService";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [apellido, setApellido] = useState("");
    const [nombre, setNombre] = useState("");
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        try {
            await registerUser(nombre, apellido, username, password);
            navigate("/login");
        } catch (err) {
            setErrorMsg("Error al registrar. Intente con otro correo.");
        }

        setLoading(false);
    };

    return (
        <div className="flex justify-content-center mt-8">
            <Card title="Crear cuenta" style={{ width: "22rem" }}>
                <form onSubmit={handleRegister} className="p-fluid">

                    <label className="mt-3">Nombre</label>
                    <InputText value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    
                    <label>Apellido</label>
                    <InputText value={apellido} onChange={(e) => setApellido(e.target.value)} />

                    <label>Nombre de usuario</label>
                    <InputText value={username} onChange={(e) => setUserName(e.target.value)} />

                    <label className="mt-3">Contraseña</label>
                    <Password value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} toggleMask />

                    {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

                    <Button 
                        label="Registrarme"
                        type="submit"
                        className="mt-4"
                        loading={loading}
                    />

                    <div className="mt-3 text-center">
                        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                    </div>
                </form>
            </Card>
        </div>
    );
}
