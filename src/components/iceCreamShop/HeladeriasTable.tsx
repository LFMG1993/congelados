import {FC} from 'react';
import ActionButtons from '../general/ActionButtons';
import CloudinaryImage from "../general/CloudinaryImage";
import {getPublicIdFromUrl} from "../../utils/getPublicIdFromUrl";
import {Heladeria} from "../../types";

interface HeladeriasTableProps {
    heladerias: Heladeria[];
    onEdit: (heladeria: Heladeria) => void;
    onDelete: (heladeriaId: string) => void;
}

const HeladeriasTable: FC<HeladeriasTableProps> = ({heladerias, onEdit, onDelete}) => {
    if (heladerias.length === 0) {
        return <div className="alert alert-info">
            Aún no has añadido ninguna heladería. ¡Comienza creando una!
        </div>;
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead>
                <tr>
                    <th scope="col" style={{width: '100px'}}>Imagen</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Dirección</th>
                    <th scope="col">WhatsApp</th>
                    <th scope="col">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {heladerias.map((heladeria) => (
                    <tr key={heladeria.id}>
                        <td>
                            <CloudinaryImage
                                publicId={getPublicIdFromUrl(heladeria.photoURL)}
                                width={80} height={80} alt={`Foto de ${heladeria.name}`}/>
                        </td>
                        <td>{heladeria.name}</td>
                        <td>{heladeria.address || '-'}</td>
                        <td>{heladeria.whatsapp || '-'}</td>
                        <td>
                            <ActionButtons onEdit={() => onEdit(heladeria)} onDelete={() => onDelete(heladeria.id)}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default HeladeriasTable;