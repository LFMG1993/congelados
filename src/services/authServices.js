import {auth, db} from "../firebase";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {doc, setDoc, collection, addDoc, updateDoc, serverTimestamp,} from "firebase/firestore";

export const registerUser = async (formData) => {
    try {
        // Registro en Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        // Almacenamiento en Firestore
        await setDoc(doc(db, "usuarios", user.uid), {
            heladeria: formData.iceCream,
            nombres: formData.firstName,
            apellidos: formData.lastName,
            email: formData.email,
            identificacion: formData.identify,
            telefono: formData.phone,
            createdAt: new Date(),
        });

        const heladeriaRef = await addDoc(collection(db, "heladerias"), {
            nombre: formData.iceCream,
            propietario: user.uid,
            createdAt: serverTimestamp(),
        });
        /** @type {any} */
        const usuarioRef = doc(db, "usuarios", user.uid)
        await updateDoc(usuarioRef, {
            misHeladerias: [heladeriaRef.id]
        });

        return user;
    } catch (error) {
        console.error("Error registrando el usuario: ", error);
        throw error;
    }
};