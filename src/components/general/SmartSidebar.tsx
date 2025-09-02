import {FC} from 'react';
import {NavLink} from 'react-router-dom';
import {usePermissions} from "../../hooks/usePermissions";
import {navItemsConfig} from "../../config/navConfig.ts";

interface SmartSidebarProps {
    isExpanded: boolean;
    setIsExpanded: (expanded: boolean) => void;
}

const SmartSidebar: FC<SmartSidebarProps> = ({isExpanded, setIsExpanded}) => {
    const {hasPermission} = usePermissions();

    return (
        <nav
            id="sidebarMenu"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            className={`smart-sidebar d-md-block bg-light sidebar ${isExpanded ? 'sidebar-expanded' : ''}`}
        >
            <div className="position-sticky pt-3">
                <ul className="nav flex-column">
                    {navItemsConfig
                        .filter(item => item.permissionId ? hasPermission(item.permissionId) : true)
                        .map(item => (
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