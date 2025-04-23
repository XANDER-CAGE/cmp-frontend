import React, { useState } from 'react'
import { Button, Col, DatePicker, Row, Tabs, Typography } from 'antd';
import UncheckedTransactions from './tabs/unchecked-transactions'
import { SyncOutlined } from '@ant-design/icons'
import { FiUpload } from "react-icons/fi"
import MissingTransactions from './tabs/missing-transactions'
import MissingCards from './tabs/missing-cards'
import MissingStations from './tabs/missing-stations'
import Histories from './tabs/histories'
import http from '../../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import EfsUploadModal from '../../modals/efsUploadModal'
import RefundedTransactions from './tabs/refunded-transactions';
import SuspiciousTransactions from './tabs/suspicious-transactions';

const Text = Typography

const EfsUploadList = () => {
    const [tabType, setTabType] = useState("unchecked-transactions")
    const [isOpenModal, setIsOpenModal] = useState(false)

    const items = [
        {
            key: 'unchecked-transactions',
            label: 'Unchecked Transactions',
        },
        {
            key: 'missing-transactions',
            label: 'Missing Transactions',
        },
        {
            key: 'missing-cards',
            label: 'Missing Cards',
        },
        {
            key: 'missing-stations',
            label: 'Missing Stations',
        },
        {
            key: 'refunded-transactions',
            label: 'Refunded Transactions',
        },
        {
            key: 'suspicious-transactions',
            label: 'Suspicious Transactions',
        },
        {
            key: 'upload-histories',
            label: 'Upload Histories',
        },
    ]

    const [resolveLoading, setResolveLoading] = useState(false)

    const resolve = async () => {
        setResolveLoading(true)
        try {
            const response = await http.post(`/EfsTransactions/resolve-unchecked-transactions`)
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

            {tabType === "unchecked-transactions" ? <UncheckedTransactions /> : null}
            {tabType === "missing-transactions" ? <MissingTransactions /> : null}
            {tabType === "missing-cards" ? <MissingCards /> : null}
            {tabType === "missing-stations" ? <MissingStations /> : null}
            {tabType === "refunded-transactions" ? <RefundedTransactions /> : null}
            {tabType === "suspicious-transactions" ? <SuspiciousTransactions /> : null}
            {tabType === "upload-histories" ? <Histories /> : null}

            <EfsUploadModal
                isOpenModal={isOpenModal}
                setIsOpenModal={setIsOpenModal}
            />
        </div>
    )
}

export default EfsUploadList