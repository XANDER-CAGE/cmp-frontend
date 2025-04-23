import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import http from '../../utils/axiosInterceptors'
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Tabs } from 'antd';
import BasicTab from './tabs/basicTab';
import BankAccountsTab from './tabs/bankAccountsTab';
import BankCardsTab from './tabs/bankCardsTab';
import AccountsTab from './tabs/accountsTab';
import AccountCardsTab from './tabs/accountCardsTab';
import InvoicesTab from './tabs/invoicesTab';

const Company = () => {
    const { companyId } = useParams()
    const navigate = useNavigate()

    const [companyInfo, setCompanyInfo] = useState({})
    const [tabType, setTabType] = useState("basic")

    const tabItems = [
        {
            key: 'basic',
            label: 'Basic',
        },
        {
            key: 'bankAccounts',
            label: <span className={companyInfo?.bankAccountsCount ? "" : "text-[red]"}>Bank Accounts ({companyInfo?.bankAccountsCount})</span>,
        },
        {
            key: 'bankCards',
            label: <span className={companyInfo?.bankCardsCount ? "" : "text-[red]"}>Bank Cards ({companyInfo?.bankCardsCount})</span>,
        },
        {
            key: 'accounts',
            label: <span className={companyInfo?.companyAccountsCount ? "" : "text-[red]"}>Accounts ({companyInfo?.companyAccountsCount})</span>,
        },
        {
            key: 'accountCards',
            label: <span className={companyInfo?.companyAccountCardsCount ? "" : "text-[red]"}>Account Cards ({companyInfo?.companyAccountCardsCount})</span>,
        },
        {
            key: 'invoices',
            label: <span className={companyInfo?.invoicesCount ? "" : "text-[red]"}>Invoices ({companyInfo?.invoicesCount})</span>,
        },
    ]

    const getCompanyInfo = async () => {
        try {
            const response = await http.get(`Companies/${companyId}`)
            setCompanyInfo(response?.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCompanyInfo()

        // eslint-disable-next-line
    }, [companyId])

    const switchTabs = (key) => {
        switch (key) {
            case 'basic':
                return <BasicTab />
            case 'bankAccounts':
                return <BankAccountsTab />
            case 'bankCards':
                return <BankCardsTab />
            case 'accounts':
                return <AccountsTab />
            case 'accountCards':
                return <AccountCardsTab />
            case 'invoices':
                return <InvoicesTab companyId={companyId} />
            default:
                return null
        }
    }

    return (
        <div>
            <div className='box mb-2 flex items-center'>
                <div className='icon mr-5' onClick={() => navigate(-1)}>
                    <FaLongArrowAltLeft />
                </div>
                <h1 className='m-0 text-[18px] font-bold'>{companyInfo.name}</h1>
            </div>
            <div className='box'>
                <Tabs
                    items={tabItems}
                    onChange={(e) => setTabType(e)}
                    defaultActiveKey={tabType}
                    className='mb-5'
                />

                {switchTabs(tabType)}
            </div>
        </div>
    )
}

export default Company