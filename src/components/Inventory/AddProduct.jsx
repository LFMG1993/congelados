import React, {useState} from "react";
import {addProduct} from "../../services/inventoryServices";

const AddProduct = ({heladeriaId, onProductAdded}) => {
    const [product, setProduct] = useState({
        nombre: "",
        precioCosto: "",
        precioVenta: "",
        inventarioInicial: "",
        imagen: "",
        cantidadHelado: "",
        receta: "",
    });

    const handleChange = (e) => {
        setProduct({...product, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addProduct(heladeriaId, {
                ...product,
                precioCosto: parseFloat(product.precioCosto),
                precioVenta: parseFloat(product.precioVenta),
                inventarioInicial: parseInt(product.inventarioInicial, 10),
            });
            alert("Producto agregado exitosamente");
            // Limpia el formulario
            setProduct({
                nombre: "",
                precioCosto: "",
                precioVenta: "",
                inventarioInicial: "",
                imagen: "",
                cantidadHelado: "",
                receta: "",
            });
            // Notifica al contenedor para actualizar el listado
            if (onProductAdded) onProductAdded();
        } catch (error) {
            console.error("Error agregando producto:", error);
            alert("Error al agregar el producto");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nombre</label>
                <input type="text" name="nombre" value={product.nombre} onChange={handleChange} required/>
            </div>
            <div>
                <label>Precio Costo</label>
                <input type="number" name="precioCosto" value={product.precioCosto} onChange={handleChange} required/>
            </div>
            <div>
                <label>Precio Venta</label>
                <input type="number" name="precioVenta" value={product.precioVenta} onChange={handleChange} required/>
            </div>
            <div>
                <label>Inventario Inicial</label>
                <input type="number" name="inventarioInicial" value={product.inventarioInicial} onChange={handleChange} required/>
            </div>
            <div>
                <label>Imagen</label>
                <input type="text" name="imagen" value={product.imagen} onChange={handleChange}/>
            </div>
            <div>
                <label>Cantidad de Helado</label>
                <select name="cantidadHelado" value={product.cantidadHelado} onChange={handleChange}>
                    <option value="">Seleccione la cantidad de helado</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>
            <div>
                <label>Cantidad de Helado</label>
                <select name="receta" value={product.receta} onChange={handleChange}>
                    <option value="">Seleccione la receta</option>
                </select>
            </div>
            <button type="submit">Agregar Producto</button>
        </form>
    );
};

export default AddProduct;
