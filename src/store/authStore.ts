import {create} from 'zustand';
import {AuthStoreState} from "../types";

export const useAuthStore = create<AuthStoreState>((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,
    activeIceCreamShopId: null,
    iceCreamShops: [],
    setAuthUser: (user) => set({user, isAuthenticated: !!user}),
    setUserIceCreamShop: (nuevasHeladerias) => set(state => ({
        iceCreamShops: nuevasHeladerias,
        activeIceCreamShopId: state.activeIceCreamShopId || (nuevasHeladerias.length > 0 ? nuevasHeladerias[0].id : null),
    })),
    setActiveIceCreamShopId: (heladeriaId: string | null) => set({activeIceCreamShopId: heladeriaId}),
    setLoading: (isLoading) => set({loading: isLoading}),

    // Metodo Logout
    logout: () => set({
        user: null,
        isAuthenticated: false,
        iceCreamShops: [],
        activeIceCreamShopId: null,
    }),
}));