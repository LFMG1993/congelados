import { Timestamp } from "firebase/firestore";

export interface Ingredient {
    id: string;
    name: string;
    purchaseUnit: string; // Ej: 'Caja de 1kg', 'Bolsa de 500g'
    consumptionUnit: string; // Ej: 'gramo', 'bola', 'mililitro'
    costPerUnit: number; // Costo por unidad de compra
    // Cuántas unidades de consumo hay en una unidad de compra. Ej: Si la unidad de compra es 'Caja de 1kg' y la unidad de consumo es 'gramo', el factor sería 1000.
    conversionFactor: number;
    createdAt: Timestamp; //
}

// Tipo para los datos al crear un nuevo ingrediente
export type NewIngredientData = Omit<Ingredient, 'id' | 'createdAt'>;

// Permite actualizar cualquier campo del nuevo ingrediente.
export type UpdateIngredientData = Partial<NewIngredientData>;