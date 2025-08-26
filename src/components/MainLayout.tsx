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

    return (
        <div>
            <Header/>
            {/* El Sidebar ahora se renderiza directamente y maneja su propio estado de hover */}
            <SmartSidebar
                isExpanded={isSidebarExpanded}
                setIsExpanded={setIsSidebarExpanded}
            />
            {/* El contenido principal que será empujado por el sidebar */}
            <div className={`main-content ${isSidebarExpanded ? 'content-expanded' : 'content-collapsed'}`}>
                {children}
            </div>
        </div>
    );
};

export default MainLayout;