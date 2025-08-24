import {useState, useEffect, FC} from "react";
import AddIngredientForm from "../components/ingredients/AddIngredientForm.tsx";
import IngredientTable from "../components/ingredients/IngredientTable";
import {deleteIngredient, getIngredients} from "../services/ingredientServices";
import {useAuthStore} from "../store/authStore";
import FullScreenLoader from "../components/general/FullScreenLoader.tsx";
import Modal from "../components/general/Modal";
import Breadcrumbs from "../components/general/Breadcrumbs.tsx";
import {Ingredient} from "../types";

const IngredientsPage: FC = () => {
    const {activeIceCreamShopId: heladeriaId, loading: authLoading} = useAuthStore();
    const [pageLoading, setPageLoading] = useState(true);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
    const [modalTitle, setModalTitle] = useState('');
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    useEffect(() => {
        const fetchIngredients = async () => {
            if (!heladeriaId) return;
            setPageLoading(true);
            try {
                const data = await getIngredients(heladeriaId);
                setIngredients(data);
            } catch (error) {
                console.error("Error al obtener los ingredientes:", error);
            } finally {
                setPageLoading(false);
            }
        };

        fetchIngredients();
    }, [heladeriaId, refetchTrigger]);
    if (authLoading || pageLoading) return <FullScreenLoader/>;

    if (!heladeriaId) {
        return <p>Por favor, selecciona una heladería para gestionar los ingredientes.</p>;
    }

    const handleOpenAddModal = () => {
        setEditingIngredient(null);
        setModalTitle('Añadir Nuevo Ingrediente');
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (ingredient: Ingredient) => {
        setEditingIngredient(ingredient);
        setModalTitle(`Editando: ${ingredient.name}`);
        setIsModalOpen(true);
    };

    const handleDelete = async (ingredientId: string) => {
        const ingredientToDelete = ingredients.find(ing => ing.id === ingredientId);
        if (!ingredientToDelete) {
            console.error("Intento de eliminar un ingrediente que no existe en el estado local.");
            alert("No se pudo encontrar el ingrediente para eliminar.");
            return;
        }
        if (window.confirm(`¿Estás seguro de que quieres eliminar "${ingredientToDelete.name}"?`)) {
            try {
                await deleteIngredient(heladeriaId, ingredientId);
                setIngredients(prev => prev.filter(ing => ing.id !== ingredientId));
            } catch (error) {
                alert("Error al eliminar el ingrediente.");
            }
        }
    };

    const handleFormSubmit = () => {
        setIsModalOpen(false);
        setRefetchTrigger(c => c + 1);
    };


    return (
        <>
            <main className="px-md-4">
                <Breadcrumbs/>
                <div
                    className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">Gestión de Ingredientes</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <button type="button" className="btn btn-sm btn-outline-primary"
                                onClick={handleOpenAddModal}>
                            + Añadir Ingrediente
                        </button>
                    </div>
                </div>
                <IngredientTable ingredients={ingredients} onEdit={handleOpenEditModal}
                                 onDelete={handleDelete}/>
            </main>

            <Modal title={modalTitle} show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AddIngredientForm
                    onFormSubmit={handleFormSubmit}
                    ingredientToEdit={editingIngredient ?? undefined}
                    heladeriaId={heladeriaId}
                />
            </Modal>
        </>
    );
};

export default IngredientsPage;
