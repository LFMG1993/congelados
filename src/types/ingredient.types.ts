import { Timestamp } from "firebase/firestore";

export interface Ingredient {
    id: string;
    name: string;
    category: string;          // Ej: 'Helados', 'Toppings', 'Bases'
    purchaseUnit: string;      // La unidad en la que compras el ingrediente. Ej: 'Caja 4.9kg'
    consumptionUnit: string;   // La unidad que usas en las recetas. Ej: 'gramo'
    purchaseCost: number;      // El costo de una 'purchaseUnit'. Ej: 50000
    // Cuántas 'consumptionUnit' hay en una 'purchaseUnit'. Ej: 4900 (gramos por caja)
    consumptionUnitsPerPurchaseUnit: number;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
}

// Tipo para los datos al crear un nuevo ingrediente
export type NewIngredientData = Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>;

// Permite actualizar cualquier campo del nuevo ingrediente.
export type UpdateIngredientData = Partial<NewIngredientData>;