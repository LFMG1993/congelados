import {FC, useState, useMemo, useEffect} from "react";
import Breadcrumbs from "../components/general/Breadcrumbs";
import {useAuthStore} from "../store/authStore";
import {Sale, ProductSalesReport} from "../types";
import {getSalesByDateRange} from "../services/saleServices";
import DateRangePicker from "../components/reports/DateRangePicker";
import {QuickRangeKey} from "../components/reports/QuickDateRangeButtons";

// Función de ayuda para formatear fechas a YYYY-MM-DD
const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

// Función de ayuda para mostrar fechas en formato DD-MM-YYYY
const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
};


const ReportsPage: FC = () => {
    const {activeIceCreamShopId: shopId} = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [sales, setSales] = useState<Sale[]>([]);
    const [startDate, setStartDate] = useState(formatDate(new Date()));
    const [endDate, setEndDate] = useState(formatDate(new Date()));
    const [fetchTrigger, setFetchTrigger] = useState(0); // Para disparar la carga de datos

    const handleFetchReport = async () => {
        if (!shopId) return;
        setLoading(true);
        try {
            // Ajustamos la fecha de fin para que incluya todo el día
            const endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);

            const data = await getSalesByDateRange(shopId, new Date(startDate), endOfDay);
            setSales(data);
        } catch (error) {
            console.error("Error al generar el reporte:", error);
        } finally {
            setLoading(false);
        }
    };

    // Efecto que se dispara cuando las fechas cambian por un botón rápido
    useEffect(() => {
        if (fetchTrigger > 0) {
            handleFetchReport();
        }
    }, [fetchTrigger]);

    const handleQuickRangeSelect = (range: QuickRangeKey) => {
        const today = new Date();
        let newStartDate = new Date();
        const newEndDate = new Date();

        switch (range) {
            case 'today':
                newStartDate = today;
                break;
            case 'this_week':
                const firstDayOfWeek = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1); // Lunes
                newStartDate = new Date(today.setDate(firstDayOfWeek));
                break;
            case 'this_month':
                newStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'last_3_months':
                newStartDate = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
                break;
            case 'last_6_months':
                newStartDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
                break;
            case 'this_year':
                newStartDate = new Date(today.getFullYear(), 0, 1);
                break;
        }

        setStartDate(formatDate(newStartDate));
        setEndDate(formatDate(newEndDate));
        setFetchTrigger(c => c + 1); // Dispara el useEffect para cargar el reporte
    };

    // --- Cálculos de Reportes con useMemo para eficiencia ---
    const totalRevenue = useMemo(() => {
        return sales.reduce((sum, sale) => sum + sale.total, 0);
    }, [sales]);

    const productSalesReport = useMemo((): ProductSalesReport[] => {
        const productMap = new Map<string, { name: string, quantity: number, revenue: number }>();

        sales.forEach(sale => {
            sale.items.forEach(item => {
                const existing = productMap.get(item.productId);
                if (existing) {
                    existing.quantity += item.quantity;
                    existing.revenue += item.quantity * item.unitPrice;
                } else {
                    productMap.set(item.productId, {
                        name: item.productName,
                        quantity: item.quantity,
                        revenue: item.quantity * item.unitPrice
                    });
                }
            });
        });

        return Array.from(productMap.entries()).map(([productId, data]) => ({
            productId,
            productName: data.name,
            quantitySold: data.quantity,
            totalRevenue: data.revenue,
        })).sort((a, b) => b.totalRevenue - a.totalRevenue);

    }, [sales]);

    return (
        <main className="px-md-4">
            <Breadcrumbs/>
            <div
                className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Reportes de Ventas</h1>
            </div>

            <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onQuickRangeSelect={handleQuickRangeSelect}
                onFetchReport={handleFetchReport}
                loading={loading}
            />
            {/* Título dinámico que muestra el rango de fechas del reporte generado */}
            {sales.length > 0 && !loading && (
                <h4 className="text-muted mb-3 fw-normal">
                    Mostrando resultados para: {formatDateForDisplay(startDate)} al {formatDateForDisplay(endDate)}
                </h4>
            )}
            {/* Aquí irán los resultados del reporte */}
            <div className="row">
                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Ventas Totales</h5>
                            <p className="card-text fs-2 fw-bold">{new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                maximumFractionDigits: 0
                            }).format(totalRevenue)}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Ventas por Producto</div>
                        <div className="card-body">
                            {/* Aquí irá la tabla o gráfica de ventas por producto */}
                            <p>Total de productos vendidos: {productSalesReport.length}</p>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    );
};

export default ReportsPage;