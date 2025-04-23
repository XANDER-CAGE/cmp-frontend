import { Button, Input, Modal, Tabs } from 'antd'
import React, { useState } from 'react'
import Transactions from '../pages/transactions'
import TransactionsGroup from '../pages/transactions-group'
import Payments from '../pages/payments'
import BasicTab from '../pages/company/tabs/basicTab'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'

const InvoiceDetailsModal = (props) => {
    const { isOpenDetailsModal, setIsOpenDetailsModal, invoiceId, openedCompanyId, initialBonus, getInvoiceInfo } = props

    const [bonus, setBonus] = useState(initialBonus)
    const [bonusLoading, setBonusLoading] = useState(false)

    const [tabType, setTabType] = useState("payments")

    const items = [
        {
            key: 'payments',
            label: 'Payments',
        },
        {
            key: 'basic-information',
            label: 'Basic Information',
        },
        {
            key: 'bonus',
            label: 'Bonus',
        },
        {
            key: 'transactions',
            label: 'Transactions',
        },
        {
            key: 'by-driver',
            label: 'By Driver',
        },
    ]

    const addBonus = async () => {
        setBonusLoading(true)
        try {
            const response = await http.post('Invoices/add-bonus', {
                bonusAmount: bonus,
                invoiceId
            })
            if (response?.success) {
                toast.success('Bonus added succesfully!')
                getInvoiceInfo()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setBonusLoading(false)
        }
    }

    return (
        <Modal
            open={isOpenDetailsModal}
            onCancel={() => setIsOpenDetailsModal(false)}
            width={1600}
            title={`Invoice Details`}
            footer={[]}
            centered
        >
            <Tabs
                items={items}
                onChange={(e) => setTabType(e)}
                defaultActiveKey={tabType}
            />

            {
                tabType === "payments" ? (
                    <Payments
                        openedCompanyId={openedCompanyId}
                        invoiceId={invoiceId}
                        getInvoiceInfo={getInvoiceInfo}
                        setIsOpenDetailsModal={setIsOpenDetailsModal}
                    />
                ) : null
            }

            {
                tabType === "basic-information" ? (
                    <BasicTab
                        openedCompanyId={openedCompanyId}
                        getInvoiceInfo={getInvoiceInfo}
                    />
                ) : null
            }

            {
                tabType === "bonus" ? (
                    <div className='flex'>
                        <Input type='number' className='w-[300px] mr-3' placeholder='Bonus' value={bonus} onChange={(e) => setBonus(e.target.value)} />
                        <Button type='primary' loading={bonusLoading} onClick={addBonus}>Save</Button>
                    </div>
                ) : null
            }

            {
                tabType === "transactions" ? (
                    <Transactions
                        invoiceId={invoiceId}
                    />
                ) : null
            }

            {
                tabType === "by-driver" ? (
                    <TransactionsGroup
                        invoiceId={invoiceId}
                    />
                ) : null
            }
        </Modal>
    )
}

export default InvoiceDetailsModal