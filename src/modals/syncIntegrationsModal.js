import { Button, DatePicker, Modal } from 'antd'
import dayjs from 'dayjs'
import { get } from 'lodash'
import React from 'react'
import { SyncOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker

const SyncIntegrationsModal = (props) => {
    const { isOpenModal, setIsOpenModal, onChangeRange, dateRangeValue, syncIntegration, isLoadingIntegration } = props

    return (
        <Modal
            open={isOpenModal}
            onOk={() => setIsOpenModal(!isOpenModal)}
            closable={false}
            footer={null}
            title="Sync EFS Data"
        >
            <RangePicker
                onChange={onChangeRange}
                format={'DD-MM-YYYY'}
                style={{ width: '100%' }}
                value={
                    dateRangeValue ? [dayjs(get(dateRangeValue, '[0]', '')), dayjs(get(dateRangeValue, '[1]', ''))] : undefined
                }
            />
            <div className="mt-3 text-right">
                <Button disabled={isLoadingIntegration} className="mr-3" onClick={() => setIsOpenModal(false)}>
                    Cancel
                </Button>
                <Button type="primary" disabled={isLoadingIntegration} onClick={syncIntegration}>
                    <SyncOutlined spin={isLoadingIntegration} />
                    Sync
                </Button>
            </div>
        </Modal>
    )
}

export default SyncIntegrationsModal