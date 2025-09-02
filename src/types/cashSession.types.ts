import { Timestamp } from "firebase/firestore";

export interface Expense {
    description: string;
    amount: number;
}

export interface CashSession {
    id: string;
    employeeId: string;     // UID del empleado que abrió la caja
    employeeName: string;   // Nombre del empleado
    startTime: Timestamp;
    endTime?: Timestamp;
    status: 'open' | 'closed';

    openingBalance: number; // Base inicial
    closingBalance?: number; // Conteo final de efectivo

    // Datos calculados al momento del cierre
    cashSales?: number;
    transferSales?: number;
    totalSales?: number;
    expenses?: Expense[];
    totalExpenses?: number;
    unregisteredSales?: number; // "Sobrantes"
    notes?: string; // "Observaciones"
    expectedCashInBox?: number;   // openingBalance + cashSales - totalExpenses + unregisteredSales
    difference?: number;     // closingBalance - expectedCash (sobrante o faltante)
}

export type NewCashSessionData = Pick<CashSession, 'employeeId' | 'employeeName' | 'openingBalance'>;
export type CloseCashSessionData = Pick<CashSession, 'closingBalance' | 'expenses'>;