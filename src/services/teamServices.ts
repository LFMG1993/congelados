import {db} from "../firebase.ts";
import {
    collection,
    getDocs,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    deleteField,
    writeBatch,
    serverTimestamp,
    setDoc,
    query,
    where
} from "firebase/firestore";
import {Role, NewRoleData, InvitationData, PendingInvitation} from "../types";

/**
 * Obtiene todos los roles de una heladería específica.
 * @param shopId - El ID de la heladería.
 */
export const getRoles = async (shopId: string): Promise<Role[]> => {
    const rolesRef = collection(db, "iceCreamShops", shopId, "roles");
    const querySnapshot = await getDocs(rolesRef);
    return querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}) as Role);
};

/**
 * Añade un nuevo rol a una heladería.
 * @param shopId - El ID de la heladería.
 * @param roleData - Los datos del nuevo rol.
 */
export const addRole = async (shopId: string, roleData: NewRoleData): Promise<void> => {
    const rolesRef = collection(db, "iceCreamShops", shopId, "roles");
    await addDoc(rolesRef, roleData);
};

/**
 * Actualiza un rol existente.
 * @param shopId - El ID de la heladería.
 * @param roleId - El ID del rol a actualizar.
 * @param dataToUpdate - Los datos a actualizar.
 */
export const updateRole = async (shopId: string, roleId: string, dataToUpdate: Partial<NewRoleData>): Promise<void> => {
    const roleRef = doc(db, "iceCreamShops", shopId, "roles", roleId);
    await updateDoc(roleRef, dataToUpdate);
};

/**
 * Elimina un rol.
 * @param shopId - El ID de la heladería.
 * @param roleId - El ID del rol a eliminar.
 */
export const deleteRole = async (shopId: string, roleId: string): Promise<void> => {
    // TODO: Añadir lógica para verificar que el rol no esté en uso antes de borrar.
    const roleRef = doc(db, "iceCreamShops", shopId, "roles", roleId);
    await deleteDoc(roleRef);
};

/**
 * Crea un documento de invitación para un nuevo miembro.
 * @param invitationData - Datos de la invitación (shopId, email, roleId).
 * @returns El ID del documento de la invitación creada.
 */
export const inviteMember = async (invitationData: InvitationData): Promise<string> => {
    const invitationsRef = collection(db, "iceCreamShops", invitationData.shopId, "invitations");
    const newDocRef = await addDoc(invitationsRef, {
        ...invitationData,
        status: "pending",
        createdAt: serverTimestamp()
    });
    return newDocRef.id;
};

/**
 * Obtiene todas las invitaciones pendientes para una heladería específica.
 * @param shopId - El ID de la heladería.
 */
export const getPendingInvitations = async (shopId: string) => {
    const invRef = collection(db, "iceCreamShops", shopId, "invitations");
    const q = query(invRef, where("status", "in", ["pending", "claimed"]));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()})) as PendingInvitation[];};

/**
 * Un usuario recién registrado "reclama" una invitación actualizándola con su UID.
 * @param shopId
 * @param invitationId
 * @param userId
 */
export const claimInvitation = async (shopId: string, invitationId: string, userId: string) => {
    const invRef = doc(db, "iceCreamShops", shopId, "invitations", invitationId);
    await updateDoc(invRef, {memberUid: userId, status: 'claimed'});
};

/**
 * Crea el documento de un usuario en la colección 'users' después de que se registra
 * a través de una invitación. No lo vincula a la tienda, solo crea su perfil.
 * @param user - El objeto de usuario de Firebase Auth.
 */
export const createInvitedUser = async (user: { uid: string, email: string | null }) => {
    if (!user.email) {
        throw new Error("El usuario debe tener un email.");
    }
    const userDocRef = doc(db, "users", user.uid);
    // Usamos set con merge por si el usuario ya existía de un flujo anterior.
    await setDoc(userDocRef, {
        email: user.email,
        createdAt: serverTimestamp()
    }, {merge: true});
};

/**
* Aprobado por el dueño, esta función finaliza el proceso de invitación:
 * 1. Añade al miembro a la heladería.
* 2. Actualiza el perfil del miembro con el ID de la heladería.
* 3. Elimina la invitación.
* @param invitation - El objeto de la invitación a aprobar.
*/
export const approveInvitation = async (invitation: InvitationData & { id: string, memberUid: string }) => {
    const {id: invitationId, shopId, roleId, memberUid, email} = invitation;
    const invitationRef = doc(db, "iceCreamShops", shopId, "invitations", invitationId);

    const batch = writeBatch(db);

    // 1. Añadir al miembro a la heladería usando UPDATE con DOT NOTATION.
    const shopDocRef = doc(db, "iceCreamShops", shopId);
    batch.update(shopDocRef, {
        [`members.${memberUid}`]: {
            roleId,
            email, // Denormalización
            addedAt: serverTimestamp()
        }
    });
    // 3. Eliminar la invitación para que no se pueda volver a usar.
    batch.delete(invitationRef);

    await batch.commit();
};

/**
 * Elimina a un miembro de una heladería.
 * @param shopId - El ID de la heladería.
 * @param memberId - El UID del miembro a eliminar.
 */
export const removeMember = async (shopId: string, memberId: string): Promise<void> => {
    const shopRef = doc(db, "iceCreamShops", shopId);
    await updateDoc(shopRef, {
        [`members.${memberId}`]: deleteField()
    });
};
