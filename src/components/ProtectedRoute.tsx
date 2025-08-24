import {FC, ReactNode} from "react";
import {Navigate} from 'react-router-dom';
import {useAuthStore} from '../store/authStore';
import FullScreenLoader from "./general/FullScreenLoader.tsx";

/**
 * Componente de ruta protegida que redirige al login si el usuario no está autenticado.
 * Muestra un cargador de pantalla completa mientras se verifica el estado de autenticación.
 */
interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({children}) => {
    const {isAuthenticated, loading} = useAuthStore(state => ({
        isAuthenticated: state.isAuthenticated,
        loading: state.loading
    }));
    if (loading) {
        return <FullScreenLoader/>;
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }
    return children;
}

export default ProtectedRoute;