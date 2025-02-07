import {useState} from "react";
import {Link} from "react-router-dom";
import {registerUser} from "../services/authServices.js";

const Register = () => {
    const [formData, setFormData] = useState({
        iceCream: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        identify: "",
        phone: "",
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validación en el componente: verificar que las contraseñas coincidan
        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }
        try {
            // Llamada al servicio que se encarga de registrar el usuario en Firebase
            await registerUser(formData);
            console.log("Usuario registrado exitosamente");
            // Aquí podrías redirigir al usuario o limpiar el formulario
        } catch (error) {
            // Capturamos y mostramos el error que lance el servicio
            setError(error.message);
        }
    };

    return (<div className="container-fluid bg-primary vh-100 d-flex align-items-center justify-content-center">
            <div className="card shadow-lg w-75" style={{maxWidth: "900px"}}>
                <div className="row g-0">
                    <div className="col-lg-6 d-none d-lg-block">
                    </div>
                    <div className="col-lg-6">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <h1 className="h4 text-gray-900">Crea tu Cuenta</h1>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col-sm-12">
                                        <input
                                            type="text"
                                            name="iceCream"
                                            className="form-control form-control-user"
                                            placeholder="Nombre de tu heladeria"
                                            value={formData.iceCream}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-6">
                                        <input
                                            type="text"
                                            name="firstName"
                                            className="form-control form-control-user"
                                            placeholder="Nombres"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-sm-6">
                                        <input
                                            type="text"
                                            name="lastName"
                                            className="form-control form-control-user"
                                            placeholder="Apellidos"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="identify"
                                        className="form-control form-control-user"
                                        placeholder="Identificación o Nit"
                                        value={formData.identify}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control form-control-user"
                                        placeholder="Correo Electrónico"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-6">
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control form-control-user"
                                            placeholder="Contraseña"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-sm-6">
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            className="form-control form-control-user"
                                            placeholder="Repertir Contraseña"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="phone"
                                        className="form-control form-control-user"
                                        placeholder="Teléfono"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-user btn-block w-100">
                                    Registrar Heladería
                                </button>
                            </form>
                            <hr/>
                            <div className="text-center">
                                <Link className="small" to="/forgot-password">
                                    ¿Olvidó su Contraseña?
                                </Link>
                            </div>
                            <div className="text-center">
                                <Link className="small" to="/login">
                                    ¿Tienes una Cuenta? Inicia Sesión.
                                </Link>
                            </div>
                            {error && <p className="text-danger mt-3">{error}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
