import {FC} from 'react';
import ChartComponent from '../components/general/Chart';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartData,
    ChartOptions
} from 'chart.js';
import Breadcrumbs from "../components/general/Breadcrumbs";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard: FC = () => {
    // Datos de ejemplo para el gráfico de ventas
    const salesData: ChartData<'line'> = {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [
            {
                label: 'Ventas de la Semana',
                data: [120, 190, 300, 500, 230, 340, 410],
                fill: true,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.3
            },
        ],
    };

    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Rendimiento de Ventas Semanal',
            },
        },
    };

    return (
        <main className="px-md-4">
            <Breadcrumbs/>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                <h1 className="h2">Dashboard</h1>
            </div>
            <div className="mt-4">
                <p className="lead">Bienvenido al panel de control de tu heladería.</p>
                <ChartComponent data={salesData} options={chartOptions}/>
            </div>
        </main>
    );
};

export default Dashboard;