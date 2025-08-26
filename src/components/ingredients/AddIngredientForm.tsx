import * as React from 'react';
import {useState, useEffect, FC, FormEvent} from 'react';
import {NewIngredientData, Ingredient, UpdateIngredientData} from "../../types";
import {addIngredient, updateIngredient} from '../../services/ingredientServices';

interface AddIngredientFormProps {
    heladeriaId: string;
    onFormSubmit: () => void;
    ingredientToEdit?: Ingredient;
}

const AddIngredientForm: FC<AddIngredientFormProps> = ({heladeriaId, onFormSubmit, ingredientToEdit}) => {
    const initialState: Omit<NewIngredientData, 'category'> & { category: string } = {
        name: '',
        category: '',
        purchaseUnit: '',
        consumptionUnit: '',
        purchaseCost: 0,
        consumptionUnitsPerPurchaseUnit: 0,
    };

    const [formData, setFormData] = useState<NewIngredientData>(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (ingredientToEdit) {
            setFormData({
                name: ingredientToEdit.name,
                category: ingredientToEdit.category,
                purchaseUnit: ingredientToEdit.purchaseUnit,
                consumptionUnit: ingredientToEdit.consumptionUnit,
                purchaseCost: ingredientToEdit.purchaseCost,
                consumptionUnitsPerPurchaseUnit: ingredientToEdit.consumptionUnitsPerPurchaseUnit,
            });
        } else {
            setFormData(initialState);
        }
    }, [ingredientToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        // Convertimos los valores numéricos al tipo correcto
        const numericValue = ['purchaseCost', 'consumptionUnitsPerPurchaseUnit'].includes(name) ? parseFloat(value) : value;
        setFormData(prev => ({
            ...prev,
            [name]: numericValue,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (ingredientToEdit) {
                // Si estamos editando, usamos el servicio de actualización
                const dataToUpdate: UpdateIngredientData = {...formData};
                await updateIngredient(heladeriaId, ingredientToEdit.id, dataToUpdate);
            } else {
                // Si no, usamos el servicio para añadir uno nuevo
                await addIngredient(heladeriaId, formData);
            }
            onFormSubmit(); // Notificamos al padre que la operación fue exitosa
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error inesperado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre del Ingrediente</label>
                <input type="text" className="form-control" id="name" name="name" value={formData.name || ''}
                       onChange={handleChange} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="category" className="form-label">Categoría</label>
                <input type="text" className="form-control" id="category" name="category" value={formData.category || ''}
                       onChange={handleChange} placeholder="Ej: Helados, Toppings, Bases" required/>
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="purchaseUnit" className="form-label">Unidad de Compra</label>
                    <input type="text" className="form-control" id="purchaseUnit" name="purchaseUnit"
                           value={formData.purchaseUnit || ''} onChange={handleChange} placeholder="Ej: Caja 4.9kg" required/>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="purchaseCost" className="form-label">Costo por U. de Compra</label>
                    <input type="number" step="0.01" className="form-control" id="purchaseCost" name="purchaseCost"
                           value={formData.purchaseCost || 0} onChange={handleChange} required/>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="consumptionUnit" className="form-label">Unidad de Consumo</label>
                    <input type="text" className="form-control" id="consumptionUnit" name="consumptionUnit"
                           value={formData.consumptionUnit || ''} onChange={handleChange} placeholder="Ej: gramo, unidad" required/>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="consumptionUnitsPerPurchaseUnit" className="form-label">U. de Consumo por U. de Compra</label>
                    <input type="number" step="any" className="form-control" id="consumptionUnitsPerPurchaseUnit"
                           name="consumptionUnitsPerPurchaseUnit"
                           value={formData.consumptionUnitsPerPurchaseUnit || 0} onChange={handleChange} required/>
                </div>
            </div>
            <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            {' '}Guardando...
                        </>
                    ) : (ingredientToEdit ? 'Actualizar Ingrediente' : 'Añadir Ingrediente')}
                </button>
            </div>
        </form>
    );
};

export default AddIngredientForm;