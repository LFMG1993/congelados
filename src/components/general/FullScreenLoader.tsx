import {FC} from 'react';
import '../../style/FullScreenLoader.css';

const FullScreenLoader: FC = () => {
    return (
        <div className="loader-overlay">
            <div className="spinner-border text-light" style={{width: '3rem', height: '3rem'}} role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );
};

export default FullScreenLoader;