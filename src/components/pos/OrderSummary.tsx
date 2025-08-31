import {FC} from "react";
import {SaleItem} from "../../types";
import {Trash, PlusCircle, DashCircle} from "react-bootstrap-icons";

interface OrderSummaryProps {
    orderItems: SaleItem[];
    onUpdateQuantity: (productId: string, newQuantity: number) => void;
    onFinalizeSale: () => void;
}

// Función de ayuda para formatear moneda
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP', maximumFractionDigits: 0}).format(value);
};

const OrderSummary: FC<OrderSummaryProps> = ({orderItems, onUpdateQuantity, onFinalizeSale}) => {
    const total = orderItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

    return (
        <div className="card shadow-sm">
            <div className="card-header">
                <h5 className="mb-0">Resumen del Pedido</h5>
            </div>
            <div className="card-body" style={{minHeight: '60vh'}}>
                {orderItems.length === 0 ? (
                    <p className="text-muted text-center mt-4">Selecciona productos para iniciar una venta.</p>
                ) : (
                    <ul className="list-group list-group-flush">
                        {orderItems.map(item => (
                            <li key={item.productId} className="list-group-item px-0">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h6 className="mb-0">{item.productName}</h6>
                                        <small className="text-muted">{formatCurrency(item.unitPrice)} c/u</small>
                                    </div>
                                    <div className="fw-bold">{formatCurrency(item.unitPrice * item.quantity)}</div>
                                </div>
                                <div className="d-flex align-items-center justify-content-end mt-1">
                                    <DashCircle className="text-danger me-2 action-icon" onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}/>
                                    <span className="fw-bold mx-2">{item.quantity}</span>
                                    <PlusCircle className="text-success me-2 action-icon" onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}/>
                                    <Trash className="text-danger action-icon" onClick={() => onUpdateQuantity(item.productId, 0)}/>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="card-footer">
                <div className="d-flex justify-content-between fs-5 fw-bold mb-3">
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
                </div>
                <div className="d-grid">
                    <button
                        className="btn btn-success btn-lg"
                        onClick={onFinalizeSale}
                        disabled={orderItems.length === 0}
                    >
                        Registrar Venta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;