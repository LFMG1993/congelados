import {FC} from 'react';
import ActionButtons from "../general/ActionButtons";
import {Product} from "../../types";

interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (productId: string) => void;
}

const ProductTable: FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {

    if (products.length === 0) {
        return <div className="alert alert-info">No hay productos registrados. Comienza creando uno.</div>;
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead className="table-dark">
                <tr>
                    <th scope="col">Nombre del Producto</th>
                    <th scope="col">Precio de Venta</th>
                    <th scope="col">Nº de Ingredientes en Receta</th>
                    <th scope="col">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {products.map(product => (
                    <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>${new Intl.NumberFormat('es-CO').format(product.salePrice)}</td>
                        <td>{product.recipe?.length || 0}</td>
                        <td>
                            <ActionButtons onEdit={() => onEdit(product)} onDelete={() => onDelete(product.id)} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;