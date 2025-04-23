import { Modal, Typography } from 'antd'
import React from 'react'
import UploadFile from '../components/upload-file'
import { toast } from 'react-toastify'

const Text = Typography

const EfsUploadModal = (props) => {
    const { isOpenModal, setIsOpenModal } = props

    return (
        <Modal
            open={isOpenModal}
            onCancel={() => setIsOpenModal(false)}
            footer={[]}
            title={`Load EFS Transactions from excel file`}
        >
            <div className='pt-5'>
                <UploadFile
                    accept={'.xls,.xlsx'}
                    uploadPath={'/EfsTransactions/load'}
                    className={'mt-5'}
                    onSuccess={(resUpload) => {
                        resUpload &&
                            toast.success(
                                <div className={'flex box flex-col gap-3 my-3'}>
                                    <Text className={'font-bold'}>Response </Text>
                                    <Text className='text-[12px]'>Loaded Transactions Count : {resUpload?.loadedTransactionsCount}</Text>
                                    <Text className={'text-green-700 text-[12px]'}>New Transactions Count : {resUpload?.newTransactionsCount}</Text>
                                    <Text className='text-[12px]'>Existing Transactions Count : {resUpload?.existingTransactionsCount}</Text>
                                    <Text className={'text-amber-600 text-[12px]'}>Failed Transactions Count : {resUpload?.failedTransactionsCount}</Text>
                                </div>,
                                {
                                    closeButton: false,
                                    icon: false,
                                    autoClose: false
                                },
                            )
                    }}
                    onError={() => toast.error('Error on upload!')}
                    multiple
                />
            </div>
        </Modal>
    )
}

export default EfsUploadModal