import React from 'react'
import './admin-layout.css'
import Header from '../header'
import Sidebar from '../sidebar'
import { Navigate, Route, Routes } from 'react-router-dom';
import { useLocalStorageState } from 'ahooks'
import MyProfile from '../../pages/my-profile';
import Authorize from '../../utils/Authorize';
import { useUserInfo } from '../../contexts/UserInfoContext';
import StationStatisticsDashboard from '../../pages/station-statistics-dashboard';
import StateAverageIndicatorsDashboard from '../../pages/state-average-indicators-dashboard';
import GrossDashboard from '../../pages/gross-dashboard';
import CustomersInformationDashboard from '../../pages/customers-information-dashboard';
import AgentPerformanceDashboard from '../../pages/agent-performance-dashboard';
import Users from '../../pages/users';
import Roles from '../../pages/roles';
import { PERMISSIONS } from '../../constants';
import Forbidden from '../../pages/forbidden';
import NotFound from '../../pages/not-found';
import Departments from '../../pages/departments';
import Positions from '../../pages/positions';
import Companies from '../../pages/companies';
import Company from '../../pages/company';
import CompanyAccounts from '../../pages/company-accounts';
import CompanyAccountCards from '../../pages/company-account-cards';
import BankAccounts from '../../pages/bank-accounts';
import BankCards from '../../pages/bank-cards';
import EfsCards from '../../pages/efs-cards';
import StationChains from '../../pages/station-chains';
import Stations from '../../pages/stations';
import EfsUploadList from '../../pages/efs-upload-list';
import EfsMoneyCodes from '../../pages/efs-money-codes';
import DiscountManagement from '../../pages/discount-management';
import DiscountManagementView from '../../pages/discount-management-view';
import Invoicing from '../../pages/invoicing';
import InvoiceGroups from '../../pages/invoice-groups';
import PaymentList from '../../pages/payment-list';
import Debtors from '../../pages/debtors';
import MoneyCodeFee from '../../pages/money-code-fee';
import MoneyCodeRemaining from '../../pages/money-code-remaining';
import MaintenanceRequests from '../../pages/maintenance-requests';
import Organizations from '../../pages/organizations';
import EfsAccounts from '../../pages/efs-accounts';
import FuelTypes from '../../pages/fuel-types';
import Agents from '../../pages/agents';
import EmailTemplates from '../../pages/email-templates';
import EmailHistory from '../../pages/email-history';
import MerchantFee from '../../pages/merchant-fee';
import EFS from '../../pages/efs';
import Formsite from '../../pages/formsite';
import Tasks from '../../pages/tasks';
import Notifications from '../../pages/notifications';
import NotificationsSettings from '../../pages/notifications-settings';

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useLocalStorageState('is-collapsed-menu', false)
    const {permissions} = useUserInfo()

    return (
        <div className='admin-layout'>
            <Header
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />
            <Sidebar
                collapsed={collapsed}
            />
            <div className={collapsed ? 'pages-wrap opened' : 'pages-wrap'}>
                <Routes>

                  {/* PROFILE SETTINGS*/}
                  <Route path='/my-profile' element={<MyProfile />} />

                  {/* DASHBOARD */}
                  {
                    Authorize(permissions, [PERMISSIONS.DASHBOARD.VIEW]) && (
                      <Route>
                        <Route path='/station-statistics' element={<StationStatisticsDashboard />} />
                        <Route path='/agent-performance' element={<AgentPerformanceDashboard />} />
                        <Route path='/state-average-indicators' element={<StateAverageIndicatorsDashboard />} />
                        <Route path='/gross' element={<GrossDashboard />} />
                        <Route path='/customers-information' element={<CustomersInformationDashboard />} />
                      </Route>
                    )
                  }

                  {/* USER MANAGEMENT */}
                  {
                    Authorize(permissions, [
                      PERMISSIONS.USERS.CREATE,
                      PERMISSIONS.USERS.CREATE_ADMIN,
                      PERMISSIONS.USERS.VIEW,
                      PERMISSIONS.USERS.EDIT,
                      PERMISSIONS.USERS.DELETE,
                      PERMISSIONS.USERS.SHOW_PASSWORD,
                      PERMISSIONS.USERS.CHANGE_PASSWORD,
                    ], false) &&
                    <Route path="/users" element={<Users />} />
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.ROLES.CREATE,
                      PERMISSIONS.ROLES.VIEW,
                      PERMISSIONS.ROLES.EDIT,
                      PERMISSIONS.ROLES.DELETE,
                    ], false) &&
                    <Route path='/roles' element={<Roles/>}/>
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.DEPARTMENTS.CREATE,
                      PERMISSIONS.DEPARTMENTS.VIEW,
                      PERMISSIONS.DEPARTMENTS.EDIT,
                      PERMISSIONS.DEPARTMENTS.DELETE,
                    ], false) &&
                    <Route path='/departments' element={<Departments/>}/>
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.POSITIONS.CREATE,
                      PERMISSIONS.POSITIONS.VIEW,
                      PERMISSIONS.POSITIONS.EDIT,
                      PERMISSIONS.POSITIONS.DELETE,
                    ], false) &&
                    <Route path='/positions' element={<Positions/>}/>
                  }

                  {/* CUSTOMER SERVICE */}
                  {
                    Authorize(permissions, [
                      PERMISSIONS.COMPANIES.CREATE,
                      PERMISSIONS.COMPANIES.VIEW,
                      PERMISSIONS.COMPANIES.EDIT,
                      PERMISSIONS.COMPANIES.DELETE,
                      PERMISSIONS.COMPANIES.EXPORT,
                    ], false) &&
                    <Route path='/companies' element={<Companies />} />
                  }
                  {
                    Authorize(permissions, [PERMISSIONS.COMPANIES.VIEW], false) &&
                    <Route path='/companies/company/:companyId' element={<Company />} />
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.COMPANY_ACCOUNTS.VIEW,
                      PERMISSIONS.COMPANY_ACCOUNTS.CREATE,
                      PERMISSIONS.COMPANY_ACCOUNTS.EDIT,
                      PERMISSIONS.COMPANY_ACCOUNTS.DELETE,
                      PERMISSIONS.COMPANY_ACCOUNTS.EXPORT,
                      ], false) &&
                    <Route path='/company-accounts' element={<CompanyAccounts />} />
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.COMPANY_ACCOUNT_CARDS.VIEW,
                      PERMISSIONS.COMPANY_ACCOUNT_CARDS.CREATE,
                      PERMISSIONS.COMPANY_ACCOUNT_CARDS.EDIT,
                      PERMISSIONS.COMPANY_ACCOUNT_CARDS.DELETE,
                    ], false) &&
                    <Route path='/company-account-cards' element={<CompanyAccountCards />} />
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.BANK_ACCOUNTS.VIEW,
                      PERMISSIONS.BANK_ACCOUNTS.CREATE,
                      PERMISSIONS.BANK_ACCOUNTS.EDIT,
                      PERMISSIONS.BANK_ACCOUNTS.DELETE,
                    ], false) &&
                    <Route path='/bank-accounts' element={<BankAccounts />} />
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.BANK_CARDS.VIEW,
                      PERMISSIONS.BANK_CARDS.CREATE,
                      PERMISSIONS.BANK_CARDS.EDIT,
                      PERMISSIONS.BANK_ACCOUNTS.DELETE,
                    ], false) &&
                    <Route path='/bank-cards' element={<BankCards />} />
                  }

                  {
                    Authorize(permissions, [PERMISSIONS.EFS_CARDS.VIEW], false) &&
                    <Route path='/efs-cards' element={<EfsCards />} />
                  }

                   {/* STATION MANAGEMENT */}
                  {
                    Authorize(permissions, [
                      PERMISSIONS.STATION_CHAINS.VIEW,
                      PERMISSIONS.STATION_CHAINS.CREATE,
                      PERMISSIONS.STATION_CHAINS.EDIT,
                      PERMISSIONS.STATION_CHAINS.DELETE,
                    ], false) &&
                    <Route path='/station-chains' element={<StationChains />} />
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.STATIONS.VIEW,
                      PERMISSIONS.STATIONS.CREATE,
                      PERMISSIONS.STATIONS.EDIT,
                      PERMISSIONS.STATIONS.DELETE,
                      PERMISSIONS.STATIONS.EXPORT,
                    ], false) &&
                    <Route path='/stations' element={<Stations />} />
                  }

                  {/* ACCOUNTING */}

                  {
                    Authorize(permissions, [
                      PERMISSIONS.EFS_TRANSACTIONS.VIEW,
                      PERMISSIONS.EFS_TRANSACTIONS.CREATE,
                      PERMISSIONS.EFS_TRANSACTIONS.EDIT,
                      PERMISSIONS.EFS_TRANSACTIONS.DELETE,
                      PERMISSIONS.EFS_TRANSACTIONS.EXPORT,
                    ], false) &&
                    <Route path='/efs-transactions' element={<EfsUploadList />} />
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.EFS_MONEY_CODES.VIEW,
                      PERMISSIONS.EFS_MONEY_CODES.CREATE,
                      PERMISSIONS.EFS_MONEY_CODES.EDIT,
                      PERMISSIONS.EFS_MONEY_CODES.DELETE,
                      PERMISSIONS.EFS_MONEY_CODES.EXPORT,
                    ], false) &&
                    <Route path='/efs-money-codes' element={<EfsMoneyCodes />} />
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.DAILY_UP_TO_DISCOUNTS.VIEW,
                      PERMISSIONS.DAILY_UP_TO_DISCOUNTS.CREATE,
                      PERMISSIONS.DAILY_UP_TO_DISCOUNTS.EDIT,
                      PERMISSIONS.DAILY_UP_TO_DISCOUNTS.DELETE,

                      PERMISSIONS.STATION_DISCOUNTS.VIEW,
                      PERMISSIONS.STATION_DISCOUNTS.CREATE,
                      PERMISSIONS.STATION_DISCOUNTS.EDIT,
                      PERMISSIONS.STATION_DISCOUNTS.DELETE,

                      PERMISSIONS.COMPANY_DISCOUNTS.VIEW,
                      PERMISSIONS.COMPANY_DISCOUNTS.CREATE,
                      PERMISSIONS.COMPANY_DISCOUNTS.EDIT,
                      PERMISSIONS.COMPANY_DISCOUNTS.DELETE,
                    ], false) &&
                    <Route path='/discount-management' element={<DiscountManagement />} />
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.DAILY_UP_TO_DISCOUNTS.VIEW,
                      PERMISSIONS.STATION_DISCOUNTS.VIEW,
                      PERMISSIONS.COMPANY_DISCOUNTS.VIEW,
                    ], false) &&
                    <Route path='/discount-management-view' element={<DiscountManagementView />} />
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.INVOICE.VIEW,
                      PERMISSIONS.INVOICE.CREATE,
                      PERMISSIONS.INVOICE.EDIT,
                      PERMISSIONS.INVOICE.SEND,
                      PERMISSIONS.INVOICE.CANCEL,
                      PERMISSIONS.INVOICE.EXPORT,
                    ], false) &&
                    <Route path='/invoicing' element={<Invoicing />} />
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.INVOICE.VIEW,
                      PERMISSIONS.INVOICE.EDIT,
                      PERMISSIONS.INVOICE.CANCEL,
                    ], false) &&
                    <Route path='/invoice-groups' element={<InvoiceGroups />} />
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.INVOICE_PAYMENTS.VIEW,
                      PERMISSIONS.INVOICE_PAYMENTS.CREATE,
                      PERMISSIONS.INVOICE_PAYMENTS.EDIT,
                      PERMISSIONS.INVOICE_PAYMENTS.DELETE,
                    ], false) &&
                    <Route path='/payment-list' element={<PaymentList />} />
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.INVOICE_PAYMENTS.VIEW,
                      PERMISSIONS.INVOICE_PAYMENTS.CREATE,
                      PERMISSIONS.INVOICE_PAYMENTS.EDIT,
                      PERMISSIONS.INVOICE_PAYMENTS.DELETE,
                    ], false) &&
                    <Route path='/debtors' element={<Debtors />} />
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.MONEY_CODE_FEES.VIEW,
                      PERMISSIONS.MONEY_CODE_FEES.CREATE,
                      PERMISSIONS.MONEY_CODE_FEES.EDIT,
                      PERMISSIONS.MONEY_CODE_FEES.DELETE,
                    ], false) &&
                    <Route path='/money-code-fee' element={<MoneyCodeFee />} />
                  }
                  {
                    Authorize(permissions, [PERMISSIONS.EFS_MONEY_CODES.VIEW]) &&
                    <Route path='/money-code-remaining' element={<MoneyCodeRemaining />} />
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.MAINTENANCES.VIEW,
                      PERMISSIONS.MAINTENANCES.CREATE,
                      PERMISSIONS.MAINTENANCES.EDIT,
                      PERMISSIONS.MAINTENANCES.DELETE,
                    ], false) &&
                    <Route path='/maintenances' element={<MaintenanceRequests />} />
                  }


                  {/*SETTINGS*/}
                  {
                    Authorize(permissions, [
                      PERMISSIONS.ORGANIZATIONS.VIEW,
                      PERMISSIONS.ORGANIZATIONS.CREATE,
                      PERMISSIONS.ORGANIZATIONS.EDIT,
                      PERMISSIONS.ORGANIZATIONS.DELETE,
                    ], false) &&
                    <Route path='/organizations' element={<Organizations />} />
                  }
                  {
                    Authorize(permissions, [
                      PERMISSIONS.EFS_ACCOUNTS.VIEW,
                      PERMISSIONS.EFS_ACCOUNTS.CREATE,
                      PERMISSIONS.EFS_ACCOUNTS.EDIT,
                      PERMISSIONS.EFS_ACCOUNTS.DELETE,
                    ], false) &&
                    <Route path='/efs-accounts' element={<EfsAccounts />} />
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.FUEL_TYPES.VIEW,
                      PERMISSIONS.FUEL_TYPES.CREATE,
                      PERMISSIONS.FUEL_TYPES.EDIT,
                      PERMISSIONS.FUEL_TYPES.DELETE,
                    ], false) &&
                    <Route path='/fuel-types' element={<FuelTypes />} />
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.AGENTS.VIEW,
                      PERMISSIONS.AGENTS.CREATE,
                      PERMISSIONS.AGENTS.EDIT,
                      PERMISSIONS.AGENTS.DELETE,
                    ], false) &&
                    <Route path='/agents' element={<Agents />} />
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.EMAIL_TEMPLATES.VIEW,
                      PERMISSIONS.EMAIL_TEMPLATES.CREATE,
                      PERMISSIONS.EMAIL_TEMPLATES.EDIT,
                      PERMISSIONS.EMAIL_TEMPLATES.DELETE,
                    ], false) &&
                    <Route>
                      <Route path='/email-templates' element={<EmailTemplates />} />
                      <Route path='/email-history' element={<EmailHistory />} />
                    </Route>
                  }

                  {
                    Authorize(permissions, [
                      PERMISSIONS.MERCHANT_FEES.VIEW,
                      PERMISSIONS.MERCHANT_FEES.CREATE,
                      PERMISSIONS.MERCHANT_FEES.EDIT,
                      PERMISSIONS.MERCHANT_FEES.DELETE,
                    ], false) &&
                    <Route path='/merchant-fee' element={<MerchantFee />} />
                  }


                  {/*INTEGRATIONS*/}
                  {
                    Authorize(permissions, [
                      PERMISSIONS.EFS.VIEW_LOGS
                    ], false) &&
                    <Route path="/efs" element={<EFS />} />
                  }
                  {
                    Authorize(permissions, [
                      PERMISSIONS.FORMSITE.VIEW_LOGS
                    ], false) &&
                    <Route path='/formsite' element={<Formsite />} />
                  }

                  {/*TASKS*/}
                  {
                    Authorize(permissions, [
                      PERMISSIONS.TASKS.VIEW,
                      PERMISSIONS.TASKS.CREATE,
                      PERMISSIONS.TASKS.EDIT,
                      PERMISSIONS.TASKS.DELETE,
                    ], false) &&
                    <Route path='/tasks' element={<Tasks />} />
                  }

                  {/*NOTIFICATIONS*/}
                  <Route path='/notifications' element={<Notifications />} />
                  <Route path='/notifications-settings' element={<NotificationsSettings />} />

                  <Route path="/unauthorized" element={<Forbidden />} />
                  <Route path='/not-found' element={<NotFound />} />

                  <Route path='*' element={<Navigate to='/my-profile' />} />
                </Routes>
            </div>
        </div>
    )
}

export default AdminLayout