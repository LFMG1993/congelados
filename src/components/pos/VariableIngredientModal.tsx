import {FC, useState, useEffect} from "react";
import {Product, Ingredient, IngredientUsage} from "../../types";
import Modal from "../general/Modal";

interface VariableIngredientModalProps {
    show: boolean;
    onClose: () => void;
    product: Product | null;
    ingredients: Ingredient[];
    onConfirm: (selectedIngredient: IngredientUsage) => void;
}

const VariableIngredientModal: FC<VariableIngredientModalProps> = ({show, onClose, product, ingredients, onConfirm}) => {
    const [variableItem, setVariableItem] = useState<{ category: string, quantity: number } | null>(null);
    const [availableOptions, setAvailableOptions] = useState<Ingredient[]>([]);
    const [selectedIngredientId, setSelectedIngredientId] = useState<string>('');

    useEffect(() => {
        if (product) {
            const variableRecipeItem = product.recipe.find(item => item.ingredientId.startsWith('CATEGORY::'));
            if (variableRecipeItem) {
                const category = variableRecipeItem.ingredientId.split('::')[1];
                setVariableItem({category, quantity: variableRecipeItem.quantity});
                setAvailableOptions(ingredients.filter(ing => ing.category === category));
            }
        }
        // Resetear la selección cuando el modal se cierra o cambia el producto
        setSelectedIngredientId('');
    }, [product, ingredients, show]);

    const handleConfirm = () => {
        if (selectedIngredientId && variableItem) {
            onConfirm({
                ingredientId: selectedIngredientId,
                quantity: variableItem.quantity,
            });
            onClose();
        }
    };

    return (
        <Modal title={`Selecciona el sabor para: ${product?.name}`} show={show} onClose={onClose}>
            <div className="list-group">
                {availableOptions.map(option => (
                    <button
                        key={option.id}
                        type="button"
                        className={`list-group-item list-group-item-action ${selectedIngredientId === option.id ? 'active' : ''}`}
                        onClick={() => setSelectedIngredientId(option.id)}
                    >
                        {option.name}
                    </button>
                ))}
            </div>
            <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-primary" onClick={handleConfirm} disabled={!selectedIngredientId}>Confirmar Selección</button>
            </div>
        </Modal>
    );
};

export default VariableIngredientModal;