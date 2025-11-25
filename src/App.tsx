import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Menu } from 'primereact/menu';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import CRUDGrupoComponent from './components/grupo/CRUDGrupoComponent';
import CRUDAlumnoComponent from './components/alumno/CRUDAlumnoComponent';

const AppLayout = () => {
    const navigate = useNavigate();
    const sidebarItems = [
        {
            label: 'Documentos',
            items: [
                {
                    label: 'Grupos',
                    icon: 'pi pi-fw pi-objects-column',
                    command: () => navigate('/grupos')
                },
                {
                    label: 'Alumno',
                    icon: 'pi pi-fw pi-users',
                    command: () => navigate('/alumno')
                }
            ]
        }
    ];
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
            <div className="layout-body">
                <aside className="layout-sidebar"> 
                    <Menu model={sidebarItems} style={{ width: '100%', border: 'none' }} />
                </aside>
                <main className="layout-content">
                    <Routes>
                        <Route path="/grupos" element={<CRUDGrupoComponent />} />
                        <Route path="/alumno" element={<CRUDAlumnoComponent />} />
                        <Route path="/" element={<h2>Bienvenido al Dashboard</h2>} />
                    </Routes>
                </main>

            </div>
        </div>
    );
};

export default function App() {
    return (
        <Router>
            <AppLayout />
        </Router>
    );
}