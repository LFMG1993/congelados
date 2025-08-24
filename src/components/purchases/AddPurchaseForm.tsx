import {useState, useEffect, useRef, FC, ChangeEvent, FormEvent} from 'react';
import {addPurchase} from '../../services/purchaseServices';
import {getIngredients} from '../../services/ingredientServices';
import Alert from '../general/Alert';
import {Ingredient, NewPurchaseData, PurchaseItem} from "../../types";

interface AddPurchaseFormProps {
    onFormSubmit: () => void;
    heladeriaId: string;
}

interface FormDataState {
    supplier: string;
    invoiceNumber: string;
    items: PurchaseItem[];
}

const AddPurchaseForm: FC<AddPurchaseFormProps> = ({onFormSubmit, heladeriaId}) => {
    const initialState: FormDataState = {
        supplier: '',
        invoiceNumber: '',
        items: [],
    };

    const [formData, setFormData] = useState<FormDataState>(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Estados para la selección de ítems individuales
    const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
    const [selectedIngredientId, setSelectedIngredientId] = useState('');
    const [itemQuantity, setItemQuantity] = useState<string>('');
    const [itemUnitCost, setItemUnitCost] = useState<string>('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const ingredientSelectRef = useRef<HTMLSelectElement>(null);
    // Cargar los ingredientes disponibles al montar el componente
    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const ingredients = await getIngredients(heladeriaId);
                setAvailableIngredients(ingredients);
            } catch (err) {
                setError('No se pudieron cargar los ingredientes disponibles.');
            }
        };
        fetchIngredients();
    }, [heladeriaId]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleIngredientChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const ingredientId = e.target.value;
        setSelectedIngredientId(ingredientId);

        // MEJORA: Actualizamos la unidad de compra para mostrarla en la etiqueta
        const ingredient = availableIngredients.find(ing => ing.id === ingredientId);
        if (ingredient) {
            setSelectedUnit(ingredient.purchaseUnit);
        } else {
            setSelectedUnit('');
        }
    };

    const handleAddItem = () => {
        const quantity = parseFloat(itemQuantity);
        const unitCost = parseFloat(itemUnitCost);

        if (!selectedIngredientId || isNaN(quantity) || quantity <= 0 || isNaN(unitCost) || unitCost <= 0) {
            setError('Por favor, selecciona un ingrediente y especifica cantidad y costo unitario válidos.');
            return;
        }

        const ingredient = availableIngredients.find(ing => ing.id === selectedIngredientId);
        if (!ingredient) {
            setError('Ingrediente seleccionado no válido.');
            return;
        }

        const newItem: PurchaseItem = {
            ingredientId: ingredient.id,
            name: ingredient.name,
            purchaseUnit: ingredient.purchaseUnit,
            quantity: quantity,
            unitCost: unitCost,
        };

        setFormData(prev => ({
            ...prev,
            items: [...prev.items, newItem]
        }));

        // Limpiar campos de adición de ítem
        setSelectedIngredientId('');
        setItemQuantity('');
        setItemUnitCost('');
        setSelectedUnit('');
        setError('');
        ingredientSelectRef.current?.focus();
    };

    const handleRemoveItem = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (formData.items.length === 0) {
            setError('La compra debe contener al menos un ítem.');
            setLoading(false);
            return;
        }

        try {
            const dataToSave: NewPurchaseData = {
                ...formData,
                total: formData.items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0),
            };

            await addPurchase(heladeriaId, dataToSave);
            setSuccess('¡Compra registrada con éxito!');

            setTimeout(() => {
                onFormSubmit(); // Notificar al padre para que recargue la lista y cierre el modal
            }, 1200);

        } catch (err: any) {
            setError(err.message || 'Error al registrar la compra. Por favor, revisa los datos.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {error && <Alert type="danger" message={error}/>}
            {success && <Alert type="success" message={success}/>}
            <form onSubmit={handleSubmit}>
                {/* Datos Generales de la Compra */}
                <h5>Detalles de la Compra</h5>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="supplier" className="form-label">Proveedor</label>
                        <input type="text" className="form-control" id="supplier" name="supplier"
                               value={formData.supplier} onChange={handleChange} required/>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="invoiceNumber" className="form-label">Número de Factura</label>
                        <input type="text" className="form-control" id="invoiceNumber" name="invoiceNumber"
                               value={formData.invoiceNumber} onChange={handleChange}/>
                    </div>
                </div>

                {/* Añadir Ítems a la Compra */}
                <h5 className="mt-4">Ítems de la Compra</h5>
                <div className="card bg-light p-3 mb-3">
                    <div className="row">
                        <div className="col-md-7 mb-3">
                            <label htmlFor="selectedIngredient" className="form-label">Ingrediente</label>
                            <select ref={ingredientSelectRef} className="form-select" id="selectedIngredient"
                                    value={selectedIngredientId} onChange={handleIngredientChange}>
                                <option value="">Selecciona un ingrediente...</option>
                                {availableIngredients.map(ing => (
                                    <option key={ing.id} value={ing.id}>{ing.name} ({ing.purchaseUnit})</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-5 mb-3">
                            <div className="row">
                                <div className="col-6">
                                    <label htmlFor="itemQuantity" className="form-label">Cantidad
                                        ({selectedUnit || 'Unidad'})</label>
                                    <input type="number" step="0.01" className="form-control" id="itemQuantity"
                                           value={itemQuantity} onChange={e => setItemQuantity(e.target.value)}
                                           min="0.01"/>
                                </div>
                                <div className="col-6">
                                    <label htmlFor="itemUnitCost" className="form-label">Costo x Unidad</label>
                                    <input type="number" step="0.01" className="form-control" id="itemUnitCost"
                                           value={itemUnitCost} onChange={e => setItemUnitCost(e.target.value)}
                                           min="0.01"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 d-flex justify-content-end">
                            <button type="button" className="btn btn-primary" onClick={handleAddItem}>+ Añadir
                                Ítem a la Compra
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de Ítems Añadidos */}
                <h6>Ítems Añadidos ({formData.items.length})</h6>
                {formData.items.length > 0 ? (
                    <ul className="list-group mb-3">
                        {formData.items.map((item, index) => (
                            <li key={index}
                                className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    {item.name} ({item.purchaseUnit}) - {item.quantity} x
                                    ${new Intl.NumberFormat('es-CO').format(item.unitCost)}
                                </div>
                                <button type="button" className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleRemoveItem(index)}>X
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted">Aún no has añadido ítems a esta compra.</p>
                )}

                <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-primary" type="submit" disabled={loading || !!success}>
                        {loading ? 'Registrando...' : 'Registrar Compra'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default AddPurchaseForm;