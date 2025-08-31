import {FC} from "react";
import {Ingredient} from "../../types";
import ActionButtons from "../general/ActionButtons";

interface IngredientTableProps {
    ingredients: Ingredient[];
    onEdit: (ingredient: Ingredient) => void;
    onDelete: (ingredientId: string) => void;
}

const IngredientTable: FC<IngredientTableProps> = ({ingredients, onEdit, onDelete}) => {

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
                    <th scope="col">Unidad de Compra</th>
                    <th scope="col">Unidad de Consumo</th>
                    <th scope="col">Ratio de Conversión</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Acciones</th>
                </tr>
                </thead>
                <tbody className="text-center">
                {ingredients.map((ingredient) => {
                    return (
                        <tr key={ingredient.id}>
                            <td>{ingredient.name}</td>
                            <td>{ingredient.category}</td>
                            <td>{ingredient.purchaseUnit}</td>
                            <td>{ingredient.consumptionUnit}</td>
                            <td>{`1 ${ingredient.purchaseUnit} = ${ingredient.consumptionUnitsPerPurchaseUnit} ${ingredient.consumptionUnit}`}</td>
                            <td>{ingredient.stock || 0}</td>
                            <td>
                                <ActionButtons onEdit={() => onEdit(ingredient)}
                                               onDelete={() => onDelete(ingredient.id)}/>
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