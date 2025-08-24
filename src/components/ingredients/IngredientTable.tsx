import {FC} from "react";
import {Ingredient} from "../../types";
import ActionButtons from "../general/ActionButtons";

interface IngredientTableProps {
    ingredients: Ingredient[];
    onEdit: (ingredient: Ingredient) => void;
    onDelete: (ingredientId: string) => void;
}
const IngredientTable: FC<IngredientTableProps> = ({ ingredients, onEdit, onDelete }) => {

    if (ingredients.length === 0) {
        return <div className="alert alert-info">No hay ingredientes registrados. Comienza agregando uno.</div>;
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead className="table-dark">
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Costo por U. Compra</th>
                    <th scope="col">Costo por U. Consumo</th>
                    <th scope="col">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {ingredients.map(ingredient => {
                    const costPerConsumptionUnit = (ingredient.conversionFactor && ingredient.conversionFactor > 0)
                        ? (ingredient.costPerUnit || 0) / ingredient.conversionFactor
                        : (ingredient.costPerUnit || 0);
                    return (
                        <tr key={ingredient.id}>
                            <td>{ingredient.name}</td>
                            <td>{ingredient.purchaseUnit}</td>
                            <td>${new Intl.NumberFormat('es-CO').format(ingredient.costPerUnit || 0)}</td>
                            <td>${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(costPerConsumptionUnit)}</td>
                            <td>
                                <ActionButtons onEdit={() => onEdit(ingredient)} onDelete={() => onDelete(ingredient.id)} />
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default IngredientTable;