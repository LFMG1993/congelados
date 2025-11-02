import {FC, useEffect, useMemo, useState} from 'react';
import {CashSession, Purchase, Sale} from '../../types';
import SessionReportTable from "./SessionReportTable.tsx";
import {useAuthStore} from "../../store/authStore.ts";
import {getSalesBySessionId} from "../../services/saleServices.ts";
import {getPurchasesForPeriod} from "../../services/dashboardService.ts";

interface SessionsReportProps {
    sessions: CashSession[];
    loading: boolean;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
}).format(value);

const SessionsReport: FC<SessionsReportProps> = ({sessions, loading}) => {
    const {activeIceCreamShop} = useAuthStore();
    const [selectedSession, setSelectedSession] = useState<CashSession | null>(null);
    const [sessionDetails, setSessionDetails] = useState<{ sales: Sale[], purchases: Purchase[] } | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!selectedSession || !activeIceCreamShop?.id) return;

            setDetailsLoading(true);
            try {
                const [sales, purchases] = await Promise.all([
                    getSalesBySessionId(activeIceCreamShop.id, selectedSession.id),
                    // Las compras no están ligadas a la sesión, las buscamos por el rango de tiempo
                    getPurchasesForPeriod(activeIceCreamShop.id, selectedSession.startTime.toDate(), selectedSession.endTime!.toDate())
                ]);
                setSessionDetails({sales, purchases});
            } catch (error) {
                console.error("Error al cargar detalles de la sesión:", error);
            } finally {
                setDetailsLoading(false);
            }
        };

        fetchDetails();
    }, [selectedSession, activeIceCreamShop?.id]);

    const bestSellingProduct = useMemo(() => {
        if (!sessionDetails?.sales) return null;
        const productMap = new Map<string, { name: string, quantity: number }>();
        sessionDetails.sales.forEach(sale => {
            sale.items.forEach(item => {
                const existing = productMap.get(item.productId);
                if (existing) {
                    existing.quantity += item.quantity;
                } else {
                    productMap.set(item.productId, {name: item.productName, quantity: item.quantity});
                }
            });
        });
        return Array.from(productMap.values()).sort((a, b) => b.quantity - a.quantity)[0];
    }, [sessionDetails]);

    const bestHour = useMemo(() => {
        if (!sessionDetails?.sales) return null;
        const hourMap = new Array(24).fill(0);
        sessionDetails.sales.forEach(sale => {
            const hour = sale.createdAt.toDate().getHours();
            hourMap[hour] += sale.total;
        });
        const maxRevenue = Math.max(...hourMap);
        const bestHourIndex = hourMap.indexOf(maxRevenue);
        return bestHourIndex >= 0 ? `${bestHourIndex}:00 - ${bestHourIndex + 1}:00` : 'N/A';
    }, [sessionDetails]);


    if (loading) {
        return <div className="text-center p-5"><div className="spinner-border" role="status"/></div>;
    }

    if (sessions.length === 0 && !loading) {
        return <div className="alert alert-light text-center">No hay sesiones de caja cerradas en este período.</div>;
    }

    return (
        <>
            <SessionReportTable sessions={sessions} onViewDetails={setSelectedSession}/>

            {selectedSession && (
                <div className="card mt-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Análisis de la Sesión de {selectedSession.employeeName}</h5>
                        <button type="button" className="btn-close" onClick={() => setSelectedSession(null)}></button>
                    </div>
                    <div className="card-body">
                        {detailsLoading ? (
                            <div className="text-center p-3"><div className="spinner-border spinner-border-sm"/></div>
                        ) : (
                            <div className="row">
                                <div className="col-md-4"><strong>Producto Estrella:</strong> {bestSellingProduct?.name || 'N/A'} ({bestSellingProduct?.quantity || 0} uds)</div>
                                <div className="col-md-4"><strong>Mejor Hora de Venta:</strong> {bestHour}</div>
                                <div className="col-md-4"><strong>Compras Realizadas:</strong> {formatCurrency(sessionDetails?.purchases.reduce((sum, p) => sum + p.total, 0) || 0)}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default SessionsReport;