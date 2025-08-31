import {FC, useState, useEffect, useMemo} from "react";
import {useAuthStore} from "../store/authStore";
import FullScreenLoader from "../components/general/FullScreenLoader";
import {Product, Ingredient, SaleItem, IngredientUsage, NewSaleData, SellableProduct} from "../types";
import {getProducts} from "../services/productServices";
import {getIngredients} from "../services/ingredientServices";
import ProductGrid from "../components/pos/ProductGrid";
import OrderSummary from "../components/pos/OrderSummary";
import VariableIngredientModal from "../components/pos/VariableIngredientModal";
import {registerSale} from "../services/saleServices";

const PointOfSalePage: FC = () => {
    const {activeIceCreamShopId: heladeriaId, loading: authLoading} = useAuthStore();
    const [pageLoading, setPageLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [error, setError] = useState<string | null>(null);

    // --- Estado del Pedido Actual ---
    const [currentOrder, setCurrentOrder] = useState<SaleItem[]>([]);
    const [productForVariableSelection, setProductForVariableSelection] = useState<Product | null>(null);
    const [isVariableModalOpen, setIsVariableModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!heladeriaId) {
                setPageLoading(false);
                return;
            }
            setPageLoading(true);
            try {
                const [productsData, ingredientsData] = await Promise.all([
                    getProducts(heladeriaId),
                    getIngredients(heladeriaId)
                ]);
                setProducts(productsData);
                setIngredients(ingredientsData);
            } catch (err) {
                console.error("Error al cargar datos para el POS:", err);
                setError("No se pudieron cargar los productos o ingredientes.");
            } finally {
                setPageLoading(false);
            }
        };

        fetchData();
    }, [heladeriaId]);

    // --- Lógica para determinar qué productos se pueden vender ---
    const sellableProducts = useMemo((): SellableProduct[] => {
        const ingredientsMap = new Map(ingredients.map(ing => [ing.id, ing]));

        // 1. Calcular el stock consumido por el pedido actual
        const consumedStock = new Map<string, number>();
        currentOrder.forEach(orderItem => {
            orderItem.ingredientsUsed.forEach(usage => {
                consumedStock.set(usage.ingredientId, (consumedStock.get(usage.ingredientId) || 0) + (usage.quantity * orderItem.quantity));
            });
        });

        // 2. Determinar la disponibilidad de cada producto
        return products.map(product => {
            const unitsPerIngredient = product.recipe.map(recipeItem => {
                if (recipeItem.ingredientId.startsWith('CATEGORY::')) return Infinity;

                const ingredient = ingredientsMap.get(recipeItem.ingredientId);
                if (!ingredient || !recipeItem.quantity) return 0;

                const currentStock = ingredient.stock ?? 0;
                const stockAlreadyInCart = consumedStock.get(ingredient.id) || 0;
                const availableStockInConsumptionUnits = currentStock - stockAlreadyInCart;

                return Math.floor(availableStockInConsumptionUnits / recipeItem.quantity);
            });

            const availableUnits = Math.max(0, Math.min(...unitsPerIngredient));
            return {...product, isAvailable: availableUnits > 0, availableUnits};
        });
    }, [products, ingredients, currentOrder]);

    const addProductToOrder = (product: Product, variableIngredient?: IngredientUsage) => {
        const ingredientsUsed: IngredientUsage[] = product.recipe
            .filter(item => !item.ingredientId.startsWith('CATEGORY::'))
            .map(item => ({ingredientId: item.ingredientId, quantity: item.quantity}));

        if (variableIngredient) {
            ingredientsUsed.push(variableIngredient);
        }

        const existingItemIndex = currentOrder.findIndex(item => item.productId === product.id && JSON.stringify(item.ingredientsUsed) === JSON.stringify(ingredientsUsed));

        if (existingItemIndex > -1) {
            // Si ya existe un ítem idéntico (mismo producto y mismos ingredientes variables), incrementa la cantidad
            const updatedOrder = [...currentOrder];
            updatedOrder[existingItemIndex].quantity += 1;
            setCurrentOrder(updatedOrder);
        } else {
            // Si no, añade un nuevo ítem al pedido
            const newItem: SaleItem = {
                productId: product.id,
                productName: product.name,
                quantity: 1,
                unitPrice: product.salePrice,
                ingredientsUsed,
            };
            setCurrentOrder(prevOrder => [...prevOrder, newItem]);
        }
    };

    const handleProductSelect = (product: Product) => {
        const hasVariableIngredient = product.recipe.some(item => item.ingredientId.startsWith('CATEGORY::'));
        if (hasVariableIngredient) {
            setProductForVariableSelection(product);
            setIsVariableModalOpen(true);
        } else {
            addProductToOrder(product);
        }
    };

    const handleConfirmVariableSelection = (selectedIngredient: IngredientUsage) => {
        if (productForVariableSelection) {
            addProductToOrder(productForVariableSelection, selectedIngredient);
        }
        setIsVariableModalOpen(false);
        setProductForVariableSelection(null);
    };

    const handleUpdateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            // Eliminar el ítem
            setCurrentOrder(prev => prev.filter(item => item.productId !== productId));
        } else {
            // Actualizar la cantidad
            setCurrentOrder(prev => prev.map(item => item.productId === productId ? {
                ...item,
                quantity: newQuantity
            } : item));
        }
    };

    const handleFinalizeSale = async () => {
        if (!heladeriaId || currentOrder.length === 0) return;

        const saleData: NewSaleData = {
            items: currentOrder,
            total: currentOrder.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0),
        };

        try {
            await registerSale(heladeriaId, saleData);
            alert('¡Venta registrada con éxito!');
            setCurrentOrder([]); // Limpiar el pedido
        } catch (err) {
            console.error("Error al registrar la venta:", err);
            alert('Ocurrió un error al registrar la venta.');
        }
    };

    if (authLoading || pageLoading) return <FullScreenLoader/>;

    if (!heladeriaId) {
        return <div className="container mt-4 alert alert-warning">Por favor, selecciona una heladería para empezar a
            vender.</div>;
    }

    if (error) {
        return <div className="container mt-4 alert alert-danger">{error}</div>;
    }

    return (
        <div className="container-fluid mt-4">
            <div className="row">
                <div className="col-lg-7 col-xl-8">
                    <ProductGrid products={sellableProducts} ingredients={ingredients} onProductSelect={handleProductSelect}/>
                </div>
                <div className="col-lg-5 col-xl-4">
                    <div className="position-sticky" style={{top: '1rem'}}>
                        <OrderSummary
                            orderItems={currentOrder}
                            onUpdateQuantity={handleUpdateQuantity}
                            onFinalizeSale={handleFinalizeSale}
                        />
                    </div>
                </div>
                <VariableIngredientModal
                    show={isVariableModalOpen}
                    onClose={() => setIsVariableModalOpen(false)}
                    product={productForVariableSelection}
                    ingredients={ingredients}
                    onConfirm={handleConfirmVariableSelection}
                />
            </div>
        </div>
    );
};

export default PointOfSalePage;