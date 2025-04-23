// export const BASE_URL = "http://94.158.52.127/"
// export const BASE_URL = "http://192.168.1.10:60000/"
// export const BASE_URL = "http://192.168.3.83:60003/"
// export const BASE_URL = "http://94.158.50.36/"

// export const BASE_URL = "http://192.166.230.47/"

export const BASE_URL = "http://localhost:60000/"

export const APP_SERIAL = "KSemSxAaEaqNOASFyNypNgu4BbbaBJIbzHoMztTAIexyhQZuSL"
// export const captchaSiteKey = "6LeOlAgqAAAAAKxAKcJIAXMGhP_hDNJG5VD9WWJq"

export const PERMISSIONS = {
    REPORTS: {
      EXPORT: 'permissions.reports.export'
    },
    DASHBOARD: {
        VIEW: 'permissions.dashboard.view'
    },
    USERS: {
        CREATE: 'permissions.users.create',
        CREATE_ADMIN: 'permissions.users.create-admin',
        VIEW: 'permissions.users.view',
        EDIT: 'permissions.users.edit',
        DELETE: 'permissions.users.delete',
        CHANGE_PASSWORD: 'permissions.users.change-password',
        SHOW_PASSWORD: 'permissions.users.show-password',
    },
    ROLES: {
        CREATE: 'permissions.roles.create',
        VIEW: 'permissions.roles.view',
        EDIT: 'permissions.roles.edit',
        DELETE: 'permissions.roles.delete',
    },
    DEPARTMENTS: {
        CREATE: 'permissions.department.create',
        VIEW: 'permissions.department.view',
        EDIT: 'permissions.department.edit',
        DELETE: 'permissions.department.delete',
    },
    POSITIONS: {
        CREATE: 'permissions.customer-position.create',
        VIEW: 'permissions.customer-position.view',
        EDIT: 'permissions.customer-position.edit',
        DELETE: 'permissions.customer-position.delete',
    },
    AGENTS: {
        CREATE: 'permissions.agent.create',
        VIEW: 'permissions.agent.view',
        EDIT: 'permissions.agent.edit',
        DELETE: 'permissions.agent.delete',
    },
    ORGANIZATIONS: {
        CREATE: 'permissions.organization.create',
        VIEW: 'permissions.organization.view',
        EDIT: 'permissions.organization.edit',
        DELETE: 'permissions.organization.delete',
    },
    EFS_ACCOUNTS: {
        CREATE: 'permissions.efs-account.create',
        VIEW: 'permissions.efs-account.view',
        EDIT: 'permissions.efs-account.edit',
        DELETE: 'permissions.efs-account.delete',
    },
    FUEL_TYPES: {
        CREATE: 'permissions.fuel-type.create',
        VIEW: 'permissions.fuel-type.view',
        EDIT: 'permissions.fuel-type.edit',
        DELETE: 'permissions.fuel-type.delete',
    },
    STATION_DISCOUNTS: {
        CREATE: 'permissions.station-discount.create',
        VIEW: 'permissions.station-discount.view',
        EDIT: 'permissions.station-discount.edit',
        DELETE: 'permissions.station-discount.delete',
    },
    COMPANY_DISCOUNTS:{
        CREATE: 'permissions.company-discount.create',
        VIEW: 'permissions.company-discount.view',
        EDIT: 'permissions.company-discount.edit',
        DELETE: 'permissions.company-discount.delete',
    },
    DAILY_UP_TO_DISCOUNTS:{
        CREATE: 'permissions.daily-up-to-discount.create',
        VIEW: 'permissions.daily-up-to-discount.view',
        EDIT: 'permissions.daily-up-to-discount.edit',
        DELETE: 'permissions.daily-up-to-discount.delete',
    },
    COMPANIES: {
        CREATE: 'permissions.company.create',
        VIEW: 'permissions.company.view',
        EDIT: 'permissions.company.edit',
        DELETE: 'permissions.company.delete',
        EXPORT: 'permissions.company.export'
    },
    COMPANY_ACCOUNTS: {
        CREATE: 'permissions.company-account.create',
        VIEW: 'permissions.company-account.view',
        EDIT: 'permissions.company-account.edit',
        DELETE: 'permissions.company-account.delete',
        EXPORT: 'permissions.company-account.export'
    },
    COMPANY_ACCOUNT_CARDS: {
        CREATE: 'permissions.company-account-card.create',
        VIEW: 'permissions.company-account-card.view',
        EDIT: 'permissions.company-account-card.edit',
        DELETE: 'permissions.company-account-card.delete',
    },
    BANK_ACCOUNTS: {
        CREATE: 'permissions.company-bank-account.create',
        VIEW: 'permissions.company-bank-account.view',
        EDIT: 'permissions.company-bank-account.edit',
        DELETE: 'permissions.company-bank-account.delete',
    },
    BANK_CARDS: {
        CREATE: 'permissions.company-bank-card.create',
        VIEW: 'permissions.company-bank-card.view',
        EDIT: 'permissions.company-bank-card.edit',
        DELETE: 'permissions.company-bank-card.delete',
    },
    EFS_CARDS: {
        VIEW: 'permissions.efs-cards.view',
    },
    STATION_CHAINS:{
        CREATE: 'permissions.station-chain.create',
        VIEW: 'permissions.station-chain.view',
        EDIT: 'permissions.station-chain.edit',
        DELETE: 'permissions.station-chain.delete',
    },
    STATIONS: {
        CREATE: 'permissions.station.create',
        VIEW: 'permissions.station.view',
        EDIT: 'permissions.station.edit',
        DELETE: 'permissions.station.delete',
        EXPORT: 'permissions.station.export',
    },
    EFS_TRANSACTIONS: {
        CREATE: 'permissions.efs-transaction.create',
        VIEW: 'permissions.efs-transaction.view',
        EDIT: 'permissions.efs-transaction.edit',
        DELETE: 'permissions.efs-transaction.delete',
        EXPORT: 'permissions.efs-transaction.export',
    },
    EFS_MONEY_CODES: {
        CREATE: 'permissions.efs-moneycode.create',
        VIEW: 'permissions.efs-moneycode.view',
        EDIT: 'permissions.efs-moneycode.edit',
        DELETE: 'permissions.efs-moneycode.delete',
        EXPORT: 'permissions.efs-moneycode.export',
    },

    INVOICE: {
        CREATE: "permissions.invoice.create",
        VIEW: "permissions.invoice.view",
        CANCEL: "permissions.invoice.cancel",
        EDIT: "permissions.invoice.edit",
        EXPORT: "permissions.invoice.export",
        SEND: "permissions.invoice.send",
    },
    INVOICE_PAYMENTS: {
        CREATE: "permissions.invoice-payment.create",
        VIEW: "permissions.invoice-payment.view",
        EDIT: "permissions.invoice-payment.edit",
        DELETE: "permissions.invoice-payment.delete",
    },
    IFTA_REPORT_GENERATE: 'permissions.ifta-report.generate',
    DRIVER_REPORT_GENERATE: 'permissions.invoice-driver-report.generate',
    MONEY_CODE_REPORT_GENERATE: 'permissions.money-code-report.generate',
    TRANSACTIONS_REPORT_GENERATE: 'permissions.transaction-report.generate',

    FORMSITE:{
        SYNC: 'permissions.formsite.sync',
        VIEW_LOGS: 'permissions.formsite.sync-logs-view',
    },

    EFS: {
        SYNC: 'permissions.efs.sync',
        VIEW_LOGS: 'permissions.efs.sync-logs-view',
    },

    MONEY_CODE_FEES: {
        CREATE: "permissions.money-code-fee-condition.create",
        VIEW: "permissions.money-code-fee-condition.view",
        EDIT: "permissions.money-code-fee-condition.edit",
        DELETE: "permissions.money-code-fee-condition.delete",
    },

    MAINTENANCES: {
        CREATE: "permissions.maintenances.create",
        VIEW: "permissions.maintenances.view",
        EDIT: "permissions.maintenances.edit",
        DELETE: "permissions.maintenances.delete",
        EXPORT: "permissions.maintenances.export",
    },

    MERCHANT_FEES: {
        CREATE: "permissions.merchant-fees.create",
        VIEW: "permissions.merchant-fees.view",
        EDIT: "permissions.merchant-fees.edit",
        DELETE: "permissions.merchant-fees.delete",
    },

    EMAIL_TEMPLATES: {
        CREATE: "permissions.email-templates.create",
        VIEW: "permissions.email-templates.view",
        EDIT: "permissions.email-templates.edit",
        DELETE: "permissions.email-templates.delete",
    },

    TASKS: {
        CREATE: "permissions.tasks.create",
        VIEW: "permissions.tasks.view",
        EDIT: "permissions.tasks.edit",
        DELETE: "permissions.tasks.delete",
    },

    STATION_CHAIN_COMPANY_DISCOUNTS: {
        CREATE: "permissions.station-chain-company-discounts.create",
        VIEW: "permissions.station-chain-company-discounts.view",
        EDIT: "permissions.station-chain-company-discounts.edit",
        DELETE: "permissions.station-chain-company-discounts.delete",
    },
}

