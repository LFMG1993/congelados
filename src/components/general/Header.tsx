import {FC, useState, useEffect, useRef} from "react";
import {useNavigate, Link} from 'react-router-dom';
import {logoutService} from '../../services/logoutService';
import {useAuthStore} from '../../store/authStore.ts';
import {PersonCircle, Envelope} from "react-bootstrap-icons";
import {Heladeria, InvitationData} from "../../types";
import {getPendingInvitations} from "../../services/teamServices";
import * as bootstrap from "bootstrap";

const Header: FC = () => {
    const navigate = useNavigate();
    const {
        activeIceCreamShopId,
        iceCreamShops,
        setActiveIceCreamShopId,
        user
    } = useAuthStore();

    const [pendingInvitations, setPendingInvitations] = useState<InvitationData[]>([]);
    const shopDropdownRef = useRef<HTMLAnchorElement>(null);
    const profileDropdownRef = useRef<HTMLAnchorElement>(null);
    const isOwner = user?.role === 'owner';

    const activeHeladeriaName = iceCreamShops?.find(h => h.id === activeIceCreamShopId)?.name;

    const handleLogout = async () => {
        await logoutService();
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isStandalone) {
            navigate('/login'); // Si es una PWA instalada, va al login.
        } else {
            navigate('/'); // Si está en un navegador, va al home.
        }
    };

    const handleHeladeriaChange = (heladeria: Heladeria) => {
        setActiveIceCreamShopId(heladeria.id);
    };

    // Efecto para cargar las invitaciones pendientes y mostrar el notificador
    useEffect(() => {
        if (activeIceCreamShopId && isOwner) {
            getPendingInvitations(activeIceCreamShopId)
                .then(setPendingInvitations)
                .catch(err => {
                    console.error("Error al cargar invitaciones pendientes:", err);
                    setPendingInvitations([]);
                });
        } else {
            setPendingInvitations([]);
        }
    }, [activeIceCreamShopId, isOwner]);

    // Efecto para inicializar manualmente los dropdowns de Bootstrap.
    useEffect(() => {
        const profileEl = profileDropdownRef.current;
        if (!profileEl) return;

        const profileDropdown = new bootstrap.Dropdown(profileEl);
        return () => profileDropdown.dispose();
    }, []);

    useEffect(() => {
        const shopEl = shopDropdownRef.current;
        if (!shopEl) return;

        const shopDropdown = new bootstrap.Dropdown(shopEl);
        return () => {
            shopDropdown.dispose();
        };
    }, [iceCreamShops]);


    return (
        <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
            {/* Selector de Heladerías dinámico */}
            {iceCreamShops && iceCreamShops.length > 1 ? (
                <div className="nav-item dropdown">
                    <a ref={shopDropdownRef}
                       className="navbar-brand col-md-3 col-lg-2 me-0 px-3 dropdown-toggle text-center" href="#"
                       role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {activeHeladeriaName || 'Seleccionar'}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-dark">
                        {iceCreamShops.map(h => (
                            <li key={h.id}>
                                <button className="dropdown-item" type="button"
                                        onClick={() => handleHeladeriaChange(h)}>
                                    {h.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <Link className="navbar-brand col-md-3 col-lg-2 me-0 px-3 text-center" to="/dashboard">
                    {activeHeladeriaName || 'Congelados'}
                </Link>
            )}
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
            {/* Buscador responsivo que ocupa el espacio sobrante */}
            <div className="flex-grow-1 mx-3">
                <input
                    className="form-control form-control-dark"
                    type="text"
                    placeholder="Buscar..."
                    aria-label="Search"
                />
            </div>
            {/* Notificador de Invitaciones Pendientes */}
            {isOwner && pendingInvitations.length > 0 && (
                <div className="nav-item text-nowrap">
                    <Link to="/team-management" className="nav-link px-3 position-relative"
                          title="Invitaciones pendientes">
                        <Envelope className="fs-4 text-light"/>
                        <span
                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                             {pendingInvitations.length}
                            <span className="visually-hidden">invitaciones pendientes</span>
                         </span>
                    </Link>
                </div>
            )}
            {/* Menú de perfil con dropdown */}
            <div className="nav-item dropdown text-nowrap">
                <a ref={profileDropdownRef} className="nav-link px-3 dropdown-toggle" href="#" role="button"
                   data-bs-toggle="dropdown"
                   aria-expanded="false">
                    <PersonCircle className="fs-4 text-light"/>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/profile">Perfil</Link></li>
                    <li>
                        <hr className="dropdown-divider"/>
                    </li>
                    <li><a className="dropdown-item" href="#" onClick={handleLogout}>Cerrar Sesión</a></li>
                </ul>
            </div>
        </header>
    )
};

export default Header;