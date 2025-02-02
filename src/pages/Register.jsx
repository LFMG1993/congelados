import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            console.log("User registered successfully");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="container-fluid bg-primary min-vh-100 d-flex align-items-center justify-content-center">
            <div className="card o-hidden border-0 shadow-lg w-50">
                <div className="card-body p-0">
                    <div className="row">
                        <div className="col-lg-5 d-none d-lg-block bg-light"></div>
                        <div className="col-lg-7">
                            <div className="p-5">
                                <div className="text-center">
                                    <h1 className="h4 text-gray-900 mb-4">Crea tu Cuenta!</h1>
                                </div>
                                <form className="user" onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-sm-6 mb-3">
                                            <input type="text" name="firstName" className="form-control form-control-user" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                                        </div>
                                        <div className="col-sm-6">
                                            <input type="text" name="lastName" className="form-control form-control-user" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="form-group mt-3">
                                        <input type="email" name="email" className="form-control form-control-user" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-sm-6 mb-3">
                                            <input type="password" name="password" className="form-control form-control-user" placeholder="Password" value={formData.password} onChange={handleChange} required />
                                        </div>
                                        <div className="col-sm-6">
                                            <input type="password" name="confirmPassword" className="form-control form-control-user" placeholder="Repeat Password" value={formData.confirmPassword} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-user btn-block mt-3">
                                        Register Account
                                    </button>
                                </form>
                                <hr />
                                <div className="text-center">
                                    <Link className="small" to="/forgot-password">Forgot Password?</Link>
                                </div>
                                <div className="text-center">
                                    <Link className="small" to="/login">Already have an account? Login!</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
