import React from "react";

const HeladoList = ({ helados }) => {
    return (
        <div>
            <h2>Lista de Helados</h2>
            {helados.length > 0 ? (
                helados.map((helado) => (
                    <div key={helado.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
                        <h3>{helado.nombre}</h3>
                        <p>Litros disponibles: {helado.litros}</p>
                        <p>Porciones disponibles: {helado.porciones}</p>
                    </div>
                ))
            ) : (
                <p>No hay helados registrados.</p>
            )}
        </div>
    );
};

export default HeladoList;
