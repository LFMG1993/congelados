import {auth, db} from "../firebase";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {doc, setDoc} from "firebase/firestore";

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
        return user;
    } catch (error) {
        console.error("Error registrando el usuario: ", error);
        throw error;
    }
};