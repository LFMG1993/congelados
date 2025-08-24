import {FC} from 'react';
import ActionButtons from "../general/ActionButtons";
import {Purchase} from "../../types";

interface PurchaseTableProps {
    purchases: Purchase[];
    onEdit: (purchase: Purchase) => void;
    onDelete: (purchaseId: string) => void;
}
const PurchaseTable: FC<PurchaseTableProps> = ({ purchases, onEdit, onDelete }) => {

    if (purchases.length === 0) {
        return <div className="alert alert-info">No hay compras registradas. Comienza registrando una.</div>;
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead className="table-dark">
                <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Proveedor</th>
                    <th scope="col">Número Factura</th>
                    <th scope="col">Total Compra</th>
                    <th scope="col">Ítems</th>
                    <th scope="col">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {purchases.map(purchase => (
                    <tr key={purchase.id}>
                        <td>{purchase.createdAt?.toDate().toLocaleDateString('es-CO') || 'N/A'}</td>
                        <td>{purchase.supplier}</td>
                        <td>{purchase.invoiceNumber || 'N/A'}</td>
                        <td>${new Intl.NumberFormat('es-CO').format(purchase.total)}</td>
                        <td>{purchase.items?.length || 0}</td>
                        <td>
                            {/* Por ahora, los botones de editar/eliminar no harán nada, pero están listos */}
                            <ActionButtons onEdit={() => onEdit(purchase)} onDelete={() => onDelete(purchase.id)} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PurchaseTable;