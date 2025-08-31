import {FC} from 'react';
import {NavLink} from 'react-router-dom';
import {
    Shop,
    Basket3,
    Cart3,
    Truck,
    Tags,
    BarChart,
    IconProps,
    PersonCheck,
    Boxes
} from 'react-bootstrap-icons';

interface NavItem {
    to: string;
    Icon: FC<IconProps>
    label: string;
}

interface SmartSidebarProps {
    isExpanded: boolean;
    setIsExpanded: (expanded: boolean) => void;
}

const SmartSidebar: FC<SmartSidebarProps> = ({isExpanded, setIsExpanded}) => {

    const navItems: NavItem[] = [
        {to: "/ice-cream-shop", Icon: Shop, label: "Heladerías"},
        {to: "/pos", Icon: Cart3, label: "Punto de Venta"},
        {to: "/team-management", Icon: PersonCheck, label: "Usuarios y Roles"},
        {to: "/ingredients-page", Icon: Basket3, label: "Ingredientes"},
        {to: "/products", Icon: Tags, label: "Productos"},
        {to: "/purchases", Icon: Truck, label: "Compras"},
        {to: "/suppliers", Icon: Boxes, label: "Proveedores"},
        {to: "/reports", Icon: BarChart, label: "Reportes"},
    ];

    return (
        <nav
            id="sidebarMenu"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            className={`smart-sidebar d-md-block bg-light sidebar ${isExpanded ? 'sidebar-expanded' : ''}`}
        >
            <div className="position-sticky pt-3">
                <ul className="nav flex-column">
                    {navItems.map((item) => (
                        <li className="nav-item" key={item.label}>
                            <NavLink className="nav-link" to={item.to}>
                                <item.Icon className="sidebar-icon" size={24}/>
                                <span className="sidebar-text">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default SmartSidebar;