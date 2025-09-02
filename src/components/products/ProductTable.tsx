import {FC} from 'react';
import ActionButtons from "../general/ActionButtons";
import {EnrichedProduct} from "../../types";

interface ProductTableProps {
    products: EnrichedProduct[];
    onEdit: (product: EnrichedProduct) => void;
    onDelete: (productId: string) => void;
}

// Función de ayuda para formatear moneda y evitar repetición de código.
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
    }).format(value);
};

const ProductTable: FC<ProductTableProps> = ({products, onEdit, onDelete}) => {

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
                    <th scope="col">Costo Receta</th>
                    <th scope="col">Ganancia Estimada</th>
                    <th scope="col">Unidades Disponibles</th>
                    <th scope="col">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {products.map(product => (
                    <tr key={product.id}>
                        <td className="fw-bold">{product.name}</td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>
                            {formatCurrency(product.recipeCost)}
                            {/* Añadimos un indicador si la receta contiene un ítem variable */}
                            {product.recipe.some(item => item.ingredientId.startsWith('CATEGORY::')) && (
                                <span className="ms-1 text-primary"
                                      title="Costo estimado basado en el ingrediente más caro de la categoría.">*</span>
                            )}
                        </td>
                        <td className={product.estimatedProfit > 0 ? 'text-success' : 'text-danger'}>
                            {formatCurrency(product.estimatedProfit)}
                        </td>
                        <td>
                             <span className={`badge ${product.availableUnits <= 10 ? 'bg-danger' : 'bg-secondary'}`}>
                                 {product.availableUnits}
                             </span>
                        </td>
                        <td>
                            <ActionButtons onEdit={() => onEdit(product)} onDelete={() => onDelete(product.id)}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;