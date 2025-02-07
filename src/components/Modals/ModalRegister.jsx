const ModalSuccess = ({ show, onClose }) => {
    return (
        <div className={`modal fade ${show ? "show d-block" : "d-none"}`} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Registro Exitoso</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>Usuario registrado exitosamente.</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary" onClick={onClose}>Aceptar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalSuccess;