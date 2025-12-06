
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Menu } from 'primereact/menu';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import CRUDGrupoComponent from './components/grupo/CRUDGrupoComponent';
import CRUDAlumnoComponent from './components/alumno/CRUDAlumnoComponent';
import CRUDAsignaturaComponent from "./components/asignatura/CRUDAsignaturaComponent.tsx";
import CRUDTemaComponent from "./components/tema/CRUDTemaComponent.tsx";
import { AuthProvider } from './auth/AuthContext.tsx';
import LoginPage from './components/login/LoginPage.tsx'
import RegisterPage from './components/login/RegisterPage.tsx'
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
// import NavigationHistory from "./components/breadc/AsignaturaB.tsx";
import CargarCalificacionStepper from './components/calificaciones/CargarCalificacionStepper.tsx';
import ModificarCalificacion from './components/calificaciones/ModificarCalificacion.tsx';

const PrivateRoute = ({ children }) => {
    const { loggedIn } = useAuth();
    return loggedIn ? children : <Navigate to="/login" replace />;
};

const AppLayout = () => {
    
    // useEffect(() => {
    //     const { user,  setDocente } = useAuth();
    //     console.log("user",user);
    //     if (!user) {
    //         const userLocal = JSON.parse(localStorage.getItem('user')||'');
    //         console.log("userlocal",userLocal);
    //         setDocente(user);
    //     }
    // }, []);

    const navigate = useNavigate();
    
    const sidebarItems = [
        { label: 'Grupos', icon: 'pi pi-fw pi-objects-column', command: () => navigate('/grupos')},
        { label: 'Alumno', icon: 'pi pi-fw pi-users', command: () => navigate('/alumno')},
        { label: 'Asignatura', icon: 'pi pi-fw pi-users', command: () => navigate('/asignatura')},
        { label: 'Tema', icon: 'pi pi-fw pi-users', command: () => navigate('/tema') },
        { label: 'Actividad', icon: 'pi pi-fw pi-users', command: () => navigate('/actividad') },
        
        // --- NUEVO ELEMENTO CON SUBMENÚ (CALIFICACIONES) ---
        { 
            label: 'Calificaciones', 
            icon: 'pi pi-fw pi-list', // Icono principal para el grupo
            // La propiedad 'command' se omite o se usa para alternar la expansión si tu componente de menú lo requiere.
            
            // El array 'items' define el submenú que se desplegará:
            items: [
                { 
                    label: 'Cargar (Nuevo)', 
                    icon: 'pi pi-upload', 
                    command: () => navigate('/calificacion/cargar') 
                },
                { 
                    label: 'Modificar (Editar)', 
                    icon: 'pi pi-pencil', 
                    command: () => navigate('/calificacion/modificar') 
                }
            ]
        }
    ];
    // const sidebarItems = [
    //     {
    //         label: 'Documentos',
    //         items: [

    //         ]
    //     }
    // ];
    const startContent = (
        <div className="flex align-items-center">
            <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2" style={{marginRight: '10px'}} />
            <span className="text-xl font-bold text-primary">MI PROYECTO</span>
        </div>
    );
    const endContent = (
        <div className="flex align-items-center gap-2" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="p-input-icon-left">
                <InputText placeholder="Search" type="text" className="w-8rem sm:w-auto" />
                <i className="pi pi-search" />
            </div>
            <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
        </div>
    );

    return (
        <div className="layout-container">
            <div className="layout-topbar">
                <Menubar model={[]} start={startContent} end={endContent} style={{border: 'none', borderRadius: 0}} />
            </div>
            {/* <NavigationHistory history={history} /> */}
            <div className="layout-body">
                <aside className="layout-sidebar"> 
                    <Menu model={sidebarItems} style={{ width: '100%', border: 'none' }} />
                </aside>
                <main className="layout-content">
                    <Routes>
                        <Route path="/grupos" element={<CRUDGrupoComponent />} />
                        <Route path="/alumno" element={<CRUDAlumnoComponent />} />
                        <Route path="/asignatura" element={<CRUDAsignaturaComponent />} />
                        <Route path="/tema" element={<CRUDTemaComponent />} />
                        <Route path="/actividad" element={<CRUDTemaComponent />} />
                        <Route path="/calificacion/cargar" element={<CargarCalificacionStepper />} />
                        <Route path="/calificacion/modificar" element={<ModificarCalificacion />} />
                        <Route path="/" element={<h2>Bienvenido al Dashboard</h2>} />
                        {/* <Route path="/asignaturas" element={<CRUDAsignaturaComponent />} /> */}
                    {/* <Route path="/asignatura/:idAsignatura" element={<GruposPage />} />
                    <Route path="/asignatura/:idAsignatura/grupo/:idGrupo" element={<TemasPage />} />
                    <Route path="/grupo/:idGrupo/tema/:idTema" element={<ActividadesPage />} />
                    <Route path="/actividad/:idActividad/alumno/:idAlumno" element={<AlumnoPage />} /> */}
                    </Routes>
                </main>

            </div>
        </div>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>

                    {/* Ruta pública */}
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* Rutas protegidas */}
                    <Route 
                        path="/*" 
                        element={
                            <PrivateRoute>
                                <AppLayout />
                            </PrivateRoute>
                        } 
                    />

                </Routes>
                {/* <AppLayout /> */}
            </Router>
        </AuthProvider>
    );
}