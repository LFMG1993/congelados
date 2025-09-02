import {FC} from "react";
import {Sale} from "../../types";

interface ReportSalesTableProps {
    sales: Sale[];
    onViewDetails: (sale: Sale) => void;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
}).format(value);

const ReportSalesTable: FC<ReportSalesTableProps> = ({sales, onViewDetails}) => {
    return (
        <div className="card">
            <div className="card-header">
                <h5 className="mb-0">Listado de Ventas</h5>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>Fecha y Hora</th>
                            <th>Empleado</th>
                            <th>Total Venta</th>
                            <th>Métodos de Pago</th>
                            <th>Acción</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sales.map(sale => (
                            <tr key={sale.id}>
                                <td>{sale.createdAt.toDate().toLocaleString('es-CO')}</td>
                                <td>{sale.employeeName}</td>
                                <td>{formatCurrency(sale.total)}</td>
                                <td>{sale.payments?.map(p => p.methodName).join(', ') ?? 'No especificado'}</td>
                                <td>
                                    <button className="btn btn-sm btn-outline-primary"
                                            onClick={() => onViewDetails(sale)}>
                                        Ver Detalles
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportSalesTable;