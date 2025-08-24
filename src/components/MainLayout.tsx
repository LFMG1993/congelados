import {useState, FC, PropsWithChildren} from 'react';
import Header from './general/Header.tsx';
import SmartSidebar from './general/SmartSidebar.tsx';

/**
 * MainLayout proporciona la estructura principal de la aplicación,
 * incluyendo el Header, el Sidebar inteligente y el área de contenido principal.
 * Utiliza PropsWithChildren para una inferencia de tipos robusta para los componentes hijos.
 */
const MainLayout: FC<PropsWithChildren> = ({children}) => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    const expandSidebar = () => {
        setIsSidebarExpanded(true);
    };

    const collapseSidebar = () => {
        setIsSidebarExpanded(false);
    };

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    return (
        <div>
            <Header/>
            {/* El área de hover y el sidebar ahora son elementos de primer nivel, fuera de cualquier grilla de Bootstrap */}
            <div className="sidebar-hover-area" onMouseEnter={expandSidebar} onMouseLeave={collapseSidebar}>
                <SmartSidebar
                    isExpanded={isSidebarExpanded}
                    toggleSidebar={toggleSidebar}
                />
            </div>
            {/* El contenido principal que será empujado por el sidebar */}
            <div className={`main-content ${isSidebarExpanded ? 'content-expanded' : 'content-collapsed'}`}>
                {children}
            </div>
        </div>
    );
};

export default MainLayout;