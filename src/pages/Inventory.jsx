import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AddProduct from "../components/Inventory/AddProduct";
import ProductList from "../components/Inventory/ProductList";
import { getInventory } from "../services/inventoryServices";
import { getHeladeriaId } from "../services/userServices.js";

const Inventory = () => {
    const [heladeriaId, setHeladeriaId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchHeladeriaId = async () => {
            try {
                const id = await getHeladeriaId();
                setHeladeriaId(id);
            } catch (error) {
                console.error("Error al obtener el heladeriaId:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHeladeriaId();
    }, []);

    useEffect(() => {
        const fetchInventory = async () => {
            if (!heladeriaId) return;
            try {
                const data = await getInventory(heladeriaId);
                setProducts(data);
            } catch (error) {
                console.error("Error al obtener el inventario:", error);
            }
        };

        fetchInventory();
    }, [heladeriaId]);

    if (loading) {
        return <p>Cargando...</p>;
    }

    if (!heladeriaId) {
        return <p>No se encontró la heladería asociada a este usuario.</p>;
    }

    return (
        <div>
            <Header />
            <div className="container-fluid">
                <div className="row">
                    <Sidebar />
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        <h1>Inventario</h1>
                        <AddProduct
                            heladeriaId={heladeriaId}
                            onProductAdded={() => {
                                // Recarga el inventario cuando se agrega un producto nuevo
                                getInventory(heladeriaId).then(setProducts);
                            }}
                        />
                        <ProductList products={products} />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
