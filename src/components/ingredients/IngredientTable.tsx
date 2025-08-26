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
                <tr className="text-center">
                    <th scope="col">Nombre</th>
                    <th scope="col">Categoría</th>
                    <th scope="col">U. Compra</th>
                    <th scope="col">Costo por U. Compra</th>
                    <th scope="col">Costo por U. Consumo</th>
                    <th scope="col">Acciones</th>
                </tr>
                </thead>
                <tbody className="text-center">
                {ingredients.map((ingredient) => {
                    // Nueva lógica de cálculo, más robusta y clara
                    const costPerConsumptionUnit = (ingredient.consumptionUnitsPerPurchaseUnit && ingredient.consumptionUnitsPerPurchaseUnit > 0)
                        ? (ingredient.purchaseCost || 0) / ingredient.consumptionUnitsPerPurchaseUnit
                        : 0;
                    return (
                        <tr key={ingredient.id}>
                            <td>{ingredient.name}</td>
                            <td>{ingredient.category}</td>
                            <td>{ingredient.purchaseUnit}</td>
                            <td>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(ingredient.purchaseCost || 0)}</td>
                            <td>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(costPerConsumptionUnit)}</td>
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