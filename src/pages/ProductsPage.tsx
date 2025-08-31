import {useState, useEffect, FC, useMemo} from "react";
import {useAuthStore} from "../store/authStore";
import FullScreenLoader from "../components/general/FullScreenLoader";
import Breadcrumbs from "../components/general/Breadcrumbs";
import {getProducts, deleteProduct} from "../services/productServices";
import {Product, Ingredient, EnrichedProduct, Purchase} from "../types";
import Modal from "../components/general/Modal";
import ProductForm from "../components/products/ProductForm";
import ProductTable from "../components/products/ProductTable";
import {getIngredients} from "../services/ingredientServices";
import {getPurchases} from "../services/purchaseServices";

const ProductsPage: FC = () => {
    const {activeIceCreamShopId: heladeriaId, loading: authLoading} = useAuthStore();
    const [pageLoading, setPageLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<EnrichedProduct | undefined>(undefined);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!heladeriaId) return;
            setPageLoading(true);
            try {
                // Ahora cargamos productos, ingredientes y compras en paralelo
                const [productsData, ingredientsData, purchasesData] = await Promise.all([
                    getProducts(heladeriaId),
                    getIngredients(heladeriaId),
                    getPurchases(heladeriaId)
                ]);
                setProducts(productsData);
                setIngredients(ingredientsData);
                setPurchases(purchasesData);
            } catch (error) {
                console.error("Error al obtener datos de los productos:", error);
            } finally {
                setPageLoading(false);
            }
        };

        fetchData();
    }, [heladeriaId, refetchTrigger]);

    // --- Lógica para enriquecer los productos con datos calculados ---
    const enrichedProducts = useMemo((): EnrichedProduct[] => {
        if (!products.length || !ingredients.length) return [];

        const ingredientsMap = new Map(ingredients.map(ing => [ing.id, ing]));

        // 1. Crear un mapa con el costo más reciente de cada ingrediente
        const ingredientCostMap = new Map<string, number>();
        // Ordenamos las compras de la más antigua a la más nueva para que la última sobrescriba
        const sortedPurchases = [...purchases].sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
        sortedPurchases.forEach(purchase => {
            purchase.items.forEach(item => {
                ingredientCostMap.set(item.ingredientId, item.unitCost);
            });
        });

        return products.map(product => {
            const recipeCost = product.recipe.reduce((totalCost, item) => {
                if (item.ingredientId.startsWith('CATEGORY::')) {
                    const category = item.ingredientId.split('::')[1];
                    const ingredientsInCategory = ingredients.filter(ing => ing.category === category);

                    if (ingredientsInCategory.length === 0) return totalCost;

                    const costsPerConsumptionUnit = ingredientsInCategory.map(ing => {
                        const latestUnitCost = ingredientCostMap.get(ing.id) ?? 0;
                        return ing.consumptionUnitsPerPurchaseUnit > 0 ? latestUnitCost / ing.consumptionUnitsPerPurchaseUnit : 0;
                    });

                    const highestCost = Math.max(...costsPerConsumptionUnit);
                    return totalCost + (highestCost * item.quantity);

                } else {
                    const ingredient = ingredientsMap.get(item.ingredientId);
                    if (!ingredient || !ingredient.consumptionUnitsPerPurchaseUnit) return totalCost;

                    const latestUnitCost = ingredientCostMap.get(item.ingredientId) ?? 0;
                    const costPerConsumptionUnit = latestUnitCost / ingredient.consumptionUnitsPerPurchaseUnit;
                    return totalCost + (costPerConsumptionUnit * item.quantity);
                }
            }, 0);

            // Calcular cuántas unidades se pueden hacer (el cuello de botella)
            const unitsPerIngredient = product.recipe.map(item => {
                // Si el ingrediente es variable, no limita la producción en esta vista.
                if (item.ingredientId.startsWith('CATEGORY::')) return Infinity;

                const ingredient = ingredientsMap.get(item.ingredientId);
                if (!ingredient || !item.quantity) return Infinity;

                const totalStockInConsumptionUnits = ingredient.stock ?? 0;
                return Math.floor(totalStockInConsumptionUnits / item.quantity);
            });

            const availableUnits = Math.min(...unitsPerIngredient);

            return {
                ...product,
                recipeCost,
                estimatedProfit: product.salePrice - recipeCost,
                availableUnits: isFinite(availableUnits) ? availableUnits : 0,
            };
        });
    }, [products, ingredients, purchases]);

    if (authLoading || pageLoading) return <FullScreenLoader/>;

    if (!heladeriaId) {
        return <p>Por favor, selecciona una heladería para gestionar los productos.</p>;
    }

    const handleOpenAddModal = () => {
        setEditingProduct(undefined);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (product: EnrichedProduct) => {
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
                <ProductTable products={enrichedProducts} onEdit={handleOpenEditModal} onDelete={handleDeleteProduct}/>
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