export const billingCycleOptions = [
    { value: 'Once', label: 'Once' },
    { value: 'Twice', label: 'Twice' },
    { value: 'NewThuToWed', label: 'NewThuToWed' },
    { value: 'WedToTue', label: 'WedToTue' },
    { value: 'TueToMon', label: 'TueToMon' },
]

export const moneyCodeCompanyAttachmentTypeOptions = [
    { value: 'OneTime', label: 'OneTime' },
    { value: 'Always', label: 'Always' },
]

export const feesTypesOptions = [
    { value: 'NotCharged', label: 'Not Charged' },
    { value: 'Charged', label: 'Charged' },
]

export const billingTypeOptions = [
    { label: 'Merchant Card', value: 'MerchantCard' },
    { label: 'Merchant Bank', value: 'MerchantBank' },
    { label: 'Direct', value: 'Direct' },
    { label: 'Prepay', value: 'Prepay' },
]

export const pricingModelOptions = [
    { label: 'Up To', value: 'UpTo' },
    { label: 'Cost Plus', value: 'CostPlus' },
    { label: 'Fixed', value: 'Fixed' },
    { label: 'By Percentage', value: 'ByPercentage' },
]

export const taskPriorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
]

export const taskStatusOptions = [
    { value: 'Open', label: 'Open' },
    { value: 'InProgress', label: 'InProgress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Deferred', label: 'Deferred' },
    { value: 'Cancelled', label: 'Cancelled' },
]

