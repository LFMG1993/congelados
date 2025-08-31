import { Timestamp } from "firebase/firestore";

// Define la estructura de un solo ítem dentro de una compra.
export interface PurchaseItem {
    ingredientId: string;
    name: string;
    purchaseUnit: string;
    quantity: number;
    unitCost: number;
    consumptionUnitsPerPurchaseUnit: number;
}
export interface Purchase {
    id: string;
    supplier: string;
    invoiceNumber?: string; // El número de factura es opcional.
    total: number;
    items: PurchaseItem[];
    createdAt: Timestamp;
}

// Tipo para los datos al crear una nueva compra
export type NewPurchaseData = Omit<Purchase, 'id' | 'createdAt'>;