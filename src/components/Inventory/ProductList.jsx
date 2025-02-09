import React from "react";

const ProductList = ({products}) => {
    return (
        <div>
            <h2>Lista de Productos</h2>
            {products.length > 0 ? (
                products.map((prod) => (
                    <div key={prod.id}>
                        <h3>Nombre: {prod.nombre}</h3>
                        <p>Precio Costo: {prod.precioCosto}</p>
                        <p>Precio Venta: {prod.precioVenta}</p>
                        <p>inventario Inicial: {prod.inventarioInicial}</p>
                        <p>Cantidad de Helado: {prod.cantidadHelado}</p>
                        <p>Receta: {prod.receta}</p>
                        {prod.imagen && <img src={prod.imagen} alt={prod.nombre} style={{maxWidth: "100px"}}/>}
                    </div>
                ))
            ) : (
                <p>No hay productos registrados.</p>
            )}
        </div>
    );
};

export default ProductList;
