import { FC } from 'react';
import ChartComponent from '../components/general/Chart';
import { ChartData, ChartOptions } from 'chart.js';

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
        <div>
            <h2>Dashboard</h2>
            <p>Bienvenido al panel de control de tu heladería.</p>
            <ChartComponent data={salesData} options={chartOptions} />
        </div>
    );
};

export default Dashboard;