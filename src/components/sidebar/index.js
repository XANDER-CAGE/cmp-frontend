import React, { useContext, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { useDispatch } from 'react-redux';
import { userLogout } from '../../reducers/authSlice';
import { MdManageAccounts, MdSpaceDashboard, MdLogout, MdIntegrationInstructions, MdKeyboardArrowDown } from "react-icons/md";
import { RiCustomerService2Fill, RiGasStationFill } from "react-icons/ri";
import { FaSackDollar } from "react-icons/fa6";
import { FiUser } from "react-icons/fi";
import { IoSettings } from "react-icons/io5";
import './sidebar.css';
import { ThemeContext } from '../../App';
import { useUserInfo } from '../../contexts/UserInfoContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../translations';
import { t } from '../../utils/transliteration';
import Authorize from '../../utils/Authorize';
import { PERMISSIONS } from '../../constants';

const Sidebar = (props) => {
    const { collapsed, setCollapsed } = props;
    const { theme } = useContext(ThemeContext);
    const { permissions, userInfo } = useUserInfo();
    const { language } = useLanguage();
    const dispatch = useDispatch();
    const location = useLocation();
    const pathname = location.pathname.split('/')[1];
    
    // State to track expanded menu items
    const [expandedMenus, setExpandedMenus] = useState({
        dashboard: false,
        user_management: false,
        customer_service: false,
        station_management: false,
        accounting: false,
        settings: false,
        integrations: false
    });
    
    // Toggle expanded state for a menu
    const toggleMenu = (menuKey) => {
        if (!collapsed) {
            setExpandedMenus({
                ...expandedMenus,
                [menuKey]: !expandedMenus[menuKey]
            });
        }
    };

    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }

    const items = useMemo(() => [
        Authorize(permissions, [PERMISSIONS.DASHBOARD.VIEW]) &&
        getItem(
            t(translations, 'dashboard', language),
            'dashboard',
            <MdSpaceDashboard size={20} />,
            [
                getItem(
                    <Link to='/station-statistics'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'stationStatistics', language)}
                        </div>
                    </Link>,
                    'station-statistics'
                ),
                getItem(
                    <Link to='/agent-performance'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'agentPerformance', language)}
                        </div>
                    </Link>,
                    'agent-performance'
                ),
                getItem(
                    <Link to='/state-average-indicators'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'stateIndicators', language)}
                        </div>
                    </Link>,
                    'state-average-indicators'
                ),
                getItem(
                    <Link to='/gross'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'paymentGrosses', language)}
                        </div>
                    </Link>,
                    'gross'
                ),
                getItem(
                    <Link to='/customers-information'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'customersSummary', language)}
                        </div>
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
            t(translations, 'userManagement', language),
            'user_management',
            <MdManageAccounts size={20} />,
            [
                Authorize(permissions, [PERMISSIONS.USERS.VIEW]) &&
                getItem(
                  <Link to="/users">
                    <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                        {t(translations, 'users', language)}
                    </div>
                  </Link>,
                  'users',
                ),
                Authorize(permissions, [PERMISSIONS.ROLES.VIEW]) &&
                getItem(
                    <Link to='/roles'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'roles', language)}
                        </div>
                    </Link>,
                    'roles'
                ),
                Authorize(permissions, [PERMISSIONS.DEPARTMENTS.VIEW]) &&
                getItem(
                    <Link to='/departments'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'departments', language)}
                        </div>
                    </Link>,
                    'departments'
                ),
                Authorize(permissions, [PERMISSIONS.POSITIONS.VIEW]) &&
                getItem(
                    <Link to='/positions'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'positions', language)}
                        </div>
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
            t(translations, 'customerService', language),
            'customer_service',
            <RiCustomerService2Fill size={20} />,
            [
                Authorize(permissions, [PERMISSIONS.COMPANIES.VIEW]) &&
                getItem(
                    <Link to='/companies'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'companies', language)}
                        </div>
                    </Link>,
                    'companies'
                ),
                Authorize(permissions, [PERMISSIONS.COMPANY_ACCOUNTS.VIEW]) &&
                getItem(
                    <Link to='/company-accounts'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'companyAccounts', language)}
                        </div>
                    </Link>,
                    'company-accounts'
                ),
                Authorize(permissions, [PERMISSIONS.COMPANY_ACCOUNT_CARDS.VIEW]) &&
                getItem(
                    <Link to='/company-account-cards'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'companyAccountCards', language)}
                        </div>
                    </Link>,
                    'company-account-cards'
                ),
                Authorize(permissions, [PERMISSIONS.BANK_ACCOUNTS.VIEW]) &&
                getItem(
                    <Link to='/bank-accounts'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'bankAccounts', language)}
                        </div>
                    </Link>,
                    'bank-accounts'
                ),
                Authorize(permissions, [PERMISSIONS.BANK_CARDS.VIEW]) &&
                getItem(
                    <Link to='/bank-cards'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'bankCards', language)}
                        </div>
                    </Link>,
                    'bank-cards'
                ),
                Authorize(permissions, [PERMISSIONS.EFS_CARDS.VIEW]) &&
                getItem(
                    <Link to='/efs-cards'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'efsCards', language)}
                        </div>
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
            t(translations, 'stationManagement', language),
            'station_management',
            <RiGasStationFill size={20} />,
            [
                Authorize(permissions, [PERMISSIONS.STATION_CHAINS.VIEW]) &&
                getItem(
                    <Link to='/station-chains'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'stationChains', language)}
                        </div>
                    </Link>,
                    'station-chains'
                ),
                Authorize(permissions, [PERMISSIONS.STATIONS.VIEW]) &&
                getItem(
                    <Link to='/stations'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'stations', language)}
                        </div>
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
            t(translations, 'accounting', language),
            'accounting',
            <FaSackDollar size={18} />,
            [
                Authorize(permissions, [PERMISSIONS.EFS_TRANSACTIONS.VIEW]) &&
                getItem(
                    <Link to='/efs-transactions'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'efsTransactions', language)}
                        </div>
                    </Link>,
                    'efs-transactions'
                ),
                Authorize(permissions, [PERMISSIONS.EFS_MONEY_CODES.VIEW]) &&
                getItem(
                    <Link to='/efs-money-codes'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'efsMoneyCode', language)}
                        </div>
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
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'discountManagement', language)}
                        </div>
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
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'discountManagementView', language)}
                        </div>
                    </Link>,
                    'discount-management-view'
                ),
                Authorize(permissions, [PERMISSIONS.INVOICE.VIEW]) &&
                getItem(
                    <Link to='/invoicing'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'invoicing', language)}
                        </div>
                    </Link>,
                    'invoicing'
                ),
                Authorize(permissions, [
                  PERMISSIONS.INVOICE.VIEW,
                ], true) &&
                getItem(
                    <Link to='/invoice-groups'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'invoiceGroups', language)}
                        </div>
                    </Link>,
                    'invoice-groups'
                ),
                Authorize(permissions, [
                  PERMISSIONS.INVOICE_PAYMENTS.VIEW,
                ], false) &&
                getItem(
                    <Link to='/payment-list'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'paymentList', language)}
                        </div>
                    </Link>,
                    'payment-list'
                ),
                Authorize(permissions, [
                  PERMISSIONS.INVOICE.VIEW,
                ], false) &&
                getItem(
                    <Link to='/debtors'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'debtors', language)}
                        </div>
                    </Link>,
                    'debtors'
                ),
                Authorize(permissions, [PERMISSIONS.MONEY_CODE_FEES.VIEW]) &&
                getItem(
                    <Link to='/money-code-fee'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'moneyCodeFee', language)}
                        </div>
                    </Link>,
                    'money-code-fee'
                ),
                Authorize(permissions, [
                  PERMISSIONS.EFS_MONEY_CODES.VIEW,
                  PERMISSIONS.EFS_MONEY_CODES.CREATE,
                ], false) &&
                getItem(
                    <Link to='/money-code-remaining'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'moneyCodeRemaining', language)}
                        </div>
                    </Link>,
                    'money-code-remaining'
                ),
                Authorize(permissions, [PERMISSIONS.MAINTENANCES.VIEW,], false) &&
                getItem(
                    <Link to='/maintenances'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'maintenanceRequests', language)}
                        </div>
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
            t(translations, 'settings', language),
            'settings',
            <IoSettings size={20} />,
            [
                Authorize(permissions, [PERMISSIONS.ORGANIZATIONS.VIEW]) &&
                getItem(
                    <Link to='/organizations'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'organizations', language)}
                        </div>
                    </Link>,
                    'organizations'
                ),
                Authorize(permissions, [PERMISSIONS.EFS_ACCOUNTS.VIEW]) &&
                getItem(
                    <Link to='/efs-accounts'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'efsAccounts', language)}
                        </div>
                    </Link>,
                    'efs-accounts'
                ),
                Authorize(permissions, [PERMISSIONS.FUEL_TYPES.VIEW]) &&
                getItem(
                    <Link to='/fuel-types'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'fuelTypes', language)}
                        </div>
                    </Link>,
                    'fuel-types'
                ),
                Authorize(permissions, [PERMISSIONS.AGENTS.VIEW]) &&
                getItem(
                    <Link to='/agents'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'agents', language)}
                        </div>
                    </Link>,
                    'agents'
                ),
                Authorize(permissions, [PERMISSIONS.EMAIL_TEMPLATES.VIEW]) &&
                getItem(
                    <Link to='/email-templates'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'emailTemplates', language)}
                        </div>
                    </Link>,
                    'email-templates'
                ),
                Authorize(permissions, [PERMISSIONS.EMAIL_TEMPLATES.VIEW]) &&
                getItem(
                    <Link to='/email-history'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'emailHistory', language)}
                        </div>
                    </Link>,
                    'email-history'
                ),
                Authorize(permissions, [PERMISSIONS.MERCHANT_FEES.VIEW]) &&
                getItem(
                    <Link to='/merchant-fee'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'merchantFee', language)}
                        </div>
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
            t(translations, 'integrations', language),
            'integrations',
            <MdIntegrationInstructions size={20} />,
            [
                Authorize(permissions, [PERMISSIONS.EFS.VIEW_LOGS]) &&
                getItem(
                    <Link to='/efs'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'efs', language)}
                        </div>
                    </Link>,
                    'efs'
                ),
                Authorize(permissions, [PERMISSIONS.FORMSITE.VIEW_LOGS]) &&
                getItem(
                    <Link to='/formsite'>
                        <div className={theme && !collapsed ? 'text-[#fff]' : 'text-[#000]'}>
                            {t(translations, 'formsite', language)}
                        </div>
                    </Link>,
                    'formsite'
                ),
            ]
        ),
        getItem(
            <Link to="#" onClick={() => dispatch(userLogout())}>{t(translations, 'logOut', language)}</Link>,
            'logout',
            <MdLogout size={20} />
        ),
    ], [permissions, theme, collapsed, dispatch, language]);

    return (
        <div className={`sidebar-component ${collapsed ? 'collapsed' : ''} ${theme ? 'dark' : 'light'}`}>
            {/* User profile section */}
            {!collapsed && (
                <div className="sidebar-profile">
                    <div className="sidebar-avatar">
                        {userInfo?.avatar ? (
                            <img src={userInfo.avatar} alt={userInfo?.name} />
                        ) : (
                            <FiUser size={24} />
                        )}
                        <div className="status"></div>
                    </div>
                    <div className="sidebar-user-info">
                        <h3 className="sidebar-username">{userInfo?.name} {userInfo?.surname}</h3>
                        <p className="sidebar-role">{userInfo?.username}</p>
                    </div>
                </div>
            )}
            
            {/* Menu items */}
            <Menu
                defaultSelectedKeys={[`${pathname}`]}
                mode="inline"
                inlineCollapsed={collapsed}
                items={items}
                theme={theme ? 'dark' : 'light'}
                style={{ 
                    padding: '10px', 
                    height: collapsed || !userInfo ? '100%' : 'calc(100% - 80px)', 
                    overflow: 'auto',
                    border: 'none'
                }}
            />
        </div>
    );
};

export default Sidebar;