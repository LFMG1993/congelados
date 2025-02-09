import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export const getHeladeriaId = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
        throw new Error("No hay usuario autenticado");
    }

    const userDocRef = doc(db, "usuarios", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        return userData.misHeladerias ? userData.misHeladerias[0] : null;
    } else {
        throw new Error("El documento del usuario no existe");
    }
};
