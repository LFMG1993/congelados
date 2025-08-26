import {useState, useEffect, FC} from "react";
import {useAuthStore} from "../store/authStore";
import FullScreenLoader from "../components/general/FullScreenLoader.tsx";
import Breadcrumbs from "../components/general/Breadcrumbs.tsx";
import {getProducts, deleteProduct} from "../services/productServices";
import {Product, Ingredient} from "../types";
import Modal from "../components/general/Modal.tsx";
import ProductForm from "../components/products/ProductForm.tsx";
import ProductTable from "../components/products/ProductTable.tsx";
import {getIngredients} from "../services/ingredientServices.ts";

const ProductsPage: FC = () => {
    const {activeIceCreamShopId: heladeriaId, loading: authLoading} = useAuthStore();
    const [pageLoading, setPageLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!heladeriaId) return;
            setPageLoading(true);
            try {
                // Cargar productos e ingredientes en paralelo
                const [productsData, ingredientsData] = await Promise.all([
                    getProducts(heladeriaId),
                    getIngredients(heladeriaId)
                ]);
                setProducts(productsData);
                setIngredients(ingredientsData);
            } catch (error) {
                console.error("Error al obtener datos de los productos:", error);
            } finally {
                setPageLoading(false);
            }
        };

        fetchData();
    }, [heladeriaId, refetchTrigger]);

    if (authLoading || pageLoading) return <FullScreenLoader/>;

    if (!heladeriaId) {
        return <p>Por favor, selecciona una heladería para gestionar los productos.</p>;
    }

    const handleOpenAddModal = () => {
        setEditingProduct(undefined);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
            try {
                await deleteProduct(heladeriaId!, productId);
                setRefetchTrigger(c => c + 1); // Recargar
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
            }
        }
    };

    const handleFormSubmit = () => {
        setIsModalOpen(false);
        setRefetchTrigger(c => c + 1); // Recargar
    };

    return (
        <>
            <main className="px-md-4">
                <Breadcrumbs/>
                <div
                    className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">Gestión de Productos</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <button type="button" className="btn btn-sm btn-outline-primary"
                                onClick={handleOpenAddModal}>
                            + Crear Producto
                        </button>
                    </div>
                </div>
                <ProductTable products={products} onEdit={handleOpenEditModal} onDelete={handleDeleteProduct}/>
            </main>
            <Modal title={editingProduct ? "Editar Producto" : "Crear Nuevo Producto"} show={isModalOpen}
                   onClose={() => setIsModalOpen(false)}>
                <ProductForm
                    onFormSubmit={handleFormSubmit}
                    productToEdit={editingProduct}
                    shopId={heladeriaId}
                    availableIngredients={ingredients}
                />
            </Modal>
        </>
    );
};

export default ProductsPage;