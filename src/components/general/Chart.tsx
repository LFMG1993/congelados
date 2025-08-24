import {FC} from 'react';
import {Line} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartComponentProps {
    data: ChartData<'line'>;
    options?: ChartOptions<'line'>;
}

const ChartComponent: FC<ChartComponentProps> = ({ data, options }) => {
    // Este componente ahora es un "wrapper" flexible y seguro para cualquier gráfico de línea.
    return <Line data={data} options={options} />;
};

export default ChartComponent;