import {https, logger} from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

/**
 * Define la estructura de datos esperada que el cliente debe enviar
 * al llamar a la función `createEmployee`.
 */
interface CreateEmployeePayload {
    shopId: string;
    roleId: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

/**
 * Crea un nuevo usuario empleado, su documento en Firestore, y lo añade
 * como miembro a una heladería.
 * Esta función debe ser llamada por un usuario autenticado que sea
 * el 'owner' de la heladería.
 */
export const createEmployee = https.onCall(async (data: CreateEmployeePayload, context) => {    // 1. Verificación de Autenticación y Permisos
  const callerUid = context.auth?.uid;
  if (!callerUid) {
    throw new https.HttpsError(
      "unauthenticated",
      "La función solo puede ser llamada por un usuario autenticado.",
    );
  }

  const {shopId, roleId, email, password, firstName, lastName} = data;
  if (!shopId || !roleId || !email || !password || !firstName || !lastName) {
    throw new https.HttpsError(
      "invalid-argument",
      "Faltan datos para crear el empleado.",
    );
  }

  try {
    const shopDocRef = db.collection("iceCreamShops").doc(shopId);
    const shopDoc = await shopDocRef.get();

    if (!shopDoc.exists || shopDoc.data()?.owner !== callerUid) {
      throw new https.HttpsError(
        "permission-denied",
        "No tienes permiso para añadir miembros a esta heladería.",
      );
    }

    // 2. Crear el usuario en Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: `${firstName} ${lastName}`,
      emailVerified: false, // O true si lo prefieres
    });

    const newUserId = userRecord.uid;

    // 3. Crear los documentos en Firestore usando un Batch
    const batch = db.batch();

    // a) Documento del nuevo usuario en la colección 'users'
    const userDocData = {
      firstName,
      lastName,
      email,
      role: "employee", // Rol genérico del sistema
      iceCreamShopIds: [shopId],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    batch.set(db.collection("users").doc(newUserId), userDocData);

    // b) Actualizar el mapa 'members' en la heladería
    batch.update(shopDocRef, {
      [`members.${newUserId}`]: {
        roleId: roleId,
        addedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    });

    // 4. Ejecutar el batch
    await batch.commit();

    return {
      status: "success",
      message: `Empleado ${email} creado y añadido a la heladería.`,
      userId: newUserId,
    };
  } catch (error: unknown) {
    // Manejo de errores comunes
    // Hacemos una comprobación segura para ver si el error es de un tipo que conocemos
    if (
      typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "auth/email-already-exists"
    ) {
      throw new https.HttpsError(
        "already-exists",
        "El correo electrónico ya está en uso por otro usuario.",
      );
    }
    // Loguear el error para depuración
    logger.error("Error al crear empleado:", error);
    throw new https.HttpsError(
      "unknown",
      "Ocurrió un error inesperado al crear el empleado.",
      error,
    );
  }
});