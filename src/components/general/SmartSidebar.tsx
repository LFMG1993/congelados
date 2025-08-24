import {FC} from 'react';
import {NavLink} from 'react-router-dom';
import {
    House,
    BoxSeam,
    Cart,
    Truck,
    BarChart,
    ChevronLeft,
    ChevronRight,
    IconProps
} from 'react-bootstrap-icons';

interface NavItem {
    to: string;
    Icon: FC<IconProps>
    label: string;
}

interface SmartSidebarProps {
    isExpanded: boolean;
    toggleSidebar: () => void;
}

const SmartSidebar: FC<SmartSidebarProps> = ({isExpanded, toggleSidebar}) => {

    const navItems: NavItem[] = [
        {to: "/ice-cream-shop", Icon: House, label: "Heladerías"},
        {to: "/ingredients-page", Icon: BoxSeam, label: "Ingredientes"},
        {to: "/products", Icon: Cart, label: "Productos"},
        {to: "/purchases", Icon: Truck, label: "Compras"},
        {to: "#", Icon: BarChart, label: "Reportes"},
    ];

    return (
        <nav
            id="sidebarMenu"
            className={`smart-sidebar d-md-block bg-light sidebar ${isExpanded ? 'sidebar-expanded' : ''}`}
        >
            <div className="position-sticky pt-3">
                <ul className="nav flex-column">
                    {navItems.map((item) => (
                        <li className="nav-item" key={item.label}>
                            <NavLink className="nav-link" to={item.to}>
                                <item.Icon className="sidebar-icon" size={20}/>
                                <span className="sidebar-text">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Botón de toggle visible en la parte inferior */}
                <div className="sidebar-toggle-wrapper">
                    <button className="btn btn-light" onClick={toggleSidebar}>
                        {isExpanded ? <ChevronLeft size={20}/> : <ChevronRight size={20}/>}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default SmartSidebar;