import React, { useState } from "react";
import { addHelado } from "../../services/heladoService";

const AddHelado = ({ heladeriaId, onHeladoAdded }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        litros: "",
        porciones: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addHelado(heladeriaId, {
                nombre: formData.nombre,
                litros: parseFloat(formData.litros),
                porciones: parseInt(formData.porciones, 10)
            });
            setFormData({ nombre: "", litros: "", porciones: "" });
            alert("Helado agregado exitosamente");
            if (onHeladoAdded) onHeladoAdded();
        } catch (error) {
            console.error("Error al agregar el helado:", error);
            alert("Error al agregar el helado");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nombre del helado</label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Litros</label>
                <input
                    type="number"
                    step="0.1"
                    name="litros"
                    value={formData.litros}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Porciones</label>
                <input
                    type="number"
                    name="porciones"
                    value={formData.porciones}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Agregar Helado</button>
        </form>
    );
};

export default AddHelado;
