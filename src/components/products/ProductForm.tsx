import {FC, useState, useEffect, FormEvent} from 'react';
import {Product, NewProductData, RecipeItem, Ingredient} from "../../types";
import {addProduct, updateProduct} from "../../services/productServices.ts";
import {Trash} from "react-bootstrap-icons";

interface ProductFormProps {
    shopId: string;
    onFormSubmit: () => void;
    productToEdit?: Product | null;
    availableIngredients: Ingredient[];
}

const ProductForm: FC<ProductFormProps> = ({shopId, onFormSubmit, productToEdit, availableIngredients}) => {
    const [name, setName] = useState('');
    const [salePrice, setSalePrice] = useState(0);
    const [recipe, setRecipe] = useState<RecipeItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Efecto para rellenar el formulario si estamos en modo edición
    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name);
            setSalePrice(productToEdit.salePrice);
            setRecipe(productToEdit.recipe || []);
        } else {
            // Resetea el formulario si no hay producto para editar (modo creación)
            setName('');
            setSalePrice(0);
            setRecipe([]);
        }
    }, [productToEdit]);

    // --- Manejadores de la Receta Dinámica ---

    const handleAddRecipeItem = () => {
        setRecipe([...recipe, {ingredientId: '', quantity: 0}]);
    };

    const handleRemoveRecipeItem = (index: number) => {
        const newRecipe = recipe.filter((_, i) => i !== index);
        setRecipe(newRecipe);
    };

    const handleRecipeChange = (index: number, field: keyof RecipeItem, value: string | number) => {
        const newRecipe = recipe.map((item, i) => {
            if (i === index) {
                return {...item, [field]: value};
            }
            return item;
        });
        setRecipe(newRecipe);
    };

    // --- Manejador del Envío del Formulario ---

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const productData: NewProductData = {name, salePrice, recipe};

        try {
            if (productToEdit) {
                await updateProduct(shopId, productToEdit.id, productData);
            } else {
                await addProduct(shopId, productData);
            }
            onFormSubmit(); // Llama a la función del padre para cerrar el modal y recargar
        } catch (err: any) {
            setError(err.message || "Ocurrió un error al guardar el producto.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
                <label htmlFor="productName" className="form-label">Nombre del Producto</label>
                <input type="text" id="productName" className="form-control" value={name}
                       onChange={(e) => setName(e.target.value)} required/>
            </div>

            <div className="mb-3">
                <label htmlFor="salePrice" className="form-label">Precio de Venta</label>
                <input type="number" id="salePrice" className="form-control" value={salePrice}
                       onChange={(e) => setSalePrice(Number(e.target.value))} required/>
            </div>

            <hr/>

            <h5>Receta</h5>
            {recipe.map((item, index) => (
                <div key={index} className="row g-2 mb-2 align-items-center">
                    <div className="col-6">
                        <select
                            className="form-select"
                            value={item.ingredientId}
                            onChange={(e) => handleRecipeChange(index, 'ingredientId', e.target.value)}
                            required
                        >
                            <option value="" disabled>Selecciona un ingrediente...</option>
                            {availableIngredients.map(ing => (
                                <option key={ing.id} value={ing.id}>{ing.name} ({ing.consumptionUnit})</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-4">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Cantidad"
                            value={item.quantity}
                            onChange={(e) => handleRecipeChange(index, 'quantity', Number(e.target.value))}
                            required
                        />
                    </div>
                    <div className="col-2">
                        <button type="button" className="btn btn-outline-danger"
                                onClick={() => handleRemoveRecipeItem(index)}>
                            <Trash/>
                        </button>
                    </div>
                </div>
            ))}

            <button type="button" className="btn btn-sm btn-outline-secondary mb-3" onClick={handleAddRecipeItem}>
                + Añadir Ingrediente
            </button>

            <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Producto'}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;