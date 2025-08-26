import {FC, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import {Timestamp} from "firebase/firestore";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import IngredientsPage from "./pages/IngredientsPage";
import {auth} from './firebase';
import {onAuthStateChanged} from 'firebase/auth';
import {useAuthStore} from './store/authStore';
import {getHeladeriasByUserId, getUserProfileData} from './services/userServices';
import ProtectedRoute from './components/ProtectedRoute';
import IceCreamShop from "./pages/IceCreamShop";
import FullScreenLoader from "./components/general/FullScreenLoader";
import MainLayout from "./components/MainLayout";
import ProfilePage from "./pages/Profile";
import ProductsPage from "./pages/ProductsPage";
import PurchasesPage from "./pages/PurchasesPage";
import TeamManagementPage from "./pages/TeamManagementPage.tsx";
import EmployeeClaim from "./pages/EmployeeClaim.tsx";

const App: FC = () => {
    const {loading, setLoading, setAuthUser, setUserIceCreamShop} = useAuthStore();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const [heladerias, profileData] = await Promise.all([
                        getHeladeriasByUserId(currentUser.uid),
                        getUserProfileData(currentUser.uid)
                    ]);

                    const fullUserProfile = {
                        ...currentUser,
                        ...profileData,
                        firstName: profileData?.firstName ?? '',
                        lastName: profileData?.lastName ?? '',
                        email: currentUser.email ?? '',
                        role: profileData?.role ?? 'employee',
                        identify: profileData?.identify ?? '',
                        phone: profileData?.phone ?? '',
                        photoURL: profileData?.photoURL ?? currentUser.photoURL,
                        createdAt: profileData?.createdAt ?? Timestamp.fromDate(new Date(currentUser.metadata.creationTime!)),
                        updatedAt: profileData?.updatedAt,
                        iceCreamShopIds: heladerias.map(h => h.id),
                    };

                    setAuthUser(fullUserProfile);
                    setUserIceCreamShop(heladerias);
                } catch (error) {
                    console.error("Error al cargar datos del usuario:", error);
                    setAuthUser(null);
                    setUserIceCreamShop([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setAuthUser(null);
                setUserIceCreamShop([]);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [setAuthUser, setUserIceCreamShop, setLoading]);

    if (loading) {
        return <FullScreenLoader/>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                \<Route path="/employee-claim" element={<EmployeeClaim/>}/>
                {/* Rutas protegidas */}
                <Route path="/dashboard"
                       element={<ProtectedRoute><MainLayout><Dashboard/></MainLayout></ProtectedRoute>}/>
                <Route path="/ingredients-page"
                       element={<ProtectedRoute><MainLayout><IngredientsPage/></MainLayout></ProtectedRoute>}/>
                <Route path="/ice-cream-shop"
                       element={<ProtectedRoute><MainLayout><IceCreamShop/></MainLayout></ProtectedRoute>}/>
                <Route path="/profile"
                       element={<ProtectedRoute><MainLayout><ProfilePage/></MainLayout></ProtectedRoute>}/>
                <Route path="/products"
                       element={<ProtectedRoute><MainLayout><ProductsPage/></MainLayout></ProtectedRoute>}/>
                <Route path="/purchases"
                       element={<ProtectedRoute><MainLayout><PurchasesPage/></MainLayout></ProtectedRoute>}/>
                <Route path="/team-management"
                       element={<ProtectedRoute><MainLayout><TeamManagementPage/></MainLayout></ProtectedRoute>}/>
            </Routes>
        </Router>
    );
}

export default App
