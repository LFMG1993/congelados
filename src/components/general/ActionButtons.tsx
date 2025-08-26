import {FC} from "react";

/**
 * Componente reutilizable para botones de acción (Editar, Eliminar).
 * @param {function} onEdit - Función a ejecutar al hacer clic en Editar.
 * @param {function} onDelete - Función a ejecutar al hacer clic en Eliminar.
 */
interface ActionButtonsProps {
    onEdit?: () => void;
    onDelete?: () => void;
}

const ActionButtons: FC<ActionButtonsProps> = ({onEdit, onDelete}) => {
    return (
        <div className="d-flex gap-2 justify-content-center">
            {onEdit && (
                <button className="btn btn-sm btn-outline-secondary" onClick={onEdit}>
                    <i className="bi bi-pencil-fill"></i> Editar
                </button>
            )}
            {onDelete && (
                <button className="btn btn-sm btn-outline-danger" onClick={onDelete}>
                    <i className="bi bi-trash-fill"></i> Eliminar
                </button>
            )}
        </div>
    );
};

export default ActionButtons;