import {
  LuLayoutDashboard,
  LuCoins,
  LuFileText,
  LuReceipt,
  LuWallet,
  LuChartBar,
  LuUsers,
  LuTag,
} from 'react-icons/lu'

export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LuLayoutDashboard,
    roles: ['admin', 'do', 'validator', 'pastor', 'auditor', 'member'],
  },
  {
    label: 'Tithes',
    path: '/tithes',
    icon: LuCoins,
    roles: ['admin', 'do', 'validator', 'pastor', 'auditor', 'member'],
  },
  {
    label: 'Request Form',
    path: '/request-form',
    icon: LuFileText,
    roles: ['admin', 'do', 'validator', 'pastor', 'auditor', 'member'],
  },
  {
    label: 'Voucher',
    path: '/voucher',
    icon: LuReceipt,
    roles: ['admin', 'do', 'validator', 'auditor'],
  },
  {
    label: 'Expense',
    path: '/expense',
    icon: LuWallet,
    roles: ['admin', 'auditor'],
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: LuChartBar,
    roles: ['admin', 'do', 'validator', 'pastor', 'auditor', 'member'],
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: LuUsers,
    roles: ['admin'],
  },
  {
    label: 'Categories',
    path: '/admin/categories',
    icon: LuTag,
    roles: ['admin'],
  },
]

export const getNavItemsForRole = (role) =>
  NAV_ITEMS.filter((item) => item.roles.includes(role))

export const canAccessRoute = (role, path) => {
  const item = NAV_ITEMS.find((i) => i.path === path)
  return item ? item.roles.includes(role) : false
}
