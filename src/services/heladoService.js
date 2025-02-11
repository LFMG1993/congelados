import { db } from "../firebase";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";

// Función para obtener todos los helados de una heladería
export const getHelados = async (heladeriaId) => {
    try {
        const heladoRef = collection(db, "heladerias", heladeriaId, "helado");
        const querySnapshot = await getDocs(heladoRef);
        const helados = [];
        querySnapshot.forEach((doc) => {
            helados.push({ id: doc.id, ...doc.data() });
        });
        return helados;
    } catch (error) {
        console.error("Error al obtener los helados:", error);
        throw error;
    }
};

// Función para agregar un nuevo helado
export const addHelado = async (heladeriaId, heladoData) => {
    try {
        const heladoRef = collection(db, "heladerias", heladeriaId, "helado");
        await addDoc(heladoRef, {
            ...heladoData,
            creadoEn: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error al agregar el helado:", error);
        throw error;
    }
};
