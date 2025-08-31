import {FC, useMemo} from "react";
import {SellableProduct, Ingredient} from "../../types";

interface ProductGridProps {
    products: SellableProduct[];
    ingredients: Ingredient[];
    onProductSelect: (product: SellableProduct) => void;
}

const ProductGrid: FC<ProductGridProps> = ({products, ingredients, onProductSelect}) => {
    // Agrupamos los productos por la categoría de su primer ingrediente para una mejor organización
    const groupedProducts = useMemo(() => {
        const ingredientsMap = new Map(ingredients.map(ing => [ing.id, ing]));
        return products.reduce((acc, product) => {
            // Usamos la categoría del primer ingrediente de la receta como la categoría del producto
            const mainIngredientId = product.recipe[0]?.ingredientId;
            let category = "Sin Categoría";
            if (mainIngredientId && !mainIngredientId.startsWith('CATEGORY::')) {
                category = ingredientsMap.get(mainIngredientId)?.category || "Sin Categoría";
            } else if (mainIngredientId) {
                category = mainIngredientId.split('::')[1] || "Variables";
            }

            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {} as Record<string, SellableProduct[]>);
    }, [products, ingredients]);

    return (
        <div>
            {Object.entries(groupedProducts).map(([category, productsInCategory]) => (
                <div key={category} className="mb-4">
                    <h4 className="mb-3 border-bottom pb-2">{category}</h4>
                    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
                        {productsInCategory.map(product => (
                            <div key={product.id} className="col"
                                 title={!product.isAvailable ? 'No hay suficientes ingredientes para este producto' : ''}>
                                <div
                                    className={`card h-100 shadow-sm product-card ${!product.isAvailable ? 'disabled' : ''}`}
                                    onClick={() => {
                                        if (product.isAvailable) onProductSelect(product);
                                    }}
                                >
                                    <div className="card-body text-center d-flex flex-column justify-content-center">
                                        <h6 className="card-title">{product.name}</h6>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductGrid;