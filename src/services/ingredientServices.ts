import {db} from "../firebase";
import {collection, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc} from "firebase/firestore";
import {Ingredient, NewIngredientData} from "../types";

/** Obtener los ingredientes de una heladería */
export const getIngredients = async (heladeriaId: string): Promise<Ingredient[]> => {
    try {
        const ingredientsRef = collection(db, "iceCreamShops", heladeriaId, "ingredientes");
        const querySnapshot = await getDocs(ingredientsRef);
        return querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}) as Ingredient);
    } catch (err) {
        console.error("Error al obtener los ingredientes:", err);
        throw new Error('No se pudieron obtener los ingredientes.');
    }
};

/** Agregar un producto a la subcolección "ingredientes" de una heladería. */
export const addIngredient = async (heladeriaId: string, ingredientData: NewIngredientData): Promise<void> => {
    try {
        const ingredientsRef = collection(db, "iceCreamShops", heladeriaId, "ingredientes");
        await addDoc(ingredientsRef, {
            ...ingredientData,
            createdAt: serverTimestamp(),
        });
    } catch (err) {
        console.error("Error al agregar el ingrediente:", err);
        throw new Error('No se pudo agregar el ingrediente.');
    }
};

/** Actualizar un ingrediente existente. */
export const updateIngredient = async (heladeriaId: string, ingredientId: string, dataToUpdate: Partial<NewIngredientData>): Promise<void> => {
    try {
        const ingredientRef = doc(db, "iceCreamShops", heladeriaId, "ingredientes", ingredientId);
        await updateDoc(ingredientRef, dataToUpdate);
    } catch (err) {
        console.error("Error al actualizar el ingrediente:", err);
        throw new Error('No se pudo actualizar el ingrediente.');
    }
};

/** Eliminar un ingrediente. */
export const deleteIngredient = async (heladeriaId: string, ingredientId: string): Promise<void> => {
    try {
        const ingredientRef = doc(db, "iceCreamShops", heladeriaId, "ingredientes", ingredientId);
        await deleteDoc(ingredientRef);
    } catch (err) {
        console.error("Error al eliminar el ingrediente:", err);
        throw new Error('No se pudo eliminar el ingrediente.');
    }
};