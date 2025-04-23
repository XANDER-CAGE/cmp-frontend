import React, { useContext, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'antd'
import { useDispatch } from 'react-redux'
import { userLogout } from '../../reducers/authSlice'
import { MdManageAccounts, MdSpaceDashboard, MdLogout, MdIntegrationInstructions } from "react-icons/md"
import { RiCustomerService2Fill, RiGasStationFill } from "react-icons/ri"
import { FaSackDollar } from "react-icons/fa6"
import { IoSettings } from "react-icons/io5"
import './sidebar.css'
import { ThemeContext } from '../../App'
import { useUserInfo } from '../../contexts/UserInfoContext';
import Authorize from '../../utils/Authorize';
import { PERMISSIONS } from '../../constants';

const Sidebar = (props) => {
    const { collapsed } = props
    const { theme } = useContext(ThemeContext)
    const { permissions } = useUserInfo()

    const dispatch = useDispatch()
    const location = useLocation()
    const pathname = location.pathname.split('/')[1]

    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        }
    }

    const items = useMemo(() => [
        Authorize(permissions, [PERMISSIONS.DASHBOARD.VIEW]) &&
        getItem(
            'Dashboard',
            'dashboard',
            <MdSpaceDashboard size={20} />,
            [
                getItem(
                    <Link to='/station-statistics'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Chain Statistics</div>
                    </Link>,
                    'station-statistics'
                ),
                getItem(
                    <Link to='/agent-performance'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Agent Performance</div>
                    </Link>,
                    'agent-performance'
                ),
                getItem(
                    <Link to='/state-average-indicators'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>State Indicators</div>
                    </Link>,
                    'state-average-indicators'
                ),
                getItem(
                    <Link to='/gross'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Payment Grosses</div>
                    </Link>,
                    'gross'
                ),
                getItem(
                    <Link to='/customers-information'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Customers Summary</div>
                    </Link>,
                    'customers-information'
                ),
            ]
        ),

        Authorize(permissions, [
          PERMISSIONS.USERS.VIEW,

          PERMISSIONS.ROLES.VIEW,

          PERMISSIONS.DEPARTMENTS.VIEW,

          PERMISSIONS.POSITIONS.VIEW,
        ], false) &&
        getItem(
            'User Management',
            'user_management',
            <MdManageAccounts size={20} />,
            [

                Authorize(permissions, [PERMISSIONS.USERS.VIEW]) &&
                getItem(
                  <Link to="/users">
                    <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Users</div>
                  </Link>,
                  'users',
                ),

                Authorize(permissions, [PERMISSIONS.ROLES.VIEW]) &&
                getItem(
                    <Link to='/roles'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Roles</div>
                    </Link>,
                    'roles'
                ),

                Authorize(permissions, [PERMISSIONS.DEPARTMENTS.VIEW]) &&
                getItem(
                    <Link to='/departments'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Departments</div>
                    </Link>,
                    'departments'
                ),

              Authorize(permissions, [PERMISSIONS.POSITIONS.VIEW]) &&
                getItem(
                    <Link to='/positions'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Positions</div>
                    </Link>,
                    'positions'
                ),
            ]
        ),

        Authorize(permissions, [
            PERMISSIONS.COMPANIES.VIEW,
            PERMISSIONS.COMPANY_ACCOUNTS.VIEW,
            PERMISSIONS.COMPANY_ACCOUNT_CARDS.VIEW,
            PERMISSIONS.BANK_ACCOUNTS.VIEW,
            PERMISSIONS.BANK_CARDS.VIEW,
            PERMISSIONS.EFS_CARDS.VIEW,
        ], false) &&
        getItem(
            'Customer Service',
            'customer_service',
            <RiCustomerService2Fill size={20} />,
            [
                Authorize(permissions, [PERMISSIONS.COMPANIES.VIEW]) &&
                getItem(
                    <Link to='/companies'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Companies</div>
                    </Link>,
                    'companies'
                ),

                Authorize(permissions, [PERMISSIONS.COMPANY_ACCOUNTS.VIEW]) &&
                getItem(
                    <Link to='/company-accounts'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Company Accounts</div>
                    </Link>,
                    'company-accounts'
                ),

                Authorize(permissions, [PERMISSIONS.COMPANY_ACCOUNT_CARDS.VIEW]) &&
                getItem(
                    <Link to='/company-account-cards'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Company Account Cards</div>
                    </Link>,
                    'company-account-cards'
                ),

                Authorize(permissions, [PERMISSIONS.BANK_ACCOUNTS.VIEW]) &&
                getItem(
                    <Link to='/bank-accounts'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Bank Accounts</div>
                    </Link>,
                    'bank-accounts'
                ),

                Authorize(permissions, [PERMISSIONS.BANK_CARDS.VIEW]) &&
                getItem(
                    <Link to='/bank-cards'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Bank Cards</div>
                    </Link>,
                    'bank-cards'
                ),

                Authorize(permissions, [PERMISSIONS.EFS_CARDS.VIEW]) &&
                getItem(
                    <Link to='/efs-cards'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>EFS Cards</div>
                    </Link>,
                    'efs-cards'
                ),
            ]
        ),

        Authorize(permissions, [
            PERMISSIONS.STATION_CHAINS.VIEW,
            PERMISSIONS.STATIONS.VIEW,
        ], false) &&
        getItem(
            'Station Management',
            'station_management',
            <RiGasStationFill size={20} />,
            [

                Authorize(permissions, [PERMISSIONS.STATION_CHAINS.VIEW]) &&
                getItem(
                    <Link to='/station-chains'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Station chains</div>
                    </Link>,
                    'station-chains'
                ),

                Authorize(permissions, [PERMISSIONS.STATIONS.VIEW]) &&
                getItem(
                    <Link to='/stations'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Stations</div>
                    </Link>,
                    'stations'
                ),
            ]
        ),

        Authorize(permissions, [
            PERMISSIONS.EFS_TRANSACTIONS.VIEW,

            PERMISSIONS.EFS_MONEY_CODES.VIEW,

            PERMISSIONS.STATION_DISCOUNTS.VIEW,
            PERMISSIONS.STATION_DISCOUNTS.CREATE,
            PERMISSIONS.STATION_DISCOUNTS.EDIT,
            PERMISSIONS.STATION_DISCOUNTS.DELETE,

            PERMISSIONS.DAILY_UP_TO_DISCOUNTS.VIEW,
            PERMISSIONS.DAILY_UP_TO_DISCOUNTS.CREATE,
            PERMISSIONS.DAILY_UP_TO_DISCOUNTS.EDIT,
            PERMISSIONS.DAILY_UP_TO_DISCOUNTS.DELETE,

            PERMISSIONS.COMPANY_DISCOUNTS.VIEW,
            PERMISSIONS.COMPANY_DISCOUNTS.CREATE,
            PERMISSIONS.COMPANY_DISCOUNTS.EDIT,
            PERMISSIONS.COMPANY_DISCOUNTS.DELETE,

            PERMISSIONS.STATION_CHAIN_COMPANY_DISCOUNTS.VIEW,
            PERMISSIONS.STATION_CHAIN_COMPANY_DISCOUNTS.CREATE,
            PERMISSIONS.STATION_CHAIN_COMPANY_DISCOUNTS.EDIT,
            PERMISSIONS.STATION_CHAIN_COMPANY_DISCOUNTS.DELETE,

            PERMISSIONS.INVOICE.VIEW,

            PERMISSIONS.INVOICE_PAYMENTS.VIEW,

            PERMISSIONS.MAINTENANCES.VIEW,

            PERMISSIONS.MONEY_CODE_FEES.VIEW,

            PERMISSIONS.EFS_MONEY_CODES.VIEW,
            PERMISSIONS.EFS_MONEY_CODES.CREATE

        ], false) &&
        getItem(
            'Accounting',
            'accounting',
            <FaSackDollar size={18} />,
            [
                Authorize(permissions, [PERMISSIONS.EFS_TRANSACTIONS.VIEW]) &&
                getItem(
                    <Link to='/efs-transactions'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>EFS Transactions</div>
                    </Link>,
                    'efs-transactions'
                ),

                Authorize(permissions, [PERMISSIONS.EFS_MONEY_CODES.VIEW]) &&
                getItem(
                    <Link to='/efs-money-codes'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>EFS Money Codes</div>
                    </Link>,
                    'efs-money-codes'
                ),

                Authorize(permissions, [
                  PERMISSIONS.STATION_DISCOUNTS.VIEW,
                  PERMISSIONS.STATION_DISCOUNTS.CREATE,
                  PERMISSIONS.STATION_DISCOUNTS.EDIT,
                  PERMISSIONS.STATION_DISCOUNTS.DELETE,

                  PERMISSIONS.DAILY_UP_TO_DISCOUNTS.VIEW,
                  PERMISSIONS.DAILY_UP_TO_DISCOUNTS.CREATE,
                  PERMISSIONS.DAILY_UP_TO_DISCOUNTS.EDIT,
                  PERMISSIONS.DAILY_UP_TO_DISCOUNTS.DELETE,

                  PERMISSIONS.COMPANY_DISCOUNTS.VIEW,
                  PERMISSIONS.COMPANY_DISCOUNTS.CREATE,
                  PERMISSIONS.COMPANY_DISCOUNTS.EDIT,
                  PERMISSIONS.COMPANY_DISCOUNTS.DELETE,

                  PERMISSIONS.STATION_CHAIN_COMPANY_DISCOUNTS.VIEW,
                  PERMISSIONS.STATION_CHAIN_COMPANY_DISCOUNTS.CREATE,
                  PERMISSIONS.STATION_CHAIN_COMPANY_DISCOUNTS.EDIT,
                  PERMISSIONS.STATION_CHAIN_COMPANY_DISCOUNTS.DELETE,
                ], false) &&
                getItem(
                    <Link to='/discount-management'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Discount Management</div>
                    </Link>,
                    'discount-management'
                ),

                Authorize(permissions, [
                  PERMISSIONS.STATION_DISCOUNTS.VIEW,
                  PERMISSIONS.STATION_CHAIN_COMPANY_DISCOUNTS.VIEW,
                  PERMISSIONS.DAILY_UP_TO_DISCOUNTS.VIEW,
                  PERMISSIONS.COMPANY_DISCOUNTS.VIEW],
                  false) &&
                getItem(
                    <Link to='/discount-management-view'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Discount Management View</div>
                    </Link>,
                    'discount-management-view'
                ),

                Authorize(permissions, [PERMISSIONS.INVOICE.VIEW]) &&
                getItem(
                    <Link to='/invoicing'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Invoicing</div>
                    </Link>,
                    'invoicing'
                ),

                Authorize(permissions, [
                  PERMISSIONS.INVOICE.VIEW,
                ], true) &&
                getItem(
                    <Link to='/invoice-groups'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Invoice Groups</div>
                    </Link>,
                    'invoice-groups'
                ),

                Authorize(permissions, [
                  PERMISSIONS.INVOICE_PAYMENTS.VIEW,
                ], false) &&
                getItem(
                    <Link to='/payment-list'><div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Payment List</div>
                    </Link>,
                    'payment-list'
                ),

                Authorize(permissions, [
                  PERMISSIONS.INVOICE.VIEW,
                ], false) &&
                getItem(
                    <Link to='/debtors'><div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Debtors</div>
                    </Link>,
                    'debtors'
                ),

                Authorize(permissions, [PERMISSIONS.MONEY_CODE_FEES.VIEW]) &&
                getItem(
                    <Link to='/money-code-fee'><div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Money Code Fee</div>
                    </Link>,
                    'money-code-fee'
                ),

                Authorize(permissions, [
                  PERMISSIONS.EFS_MONEY_CODES.VIEW,
                  PERMISSIONS.EFS_MONEY_CODES.CREATE,
                ], false) &&
                getItem(
                    <Link to='/money-code-remaining'><div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Money Code Remaining</div>
                    </Link>,
                    'money-code-remaining'
                ),

                Authorize(permissions, [PERMISSIONS.MAINTENANCES.VIEW,], false) &&
                getItem(
                    <Link to='/maintenances'><div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Maintenance Requests</div>
                    </Link>,
                    '/maintenances'
                ),
            ]
        ),

        Authorize(permissions, [
            PERMISSIONS.ORGANIZATIONS.VIEW,
            PERMISSIONS.EFS_ACCOUNTS.VIEW,
            PERMISSIONS.FUEL_TYPES.VIEW,
            PERMISSIONS.AGENTS.VIEW,
            PERMISSIONS.EMAIL_TEMPLATES.VIEW,
            PERMISSIONS.MERCHANT_FEES.VIEW
        ], false) &&
        getItem(
            'Settings',
            'settings',
            <IoSettings size={20} />,
            [
                Authorize(permissions, [PERMISSIONS.ORGANIZATIONS.VIEW]) &&
                getItem(
                    <Link to='/organizations'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Organizations</div>
                    </Link>,
                    'organizations'
                ),

                Authorize(permissions, [PERMISSIONS.EFS_ACCOUNTS.VIEW]) &&
                getItem(
                    <Link to='/efs-accounts'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>EFS Accounts</div>
                    </Link>,
                    'efs-accounts'
                ),

                Authorize(permissions, [PERMISSIONS.FUEL_TYPES.VIEW]) &&
                getItem(
                    <Link to='/fuel-types'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Fuel Types</div>
                    </Link>,
                    'fuel-types'
                ),

                Authorize(permissions, [PERMISSIONS.AGENTS.VIEW]) &&
                getItem(
                    <Link to='/agents'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Agents</div>
                    </Link>,
                    'agents'
                ),

                Authorize(permissions, [PERMISSIONS.EMAIL_TEMPLATES.VIEW]) &&
                getItem(
                    <Link to='/email-templates'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Email Templates</div>
                    </Link>,
                    'email-templates'
                ),
                Authorize(permissions, [PERMISSIONS.EMAIL_TEMPLATES.VIEW]) &&
                getItem(
                    <Link to='/email-history'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Email History</div>
                    </Link>,
                    'email-history'
                ),

                Authorize(permissions, [PERMISSIONS.MERCHANT_FEES.VIEW]) &&
                getItem(
                    <Link to='/merchant-fee'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Merchant Fee</div>
                    </Link>,
                    'merchant-fee'
                ),
            ]
        ),

        Authorize(permissions, [
            PERMISSIONS.EFS.VIEW_LOGS,
            PERMISSIONS.FORMSITE.VIEW_LOGS,
        ], false) &&
        getItem(
            'Integrations',
            'integrations',
            <MdIntegrationInstructions size={20} />,
            [

                Authorize(permissions, [PERMISSIONS.EFS.VIEW_LOGS]) &&
                getItem(
                    <Link to='/efs'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>EFS</div>
                    </Link>,
                    'efs'
                ),

                Authorize(permissions, [PERMISSIONS.FORMSITE.VIEW_LOGS]) &&
                getItem(
                    <Link to='/formsite'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>Formsite</div>
                    </Link>,
                    'formsite'
                ),
            ]
        ),
        getItem(
            <Link to="#" onClick={() => dispatch(userLogout())}>Log Out</Link>,
            'logout',
            <MdLogout size={20} />
        ),

        // eslint-disable-next-line
    ], [permissions]
    )

    return (
        <div className={collapsed ? 'sidebar-component collapsed' : 'sidebar-component'}>
            <Menu
                defaultSelectedKeys={[`${pathname}`]}
                mode="inline"
                inlineCollapsed={collapsed}
                items={items}
                theme={theme ? 'dark' : 'light'}
                style={{ padding: '10px', height: '100%', overflow: 'auto' }}
            />
        </div>
    )
}

export default Sidebar