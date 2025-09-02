import { Timestamp } from 'firebase/firestore';
/**
 * Representa el perfil de un miembro tal como se almacena DENTRO del documento de la heladería.
 * Contiene los permisos denormalizados para optimizar las lecturas y la seguridad.
 */
export interface ShopMember {
    roleId: string;
    email: string;
    addedAt: Timestamp;
    permissions: Record<string, boolean>;
}

export interface Heladeria {
    id: string;
    name: string;
    address?: string;
    photoURL?: string;
    whatsapp?: string;
    ownerId: string;
    members: Record<string, ShopMember>; // Mapa de UID a perfil del miembro
    createdAt: Timestamp;
}

// Tipo para crear una nueva heladería
export type NewHeladeriaData = Omit<Heladeria, 'id' | 'ownerId' | 'createdAt' | 'members'>;

// Tipo para actualizar una heladería
export type UpdateHeladeriaData = Partial<NewHeladeriaData>;