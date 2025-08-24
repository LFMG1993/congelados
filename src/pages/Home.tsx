import {Link} from "react-router-dom";

export default function Home() {
    return (
        <div className="container-fluid bg-secondary vh-100">
            <nav className="container-fluid navbar navbar-expand-lg navbar-light bg-warning shadow-sm">
                <div className="container-fluid">
                    <h1 className="navbar-brand text-primary fw-bold">Congelados</h1>
                    <div>
                        <Link to="/login" className="btn btn-outline-primary me-2">Iniciar Sesión</Link>
                        <Link to="/register" className="btn btn-primary">Registrarse</Link>
                    </div>
                </div>
            </nav>

            <header className="text-center py-5 bg-primary text-white">
                <h2 className="display-4 fw-bold">Administra tu heladería con facilidad</h2>
                <p className="lead">Optimiza ventas, controla inventarios y haz crecer tu negocio.</p>
                <Link to="/register" className="btn btn-light btn-lg mt-3 fw-bold">Empieza Gratis</Link>
            </header>

            <section className="container-fluid text-center py-5">
                <h3 className="text-primary fw-bold">¿Por qué usar congelados?</h3>
                <div className="row mt-4">
                    <div className="col-md-4">
                        <div className="card shadow-sm p-3">
                            <h4 className="text-primary">Gestión de Ventas</h4>
                            <p>Realiza ventas rápidas y lleva control en tiempo real.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm p-3">
                            <h4 className="text-primary">Control de Inventario</h4>
                            <p>Monitorea stock y evita pérdidas de productos.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm p-3">
                            <h4 className="text-primary">Reportes y Análisis</h4>
                            <p>Toma decisiones con datos de ventas y clientes.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
