import {db} from "../firebase";
import {
    collection,
    getDocs,
    serverTimestamp,
    CollectionReference,
    DocumentData,
    writeBatch,
    doc,
    increment,
    getDoc
} from "firebase/firestore";
import {Purchase, NewPurchaseData} from "../types";

const getPurchasesCollection = (heladeriaId: string): CollectionReference<DocumentData> => {
    return collection(db, "iceCreamShops", heladeriaId, "compras");
};

/** Obtener todas las compras de una heladería */
export const getPurchases = async (heladeriaId: string): Promise<Purchase[]> => {
    const querySnapshot = await getDocs(getPurchasesCollection(heladeriaId));
    return querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}) as Purchase);
};

/** Registrar una nueva compra */
export const addPurchase = async (heladeriaId: string, purchaseData: NewPurchaseData): Promise<Purchase> => {
    const batch = writeBatch(db);
    // Crear la referencia para el nuevo documento de compra
    const newPurchaseRef = doc(collection(db, "iceCreamShops", heladeriaId, "compras"));
    // Añadir la operación de creación de la compra al batch
    batch.set(newPurchaseRef, {
        ...purchaseData,
        createdAt: serverTimestamp(), // Unificamos el nombre del campo a 'createdAt'
    });
    // Por cada ítem en la compra, actualizar el stock del ingrediente correspondiente
    purchaseData.items.forEach(item => {
        const ingredientRef = doc(db, "iceCreamShops", heladeriaId, "ingredientes", item.ingredientId);
        const stockToAdd = item.quantity * item.consumptionUnitsPerPurchaseUnit;
        batch.update(ingredientRef, { stock: increment(stockToAdd) });
    });
    await batch.commit();
    return {id: newPurchaseRef.id, ...purchaseData, createdAt: new Date()} as unknown as Purchase;
};

/** Actualizar una compra existente y ajustar el stock correspondientemente */
export const updatePurchase = async (heladeriaId: string, purchaseId: string, newData: NewPurchaseData) => {
    const purchaseRef = doc(db, "iceCreamShops", heladeriaId, "compras", purchaseId);
    const oldPurchaseSnap = await getDoc(purchaseRef);
    if (!oldPurchaseSnap.exists()) {
        throw new Error("La compra que intentas actualizar no existe.");
    }
    const oldData = oldPurchaseSnap.data() as Purchase;

    const batch = writeBatch(db);

    // 1. Revertir el stock de los ítems antiguos
    oldData.items.forEach(item => {
        const ingredientRef = doc(db, "iceCreamShops", heladeriaId, "ingredientes", item.ingredientId);
        const stockToRevert = item.quantity * item.consumptionUnitsPerPurchaseUnit;
        batch.update(ingredientRef, {stock: increment(-stockToRevert)});
    });

    // 2. Añadir el stock de los nuevos ítems
    newData.items.forEach(item => {
        const ingredientRef = doc(db, "iceCreamShops", heladeriaId, "ingredientes", item.ingredientId);
        const stockToAdd = item.quantity * item.consumptionUnitsPerPurchaseUnit;
        batch.update(ingredientRef, {stock: increment(stockToAdd)});
    });

    // 3. Actualizar el documento de la compra
    batch.update(purchaseRef, {...newData, updatedAt: serverTimestamp()});

    await batch.commit();
};

/** Eliminar una compra y revertir el stock de los ingredientes */
export const deletePurchase = async (heladeriaId: string, purchaseId: string) => {
    // Para la eliminación, simplemente revertimos el stock. Reutilizamos la lógica de update pasándole datos vacíos.
    const purchaseRef = doc(db, "iceCreamShops", heladeriaId, "compras", purchaseId);
    const oldPurchaseSnap = await getDoc(purchaseRef);

    if (!oldPurchaseSnap.exists()) return; // Si no existe, no hay nada que hacer

    const oldData = oldPurchaseSnap.data() as Purchase;
    const batch = writeBatch(db);

    // 1. Revertir el stock de los ítems
    oldData.items.forEach(item => {
        const ingredientRef = doc(db, "iceCreamShops", heladeriaId, "ingredientes", item.ingredientId);
        const stockToRevert = item.quantity * item.consumptionUnitsPerPurchaseUnit;
        batch.update(ingredientRef, {stock: increment(-stockToRevert)});
    });

    // 2. Eliminar el documento de la compra
    batch.delete(purchaseRef);

    await batch.commit();
};