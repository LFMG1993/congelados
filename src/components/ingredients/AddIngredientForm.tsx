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
    const initialState: NewIngredientData = {
        name: '',
        purchaseUnit: 'gramos',
        consumptionUnit: 'gramos',
        costPerUnit: 0,
        conversionFactor: 1,
    };

    const [formData, setFormData] = useState<NewIngredientData>(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (ingredientToEdit) {
            setFormData({
                name: ingredientToEdit.name,
                purchaseUnit: ingredientToEdit.purchaseUnit,
                consumptionUnit: ingredientToEdit.consumptionUnit,
                costPerUnit: ingredientToEdit.costPerUnit,
                conversionFactor: ingredientToEdit.conversionFactor,
            });
        } else {
            setFormData(initialState);
        }
    }, [ingredientToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        // Convertimos los valores numéricos al tipo correcto
        const numericValue = ['costPerUnit', 'conversionFactor'].includes(name) ? parseFloat(value) : value;
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
            <div className="col-md-6 mb-3">
                <label htmlFor="purchaseUnit" className="form-label">Unidad de Compra (Ej: Caja, Bolsa)</label>
                <input type="text" className="form-control" id="purchaseUnit" name="purchaseUnit"
                       value={formData.purchaseUnit || ''} onChange={handleChange} required/>
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="consumptionUnit" className="form-label">Costo por Unidad de Compra</label>
                    <input type="number" step="0.01" className="form-control" id="consumptionUnit" name="consumptionUnit"
                           value={formData.consumptionUnit || ''} onChange={handleChange} required/>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="costPerUnit" className="form-label">Unidad de Consumo (Ej: bola, gramo)</label>
                    <input type="text" className="form-control" id="costPerUnit" name="costPerUnit"
                           value={formData.costPerUnit || ''} onChange={handleChange} required/>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="conversionFactor" className="form-label">U. de Consumo por U. de Compra</label>
                    <input type="number" className="form-control" id="conversionFactor" name="conversionFactor"
                           value={formData.conversionFactor || ''} onChange={handleChange} required/>
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