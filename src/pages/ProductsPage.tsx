import {useState, useEffect, FC} from "react";
import {useAuthStore} from "../store/authStore";
import FullScreenLoader from "../components/general/FullScreenLoader.tsx";
import Breadcrumbs from "../components/general/Breadcrumbs.tsx";
import {getProducts} from "../services/productServices";
import {Product} from "../types";

const ProductsPage: FC = () => {
    const {activeIceCreamShopId: heladeriaId, loading: authLoading} = useAuthStore();
    const [pageLoading, setPageLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [modalTitle, setModalTitle] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            if (!heladeriaId) return;
            setPageLoading(true);
            try {
                const data = await getProducts(heladeriaId);
                setProducts(data);
            } catch (error) {
                console.error("Error al obtener los productos:", error);
            } finally {
                setPageLoading(false);
            }
        };

        fetchProducts();
    }, [heladeriaId]);

    if (authLoading || pageLoading) return <FullScreenLoader/>;

    if (!heladeriaId) {
        return <p>Por favor, selecciona una heladería para gestionar los productos.</p>;
    }

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setModalTitle('Crear Nuevo Producto');
        setIsModalOpen(true);
    };

    // Las demás funciones (editar, delete, submit) las implementaremos cuando tengamos el formulario.

    return (
        <>
            <main className="px-md-4">
                <Breadcrumbs/>
                <div
                    className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">Gestión de Productos</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <button type="button" className="btn btn-sm btn-outline-primary"
                                onClick={handleOpenAddModal}>
                            + Crear Producto
                        </button>
                    </div>
                </div>
                {/* Aquí irá la tabla de productos cuando la creemos */}
                <div className="alert alert-info">
                    Próximamente: Tabla de Productos y Formulario de Creación/Edición.
                </div>
            </main>
            {/*
            <Modal title={modalTitle} show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ProductForm
                    onFormSubmit={handleFormSubmit}
                    productToEdit={editingProduct}
                    heladeriaId={heladeriaId}
                />
            </Modal>
            */}
        </>
    );
};

export default ProductsPage;