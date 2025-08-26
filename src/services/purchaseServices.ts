import {db} from "../firebase";
import {collection, getDocs, addDoc, serverTimestamp, CollectionReference, DocumentData} from "firebase/firestore";
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
    const docRef = await addDoc(getPurchasesCollection(heladeriaId), {
        ...purchaseData,
        fecha: serverTimestamp(), // La fecha de la compra es cuando se registra
    });
    return {id: docRef.id, ...purchaseData, fecha: new Date()} as unknown as Purchase;
};