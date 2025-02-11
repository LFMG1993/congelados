import React, {useState, useEffect} from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AddHelado from "../components/Helado/AddHelado";
import HeladoList from "../components/Helado/HeladoList";
import {getHelados} from "../services/heladoService";
import {getHeladeriaId} from "../services/userServices";
import {auth} from "../firebase";
import {onAuthStateChanged} from "firebase/auth";

const HeladoInventory = () => {
    const [heladeriaId, setHeladeriaId] = useState(null);
    const [helados, setHelados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Esperamos a que Firebase confirme el estado de autenticación
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const id = await getHeladeriaId();
                    setHeladeriaId(id);
                } catch (error) {
                    console.error("Error al obtener el heladeriaId:", error);
                }
            } else {
                console.error("No hay usuario autenticado");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchHelados = async () => {
            if (!heladeriaId) return;
            try {
                const data = await getHelados(heladeriaId);
                setHelados(data);
            } catch (error) {
                console.error("Error al obtener los helados:", error);
            }
        };

        fetchHelados();
    }, [heladeriaId]);

    if (loading) return <p>Cargando...</p>;
    if (!heladeriaId) return <p>No se encontró la heladería asociada a este usuario.</p>;

    return (
        <div>
            <Header/>
            <div className="container-fluid">
                <div className="row">
                    <Sidebar/>
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        <h1>Inventario de Helados</h1>
                        <AddHelado
                            heladeriaId={heladeriaId}
                            onHeladoAdded={() => {
                                getHelados(heladeriaId).then(setHelados);
                            }}
                        />
                        <HeladoList helados={helados}/>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default HeladoInventory;
