import {FC} from 'react';
import {NavLink} from 'react-router-dom';
import {
    House,
    BoxSeam,
    Cart,
    Truck,
    BarChart,
    IconProps,
    PersonCheck
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
        {to: "/ice-cream-shop", Icon: House, label: "Heladerías"},
        {to: "/team-management", Icon: PersonCheck, label: "Usuarios y Roles"},
        {to: "/ingredients-page", Icon: BoxSeam, label: "Ingredientes"},
        {to: "/products", Icon: Cart, label: "Productos"},
        {to: "/purchases", Icon: Truck, label: "Compras"},
        {to: "#", Icon: BarChart, label: "Reportes"},
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