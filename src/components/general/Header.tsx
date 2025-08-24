import {FC} from "react";
import {useNavigate, Link} from 'react-router-dom';
import {logoutService} from '../../services/logoutService.ts';
import {useAuthStore} from '../../store/authStore.ts';
import {PersonCircle} from "react-bootstrap-icons";
import {Heladeria} from "../../types";

const Header: FC = () => {
    const navigate = useNavigate();
    const {
        activeIceCreamShopId,
        iceCreamShops,
        setActiveIceCreamShopId
    } = useAuthStore();

    const activeHeladeriaName = iceCreamShops?.find(h => h.id === activeIceCreamShopId)?.name;

    const handleLogout = async () => {
        await logoutService();
        navigate('/');
    };

    const handleHeladeriaChange = (heladeria: Heladeria) => {
        setActiveIceCreamShopId(heladeria.id);
    };

    return (
        <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
            {/* Selector de Heladerías dinámico */}
            {iceCreamShops && iceCreamShops.length > 1 ? (
                <div className="nav-item dropdown">
                    <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 dropdown-toggle text-center" href="#"
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

            {/* Menú de perfil con dropdown */}
            <div className="nav-item dropdown text-nowrap">
                <a className="nav-link px-3 dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                   aria-expanded="false">
                    <PersonCircle className="fs-4 text-light" />
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