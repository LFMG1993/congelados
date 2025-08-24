import {useState, useEffect, FC, FormEvent, ChangeEvent} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {auth} from '../firebase.ts';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {useAuthStore} from '../store/authStore.ts';

const Login: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    // Si el usuario se autentica con éxito, lo redirige.
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);
    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            const error = err as { code?: string };
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                setError('El correo electrónico o la contraseña son incorrectos.');
            } else {
                setError('Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.');
            }
            console.error("Error en el login:", err);
        } finally {
            setLoading(false); // Finaliza la carga, tanto en éxito como en error
        }
    };

    return (
        <div className="container">
            <h2>Iniciar Sesión</h2>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
            </form>
            <p className="mt-3">
                ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
            </p>
        </div>
    );
}

export default Login;