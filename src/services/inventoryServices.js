import { db } from "../firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

// Obtener productos del inventario de una heladería
export const getInventory = async (heladeriaId) => {
    try {
        const inventoryRef = collection(db, "heladerias", heladeriaId, "inventario");
        const querySnapshot = await getDocs(inventoryRef);
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return products;
    } catch (error) {
        console.error("Error al obtener el inventario:", error);
        return [];
    }
};

// Agregar un producto a la subcolección "inventario"
export const addProduct = async (heladeriaId, productData) => {
    try {
        const inventoryRef = collection(db, "heladerias", heladeriaId, "inventario");
        await addDoc(inventoryRef, {
            ...productData,
            creadoEn: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error al agregar producto:", error);
        throw error;
    }
};
