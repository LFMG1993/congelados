import {FC, useState, useEffect, useMemo} from "react";
import Breadcrumbs from "../components/general/Breadcrumbs";
import {useAuthStore} from "../store/authStore";
import FullScreenLoader from "../components/general/FullScreenLoader";
import {CashSession, Sale, Purchase} from "../types";
import {getOpenCashSession, startCashSession, closeCashSession} from "../services/cashSessionServices";
import Modal from "../components/general/Modal";
import OpenCashSessionForm from "../components/cash/OpenCashSessionForm";
import CloseCashSessionForm from "../components/cash/CloseCashSessionForm";
import {getSalesByDateRange} from "../services/saleServices";
import {getPurchasesForSession} from "../services/purchaseServices";
import SessionSalesTable from "../components/cash/SessionSalesTable";
import SaleDetailModal from "../components/cash/SaleDetailModal";
import SessionPurchasesTable from "../components/cash/SessionPurchasesTable";
import AddPurchaseForm from "../components/purchases/AddPurchaseForm";

const CashSessionPage: FC = () => {
    const {activeIceCreamShopId: shopId, user, loading: authLoading} = useAuthStore();
    const [pageLoading, setPageLoading] = useState(true);
    const [openSession, setOpenSession] = useState<CashSession | null>(null);
    const [sessionSales, setSessionSales] = useState<Sale[]>([]);
    const [sessionPurchases, setSessionPurchases] = useState<Purchase[]>([]);
    const [selectedSaleForDetail, setSelectedSaleForDetail] = useState<Sale | null>(null);
    const [isOpeningModalOpen, setIsOpeningModalOpen] = useState(false);
    const [isClosingModalOpen, setIsClosingModalOpen] = useState(false);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadOpenSession = async () => {
        if (!shopId) return;
        setPageLoading(true);
        try {
            const session = await getOpenCashSession(shopId);
            setOpenSession(session);
            if (session) {
                // Cargar ventas y compras del turno en paralelo
                const [sales, purchases] = await Promise.all([
                    getSalesByDateRange(shopId, session.startTime.toDate(), new Date()),
                    getPurchasesForSession(shopId, session.startTime, session.employeeId)
                ]);
                setSessionSales(sales);
                setSessionPurchases(purchases);
            } else {
                setSessionSales([]);
                setSessionPurchases([]);
            }
        } catch (error) {
            console.error("Error al obtener la sesión de caja:", error);
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        loadOpenSession();
    }, [shopId]);

    const handleOpenSession = async (openingBalance: number) => {
        if (!shopId || !user) return;
        setIsSubmitting(true);
        try {
            await startCashSession(shopId, {
                employeeId: user.uid,
                employeeName: user.firstName || user.email,
                openingBalance
            });
            setIsOpeningModalOpen(false);
            await loadOpenSession();
        } catch (error) {
            console.error("Error al abrir la caja:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSession = async (closingData: { closingBalance: number, notes: string | undefined }) => {
        if (!shopId || !openSession) return;
        setIsSubmitting(true);
        try {
            await closeCashSession(shopId, openSession, closingData);
            setIsClosingModalOpen(false);
            await loadOpenSession();
        } catch (error) {
            console.error("Error al cerrar la caja:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePurchaseFormSubmit = () => {
        setIsPurchaseModalOpen(false);
        loadOpenSession(); // Recargar los datos de la sesión para reflejar la nueva compra
    };

    // Totales calculados para pasar al formulario de cierre
    const sessionTotals = useMemo(() => {
        let cashSales = 0;
        let electronicSales = 0;

        sessionSales.forEach(sale => {
            sale.payments.forEach(payment => {
                if (payment.type === 'cash') {
                    cashSales += payment.amount;
                } else {
                    electronicSales += payment.amount;
                }
            });
        });

        const totalExpenses = sessionPurchases.reduce((sum, purchase) => sum + purchase.total, 0);

        return {
            cashSales,
            electronicSales,
            totalSales: cashSales + electronicSales,
            totalExpenses,
        };
    }, [sessionSales, sessionPurchases]);

    if (authLoading || pageLoading) return <FullScreenLoader/>;

    return (
        <>
            <main className="px-md-4">
                <Breadcrumbs/>
                <div
                    className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">Gestión de Caja</h1>
                </div>

                <div className="card mb-4">
                    <div className="card-body text-center">
                        {openSession ? (
                            <div>
                                <h5 className="card-title">Caja Abierta</h5>
                                <p>Sesión iniciada por <strong>{openSession.employeeName}</strong>.</p>
                                <p>Base inicial: <strong>{new Intl.NumberFormat('es-CO', {
                                    style: 'currency',
                                    currency: 'COP'
                                }).format(openSession.openingBalance)}</strong></p>
                                <button className="btn btn-danger" onClick={() => setIsClosingModalOpen(true)}>Cerrar
                                    Caja
                                </button>
                            </div>
                        ) : (
                            <div>
                                <h5 className="card-title">Caja Cerrada</h5>
                                <p>No hay ninguna sesión de caja activa en este momento.</p>
                                <button className="btn btn-success" onClick={() => setIsOpeningModalOpen(true)}>Abrir
                                    Caja
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {openSession && (
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <SessionSalesTable
                                sales={sessionSales}
                                onViewDetails={(sale) => setSelectedSaleForDetail(sale)}
                            />
                        </div>
                        <div className="col-lg-4">
                            <SessionPurchasesTable purchases={sessionPurchases}/>
                            <div className="d-grid mt-3">
                                <button className="btn btn-outline-primary"
                                        onClick={() => setIsPurchaseModalOpen(true)}>+ Registrar Gasto/Compra
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Modal title="Abrir Sesión de Caja" show={isOpeningModalOpen} onClose={() => setIsOpeningModalOpen(false)}>
                <OpenCashSessionForm onSubmit={handleOpenSession} loading={isSubmitting}/>
            </Modal>

            <Modal title="Cerrar Sesión de Caja" show={isClosingModalOpen} onClose={() => setIsClosingModalOpen(false)}
                   size="lg">
                <CloseCashSessionForm
                    onSubmit={handleCloseSession}
                    loading={isSubmitting}
                    sessionTotals={sessionTotals}
                    openingBalance={openSession?.openingBalance || 0}
                />
            </Modal>
            <Modal title="Registrar Nueva Compra" show={isPurchaseModalOpen}
                   onClose={() => setIsPurchaseModalOpen(false)} size="lg">
                <AddPurchaseForm onFormSubmit={handlePurchaseFormSubmit} heladeriaId={shopId!}/>
            </Modal>
            <SaleDetailModal sale={selectedSaleForDetail} onClose={() => setSelectedSaleForDetail(null)}/>
        </>
    );
};

export default CashSessionPage;