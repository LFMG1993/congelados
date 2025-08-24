export interface Heladeria {
    id: string;
    name: string;
    address?: string;
    photoURL?: string;
    whatsapp?: string;
    userId: string;
}

// Tipo para crear una nueva heladería
export type NewHeladeriaData = Omit<Heladeria, 'id' | 'userId'>;

// Tipo para actualizar una heladería
export type UpdateHeladeriaData = Partial<NewHeladeriaData>;