export const taskFilterTypeOptions = [
    { label: 'Assigned To Me', value: 'AssignedToMe' },
    { label: 'Created By Me', value: 'CreatedByMe' },
    { label: 'Watched By Me', value: 'WatchedByMe' },
]

export const paymentStatusOptions = [
    { value: 2, label: 'Paid' },
    { value: 1, label: 'Pending' },
    { value: 8, label: 'Partially Paid' },
    // { value: 9, label: 'Debutors' },
    // { value: 4, label: 'Cancelled' },
]

export const discountTypeOptions = [
    { label: 'Fixed', value: 'Fixed' },
    { label: 'Conditional', value: 'Conditional' },
]

export const discountConditionTypeOptions = [
    { label: 'Add', value: 'Add' },
    { label: 'Subtract', value: 'Subtract' },
]

export const missingFilterOptions = [
    { label: 'Agents', value: 'ByAgent' },
    { label: 'Bank Accounts', value: 'ByBankAccount' },
    { label: 'Bank Cards', value: 'ByBankCard' },
    { label: 'Credit Score', value: 'ByCreditScore' },
]

export const cardStatusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'Hold', value: 'Hold' },
    { label: 'Deleted', value: 'Deleted' },
]

export const debtorTypeOptions = [
    { label: 'Bad Debtor', value: 'BadDebtor' },
    { label: 'Insurance', value: 'Insurance' },
    { label: 'Fraud', value: 'Fraud' },
]

export const feeTypeOptions = [
    { label: 'Fee', value: 'Fee' },
    { label: 'Conditional Fee', value: 'ConditionalFee' },
    { label: 'Both', value: 'Both' }
]

export const refundedTransactionStatusOptions = [
    { label: 'New', value: 'New' },
    { label: 'InProgress', value: 'InProgress' },
    { label: 'Resolved', value: 'Resolved' },
];


export const refundedTransactionInvoicePaymentStatusOptions = [
    { label: 'Not Invoiced', value: 'NotInvoiced' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Paid', value: 'Paid' },
    { label: 'Partially Paid', value: 'PartiallyPaid' },
];

export const suspiciousTransactionTypeOptions = [
    { label: 'Fraud', value: 'Fraud' },
    { label: 'Duplicate', value: 'Duplicate' },
    { label: 'System Error', value: 'SystemError' },
];

export const serviceTypeOptions = [
    { label: 'Fuel', value: 'Fuel' },
    { label: 'Money Code', value: 'MoneyCode' },
    { label: 'Maintenance', value: 'Maintenance' },
]

export const serviceTypeConditionOptions = [
    { label: 'Only', value: 'Only' },
    { label: 'One Of', value: 'OneOf' },
    { label: 'Exact Excluding', value: 'ExactExcluding' },
]
