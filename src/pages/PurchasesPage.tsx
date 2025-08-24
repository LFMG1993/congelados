import {useState, useEffect, FC} from "react";
import {useAuthStore} from "../store/authStore";
import FullScreenLoader from "../components/general/FullScreenLoader.tsx";
import Breadcrumbs from "../components/general/Breadcrumbs.tsx";
import {getPurchases} from "../services/purchaseServices";
import Modal from "../components/general/Modal.tsx";
import AddPurchaseForm from "../components/purchases/AddPurchaseForm.tsx";
import PurchaseTable from "../components/purchases/PurchaseTable.tsx";
import {Purchase} from "../types";

const PurchasesPage: FC = () => {
    const {activeIceCreamShopId: heladeriaId, loading: authLoading} = useAuthStore();
    const [pageLoading, setPageLoading] = useState(true);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    useEffect(() => {
        const fetchPurchases = async () => {
            if (!heladeriaId) return;
            setPageLoading(true);
            try {
                const data = await getPurchases(heladeriaId);
                setPurchases(data);
            } catch (error) {
                console.error("Error al obtener las compras:", error);
            } finally {
                setPageLoading(false);
            }
        };

        fetchPurchases();
    }, [heladeriaId, refetchTrigger]);

    if (authLoading || pageLoading) return <FullScreenLoader/>;

    const handleOpenAddModal = () => {
        setIsModalOpen(true);
    };

    const handleFormSubmit = () => {
        setIsModalOpen(false);
        setRefetchTrigger(c => c + 1);
    };

    // Funciones placeholder para editar y eliminar (se implementarán más adelante)
    const handleEditPurchase = (purchase: Purchase) => {
        alert(`Editar compra: ${purchase.id}`);
    };
    const handleDeletePurchase = (purchaseId: string) => {
        alert(`Eliminar compra: ${purchaseId}`);
    };

    return (
        <>
            <main className="px-md-4">
                <Breadcrumbs/>
                <div
                    className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">Registro de Compras</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <button type="button" className="btn btn-sm btn-outline-primary"
                                onClick={handleOpenAddModal}>
                            + Registrar Nueva Compra
                        </button>
                    </div>
                </div>
                <PurchaseTable
                    purchases={purchases}
                    onEdit={handleEditPurchase}
                    onDelete={handleDeletePurchase}
                />
            </main>
            <Modal title="Registrar Nueva Compra" show={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
                <AddPurchaseForm
                    onFormSubmit={handleFormSubmit}
                    heladeriaId={heladeriaId}
                />
            </Modal>
        </>
    );
};

export default PurchasesPage;