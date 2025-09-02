import {FC} from "react";
import {Promotion} from "../../types";
import ActionButtons from "../general/ActionButtons";
import {usePermissions} from "../../hooks/usePermissions";

interface PromotionsTableProps {
    promotions: Promotion[];
    onEdit: (promo: Promotion) => void;
    onDelete: (promoId: string) => void;
}

const daysMap = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const PromotionsTable: FC<PromotionsTableProps> = ({promotions, onEdit, onDelete}) => {
    const {hasPermission} = usePermissions();
    const canEdit = hasPermission('promotions_update');
    const canDelete = hasPermission('promotions_delete');

    return (
        <div className="table-responsive">
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Días Activos</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {promotions.map(promo => (
                    <tr key={promo.id}>
                        <td>{promo.name}</td>
                        <td>{new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP'}).format(promo.price)}</td>
                        <td>{promo.activeDays.map(d => daysMap[d]).join(', ')}</td>
                        <td>
                            <span className={`badge ${promo.isEnabled ? 'bg-success' : 'bg-secondary'}`}>
                                {promo.isEnabled ? 'Activa' : 'Inactiva'}
                            </span>
                        </td>
                        <td>
                            <ActionButtons onEdit={canEdit ? () => onEdit(promo) : undefined} onDelete={canDelete ? () => onDelete(promo.id) : undefined}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PromotionsTable;