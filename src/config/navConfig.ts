import {FC} from "react";
import {
    Shop,
    Basket3,
    Cart3,
    Truck,
    Tags,
    BarChart,
    IconProps,
    PersonCheck,
    Boxes,
    CashCoin,
    Gear
} from 'react-bootstrap-icons';

export interface NavItemConfig {
    to: string;
    Icon: FC<IconProps>
    label: string;
    permissionId?: string;
}

export const navItemsConfig: NavItemConfig[] = [
    {to: "/dashboard", Icon: BarChart, label: "Dashboard", permissionId: 'shop_details_manage'},
    {to: "/pos", Icon: Cart3, label: "Punto de Venta", permissionId: 'pos_access'},
    {to: "/cash-session", Icon: CashCoin, label: "Caja", permissionId: 'cash_session_access'},
    {to: "/team-management", Icon: PersonCheck, label: "Usuarios y Roles", permissionId: 'team_view'},
    {to: "/ingredients-page", Icon: Basket3, label: "Ingredientes", permissionId: 'ingredients_view'},
    {to: "/products", Icon: Tags, label: "Productos", permissionId: 'products_view'},
    {to: "/purchases", Icon: Truck, label: "Compras", permissionId: 'purchases_view'},
    {to: "/suppliers", Icon: Boxes, label: "Proveedores", permissionId: 'suppliers_view'},
    {to: "/reports", Icon: BarChart, label: "Reportes", permissionId: 'reports_view_sales'},
    {to: "/settings", Icon: Gear, label: "Configuración", permissionId: 'shop_details_manage'},
    {to: "/ice-cream-shop", Icon: Shop, label: "Heladerías", permissionId: 'shop_details_manage'},
];