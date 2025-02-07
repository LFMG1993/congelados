import React from "react";
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/logout';
export default function Header() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
            <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 text-center" href="../Dashboard">
                Heladeria Baiana
            </a>
            <button
                className="navbar-toggler position-absolute d-md-none collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#sidebarMenu"
                aria-controls="sidebarMenu"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <input
                className="form-control form-control-dark w-100"
                type="text"
                placeholder="Search"
                aria-label="Search"
            />
            <div className="navbar-nav">
                <div className="nav-item text-nowrap">
                    <a className="nav-link px-3 btn btn-link" onClick={handleLogout}>
                        Cerrar Sesión
                    </a>
                </div>
            </div>
        </header>
    )
}