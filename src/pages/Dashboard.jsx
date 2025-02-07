import React, {useEffect} from 'react'
import Chart from 'chart.js/auto'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function MainContent() {
    useEffect(() => {
        const ctx = document.getElementById('myChart')
        let chartInstance = null
        if (ctx) {
            chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                    datasets: [
                        {
                            label: 'My First Dataset',
                            data: [65, 59, 80, 81, 56, 55],
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1,
                        },
                    ],
                },
            })
        }

        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        }
    }, [])

    return (
        <div>
            <Header/>
            <div className='container-fluid'>
                <div className='row'>
                    <Sidebar/>
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        <div
                            className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                            <h1 className="h2">Dashboard</h1>
                            <div className="btn-toolbar mb-2 mb-md-0">
                                <div className="btn-group me-2">
                                    <button type="button" className="btn btn-sm btn-outline-secondary">
                                        Share
                                    </button>
                                    <button type="button" className="btn btn-sm btn-outline-secondary">
                                        Export
                                    </button>
                                </div>
                                <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
                                    <span data-feather="calendar"></span>
                                    This week
                                </button>
                            </div>
                        </div>

                        <canvas className="my-4 w-100" id="myChart" width="900" height="380"></canvas>

                        <h2>Section title</h2>
                        <div className="table-responsive">
                            <table className="table table-striped table-sm">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Header</th>
                                    <th scope="col">Header</th>
                                    <th scope="col">Header</th>
                                    <th scope="col">Header</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>1,001</td>
                                    <td>random</td>
                                    <td>data</td>
                                    <td>placeholder</td>
                                    <td>text</td>
                                </tr>
                                <tr>
                                    <td>1,002</td>
                                    <td>placeholder</td>
                                    <td>irrelevant</td>
                                    <td>visual</td>
                                    <td>layout</td>
                                </tr>
                                <tr>
                                    <td>1,003</td>
                                    <td>data</td>
                                    <td>rich</td>
                                    <td>dashboard</td>
                                    <td>tabular</td>
                                </tr>
                                {/* ... otros registros ... */}
                                </tbody>
                            </table>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}