// components/LoginForm.jsx
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useAuth } from "../../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            await login(email, password);
            navigate("/");
        } catch (error) {
            setErrorMsg("Credenciales incorrectas o error en el servidor.");
        }

        setLoading(false);
    };

    return (
        <Card title="Iniciar Sesión" style={{ width: "22rem" }}>
            <form onSubmit={handleSubmit} className="p-fluid" >

                <span className="mt-3">
                    <label htmlFor="email">Usuario</label>
                    <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </span>

                <span className="mt-3">
                    <label htmlFor="password">Contraseña</label>
                    <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} toggleMask />
                </span>

                {errorMsg && (
                    <small className="p-error">{errorMsg}</small>
                )}
                
                <Button  className="mt-4" label="Ingresar" icon="pi pi-sign-in" loading={loading} />
                
                <div className="mt-3 text-center">
                    ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                </div>
            </form>
        </Card>
    );
}
