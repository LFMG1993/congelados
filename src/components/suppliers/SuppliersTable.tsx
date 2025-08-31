import {FC} from 'react';
import ActionButtons from "../general/ActionButtons";
import {Supplier} from "../../types";

interface SupplierTableProps {
    suppliers: Supplier[];
    onEdit: (supplier: Supplier) => void;
    onDelete: (supplierId: string) => void;
}
const SuppliersTable: FC<SupplierTableProps> = ({ suppliers, onEdit, onDelete }) => {

    if (suppliers.length === 0) {
        return <div className="alert alert-info">No hay proveedores registrados. Comienza registrando uno.</div>;
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead className="table-dark">
                <tr>
                    <th scope="col">Fecha Creación</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Contacto</th>
                    <th scope="col">Teléfono</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {suppliers.map(supplier => (
                    <tr key={supplier.id}>
                        <td>{supplier.createdAt?.toDate().toLocaleDateString('es-CO') || 'N/A'}</td>
                        <td>{supplier.name}</td>
                        <td>{supplier.contactPerson || 'N/A'}</td>
                        <td>{supplier.phone || 'N/A'}</td>
                        <td>{supplier.email || 'N/A'}</td>
                        <td>
                            {/* Por ahora, los botones de editar/eliminar no harán nada, pero están listos */}
                            <ActionButtons onEdit={() => onEdit(supplier)} onDelete={() => onDelete(supplier.id)} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default SuppliersTable;