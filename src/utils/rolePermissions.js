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

export const ROLES = {
  ADMIN: 'admin',
  DO: 'do',
  VALIDATOR: 'validator',
  PASTOR: 'pastor',
  AUDITOR: 'auditor',
  MEMBER: 'member',
}

export const ROLE_LABELS = {
  admin: 'Admin',
  do: 'DO',
  validator: 'Validator',
  pastor: 'Pastor',
  auditor: 'Auditor',
  member: 'Member',
}

// Mock users for the dev role-picker on Login.
// When real auth lands, swap Login to POST /api/auth/login and pass the
// real user+token to login() — no other changes needed.
export const MOCK_USERS = [
  { _id: 'u-admin',     name: 'Adrian Anicete', email: 'adrian@joscm.com',  role: 'admin' },
  { _id: 'u-do',        name: 'Jaymar',         email: 'jaymar@joscm.com',  role: 'do' },
  { _id: 'u-validator', name: 'Dani',           email: 'dani@joscm.com',    role: 'validator' },
  { _id: 'u-pastor',    name: 'Bernie',         email: 'bernie@joscm.com',  role: 'pastor' },
  { _id: 'u-auditor',   name: 'Roselyn',        email: 'roselyn@joscm.com', role: 'auditor' },
  { _id: 'u-member',    name: 'Berna',          email: 'berna@joscm.com',   role: 'member' },
]

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

// Action-level permission matrix. Mirrors the backend ACL in CLAUDE.md §API Endpoints.
export const can = {
  // Tithes
  submitTithes: (role) => !!role,
  approveTithes: (role, submitterName, userName) =>
    !!role && submitterName !== userName,
  rejectTithes: (role) => !!role,

  // Request Form
  createRf: (role) => !!role,
  validateRf: (role) => ['validator', 'auditor', 'admin'].includes(role),
  approveRf: (role) => ['pastor', 'auditor', 'admin'].includes(role),
  rejectRf: (role) => ['validator', 'pastor', 'auditor', 'admin'].includes(role),
  createVoucherFromRf: (role) => ['validator', 'admin'].includes(role),
  // Admin/DO mark a `voucher_created` RF as `disbursed`. The requester
  // (any role — owner check happens in the UI) then confirms `received`.
  disburseRf: (role) => ['admin', 'do'].includes(role),
  markRfReceived: (role) => !!role,

  // Voucher
  createVoucher: (role) => ['validator', 'admin'].includes(role),
  viewVoucher: (role) => ['admin', 'do', 'validator', 'auditor'].includes(role),

  // Expense
  viewExpense: (role) => ['admin', 'auditor'].includes(role),
  recordManualExpense: (role) => role === 'admin',

  // Reports
  viewExpenseReport: (role) => role !== 'member',
  exportExpense: (role) => ['admin', 'auditor'].includes(role),

  // Admin
  manageUsers: (role) => role === 'admin',
  manageCategories: (role) => role === 'admin',
}
