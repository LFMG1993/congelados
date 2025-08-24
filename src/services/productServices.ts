import {db} from "../firebase.js";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    CollectionReference,
    DocumentData
} from "firebase/firestore";
import {Product, NewProductData} from "../types";

const getProductsCollection = (heladeriaId: string): CollectionReference<DocumentData> => {
    return collection(db, "heladerias", heladeriaId, "productos");
};

/** Obtener todos los productos de una heladería */
export const getProducts = async (heladeriaId: string): Promise<Product[]> => {
    const querySnapshot = await getDocs(getProductsCollection(heladeriaId));
    return querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}) as Product);
};

/** Añadir un nuevo producto */
export const addProduct = async (heladeriaId: string, productData: NewProductData): Promise<Product> => {
    const docRef = await addDoc(getProductsCollection(heladeriaId), {
        ...productData,
        createAt: serverTimestamp(),
    });
    return {id: docRef.id, ...productData, createAt: new Date()} as unknown as Product;
};

/** Actualizar un producto existente */
export const updateProduct = async (heladeriaId: string, productId: string, productData: Partial<NewProductData>): Promise<void> => {
    const productRef = doc(db, "heladerias", heladeriaId, "productos", productId);
    await updateDoc(productRef, productData);
};

/** Eliminar un producto */
export const deleteProduct = async (heladeriaId: string, productId: string): Promise<void> => {
    const productRef = doc(db, "heladerias", heladeriaId, "productos", productId);
    await deleteDoc(productRef);
};