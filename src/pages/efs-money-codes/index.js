import React, { useState } from 'react'
import { Button, Col, Row, Tabs, Typography } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import { FiUpload } from "react-icons/fi"
import http from '../../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import EfsMoneyCodesUploadModal from '../../modals/efsMoneyCodesUploadModal'
import UncheckedMoneyCodes from './tabs/unchecked-money-codes'
import MissingMoneyCodes from './tabs/missing-money-codes'
import MissingCompanies from './tabs/missing-companies'
import Histories from './tabs/histories'
import SkippedTransactions from './tabs/skipped-transactions'
import AttachedCompanies from './tabs/attached-companies'
import MoneyCodesList from './tabs/money-codes-list';
import { useLocalStorageState } from 'ahooks';

const Text = Typography

const EfsMoneyCodes = () => {
    const [tabType, setTabType] = useLocalStorageState("unchecked-money-codes", {defaultValue: "unchecked-money-codes"})
    const [isOpenModal, setIsOpenModal] = useState(false)

    const items = [
        {
            key: 'unchecked-money-codes',
            label: 'Unchecked Money Codes',
        },
        {
            key: 'money-codes-list',
            label: 'Money Codes List',
        },
        {
            key: 'missing-money-codes',
            label: 'Missing In Invoices',
        },
        {
            key: 'missing-companies',
            label: 'Missing Companies',
        },
        {
            key: 'attached-companies',
            label: 'Attached Companies',
        },
        {
            key: 'skipped-transactions',
            label: 'Prepaid Money Codes',
        },
        {
            key: 'histories',
            label: 'Upload Histories',
        },
    ]

    const [resolveLoading, setResolveLoading] = useState(false)

    const resolve = async () => {
        setResolveLoading(true)
        try {
            const response = await http.post(`/EfsMoneyCodes/resolve-unchecked-money-codes`)
            if (response?.success) {
                toast.success(
                    <div className={'flex box flex-col gap-2 my-2'}>
                        <Text className={'font-bold'}>Response </Text>
                        <Text className='text-[12px]'>All Unchecked Transactions Count : {response?.data.allUncheckedTransactionsCount}</Text>
                        <Text className={'text-green-700 text-[12px]'}>Resolved Transactions Count : {response?.data.resolvedTransactionsCount}</Text>
                        <Text className={'text-amber-600 text-[12px]'}>Unresolved Transactions Count : {response?.data.unresolvedTransactionsCount}</Text>
                    </div>,
                    {
                        closeButton: false,
                        icon: false,
                        autoClose: false
                    },
                )
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error("Server Error!")
        } finally {
            setResolveLoading(false)
        }
    }

    return (
        <div className='box'>
            <Row className='mb-3'>
                <Col className='flex'>
                    <Button
                        type='primary'
                        className='flex'
                        onClick={() => setIsOpenModal(true)}
                    >
                        <FiUpload className='mr-2 text-[18px] items-center' />
                        Upload
                    </Button>
                    <Button className='ml-3' onClick={resolve} disabled={resolveLoading}>
                        <SyncOutlined spin={resolveLoading} />
                        Resolve
                    </Button>
                </Col>
            </Row>

            <Tabs
                items={items}
                onChange={(e) => setTabType(e)}
                defaultActiveKey={tabType}
            />

            {tabType === "unchecked-money-codes" ? <UncheckedMoneyCodes /> : null}
            {tabType === "money-codes-list" ? <MoneyCodesList /> : null}
            {tabType === "missing-money-codes" ? <MissingMoneyCodes /> : null}
            {tabType === "missing-companies" ? <MissingCompanies /> : null}
            {tabType === "histories" ? <Histories /> : null}
            {tabType === "attached-companies" ? <AttachedCompanies /> : null}
            {tabType === "skipped-transactions" ? <SkippedTransactions /> : null}

            <EfsMoneyCodesUploadModal
                isOpenModal={isOpenModal}
                setIsOpenModal={setIsOpenModal}
            />
        </div>
    )
}

export default EfsMoneyCodes