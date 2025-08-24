import { Timestamp } from "firebase/firestore";

// Define un solo ingrediente dentro de la receta de un producto.
export interface RecipeItem {
    ingredientId: string;
    // La cantidad del ingrediente en su 'unidad de consumo' (ej: 100 gramos).
    quantity: number;
}

// Define la estructura de un producto en el sistema.
export interface Product {
    id: string;
    name: string;
    salePrice: number;
    recipe: RecipeItem[];
    createdAt: Timestamp;
    updatedAt?: Timestamp;
}

// Tipo para los datos al crear un nuevo producto
export type NewProductData = Omit<Product, 'id' | 'createAt' | 'updatedAt'>;

// Tipos que se pueden actualizar de un producto existente.
export type UpdateProductData = Partial<NewProductData>;