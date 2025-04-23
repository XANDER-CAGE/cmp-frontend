import React, { useCallback, useEffect, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import dayjs from 'dayjs'
import { chain, get } from 'lodash'
import { Button, Calendar, Col, Typography } from 'antd'
import SyncIntegrationsModal from '../../modals/syncIntegrationsModal'
import { toast } from 'react-toastify'
import FormsitePopover from '../../sources/popovers/formsite-popover'
import Authorize from "../../utils/Authorize";
import {PERMISSIONS} from "../../constants";
import {Route} from "react-router-dom";
import EFS from "../efs";
import {useUserInfo} from "../../contexts/UserInfoContext";

const Text = Typography

const Formsite = () => {
    const [isOpenModal, setIsOpenModal] = useState(false)
    const {permissions} = useUserInfo()

    const [value, setValue] = useState(dayjs(new Date()))
    const [dateStrings, setDateStrings] = useState('')
    const [dateRangeValue, setDateRangeValue] = useState('')

    const [isLoadingIntegration, setIsLoadingIntegration] = useState(false)
    const [formsiteInfo, setFormsiteInfo] = useState([])

    const onChangeRange = (dates, dateStrings) => {
        setDateRangeValue(dates)

        if(dateStrings[0] === '' && dateStrings[1] === '') {
            setDateStrings([])
        }
        else {
            setDateStrings(dateStrings)
        }
    };

    const onPanelChange = (newValue) => {
        setValue(newValue)
    }

    const getFormsiteResultLogs = async () => {
        try {
            const response = await http.post('/formsite-sync/form-result-logs', {
                fromDate: `${value.subtract(1, 'M').format('YYYY-MM-DD')}`,
                toDate: `${value.add(1, 'M').format('YYYY-MM-DD')}`,
            })
            setFormsiteInfo(chain(response?.data).keyBy('day').value())
        } catch (error) {
            console.log(error)
        }
    }

    const getSyncInfo = useCallback(
        (value) => {
            return get(formsiteInfo, value.format('YYYY-MM-DD'), '')
        },
        [formsiteInfo],
    )

    const dateCellRender = (value) => {
        const res = getSyncInfo(value)
        if (res?.syncLog) {
            return <FormsitePopover res={res} />
        }
    }

    const cellRender = (current, info) => {
        if (info.type === 'date') return dateCellRender(current)
        return info.originNode
    }


    const syncIntegration = async () => {
        setIsLoadingIntegration(true)
        const fromDate = dateStrings && dateStrings.length > 0
            ? `${dateStrings[0].split('-')[0]}${dateStrings[0].split('-')[1]}${dateStrings[0].split('-')[2]}`
            : ''
        const toDate = dateStrings && dateStrings.length > 0
            ? `${dateStrings[1].split('-')[0]}${dateStrings[1].split('-')[1]}${dateStrings[1].split('-')[2]}`
            : ''

        try {
            const response = await http.post(`/Integrations/formsite?fromDate=${fromDate}&toDate=${toDate}`)
            if (response?.success) {
                toast.success(
                    <div
                        className={'flex flex-col gap-3 my-3'}
                        style={{ borderBottom: '4px solid #0abc0d', borderRight: '4px solid #0abc0d' }}
                    >
                        <Text className={'font-bold'}>{response?.data?.message}</Text>
                        <Text>Total Count: {response?.data?.totalCount}</Text>
                        <Text className={'text-green-700'}>Success Count: {response?.data?.successCount}</Text>
                        <Text className={'text-blue-700'}>Updated Count: {response?.data?.updatedCount}</Text>
                        <Text className={'text-amber-700'}>Created Count: {response?.data?.createdCount}</Text>
                        <Text className={'text-red-700'}>Failed Count: {response?.data?.failCount}</Text>
                    </div>,
                    {
                        closeButton: false,
                        // icon: false,
                        autoClose: false,
                    },
                )
                setIsOpenModal(false)
                getFormsiteResultLogs()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error('Error')
        } finally {
            setIsLoadingIntegration(false)
        }
    }

    useEffect(() => {
        getFormsiteResultLogs()

        // eslint-disable-next-line
    }, [value])

    return (
        <div className='box'>
            <SyncIntegrationsModal
                setIsOpenModal={setIsOpenModal}
                isOpenModal={isOpenModal}
                onChangeRange={onChangeRange}
                dateRangeValue={dateRangeValue}
                isLoadingIntegration={isLoadingIntegration}
                syncIntegration={syncIntegration}
            />

            <Col style={{ textAlign: 'right' }}>
                {
                    Authorize(permissions, [
                        PERMISSIONS.EFS.VIEW_LOGS
                    ], false) &&
                    <Button type="primary" onClick={() => setIsOpenModal(true)}>
                        Sync
                    </Button>
                }
            </Col>

            <Calendar
                fullscreen={true}
                cellRender={cellRender}
                mode="month"
                onPanelChange={onPanelChange}
            />
        </div>
    )
}

export default Formsite