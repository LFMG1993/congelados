import { Timestamp } from "firebase/firestore";

export interface CashSession {
    id: string;
    employeeId: string;     // UID del empleado que abrió la caja
    employeeName: string;   // Nombre del empleado
    startTime: Timestamp;
    endTime?: Timestamp;
    status: 'open' | 'closed';
    openingBalance: number; // Base inicial
    closingBalance?: number; // Conteo final de efectivo

    // Datos calculados al cierre
    cashSales?: number;
    transferSales?: number;
    totalSales?: number;
    expenses?: { description: string, amount: number }[];
    totalExpenses?: number;
    expectedCash?: number;   // openingBalance + cashSales - totalExpenses
    difference?: number;     // closingBalance - expectedCash (sobrante o faltante)
}