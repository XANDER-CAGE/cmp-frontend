import { Button, Col, Divider, Row, Select, Switch, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import { toast } from 'react-toastify'

const Text = Typography

const NotificationsSettings = () => {
    const customOptions = [
        { label: '5 minutes', value: 'FiveMinutes' },
        { label: '15 minutes', value: 'FifteenMinutes' },
        { label: '30 minutes', value: 'ThirtyMinutes' },
        { label: '1 hour', value: 'OneHour' },
        { label: '2 hours', value: 'TwoHours' },
        { label: '3 hours', value: 'ThreeHours' },
        { label: '6 hours', value: 'SixHours' },
        { label: '8 hours', value: 'EightHours' },
        { label: '12 hours', value: 'TwelveHours' },
        { label: '1 day', value: 'OneDay' },
        { label: '2 day', value: 'TwoDays' },
        { label: '3 day', value: 'ThreeDays ' },
    ]

    const [taskAfterDueDateReminder, settaskAfterDueDateReminder] = useState(true)
    const [taskAfterDueDateReminderTime, settaskAfterDueDateReminderTime] = useState(null)
    const [taskAssigned, settaskAssigned] = useState(true)
    const [taskBeforeDueDateReminder, settaskBeforeDueDateReminder] = useState(true)
    const [taskBeforeDueDateReminderTime, settaskBeforeDueDateReminderTime] = useState(null)
    const [taskDeleted, settaskDeleted] = useState(true)
    const [taskDescriptionChanged, settaskDescriptionChanged] = useState(true)
    const [taskDueDateChanged, settaskDueDateChanged] = useState(true)
    const [taskNameChanged, settaskNameChanged] = useState(true)
    const [taskNewComment, settaskNewComment] = useState(true)
    const [taskPriorityChanged, settaskPriorityChanged] = useState(true)
    const [taskReassigned, settaskReassigned] = useState(true)
    const [taskStatusChanged, settaskStatusChanged] = useState(true)
    const [taskWatcherAdded, settaskWatcherAdded] = useState(true)
    const [taskWatcherRemoved, settaskWatcherRemoved] = useState(true)

    const [submitLoading, setSubmitLoading] = useState(false)

    const getUserNotificationsSettingsCurrent = async () => {
        try {
            const response = await http.get('/UserNotificationSettings/current')
            settaskAfterDueDateReminder(response?.data?.taskAfterDueDateReminder)
            settaskAfterDueDateReminderTime(response?.data?.taskAfterDueDateReminderTime)
            settaskAssigned(response?.data?.taskAssigned)
            settaskBeforeDueDateReminder(response?.data?.taskBeforeDueDateReminder)
            settaskBeforeDueDateReminderTime(response?.data?.taskBeforeDueDateReminderTime)
            settaskDeleted(response?.data?.taskDeleted)
            settaskDescriptionChanged(response?.data?.taskDescriptionChanged)
            settaskDueDateChanged(response?.data?.taskDueDateChanged)
            settaskNameChanged(response?.data?.taskNameChanged)
            settaskNewComment(response?.data?.taskNewComment)
            settaskPriorityChanged(response?.data?.taskPriorityChanged)
            settaskReassigned(response?.data?.taskReassigned)
            settaskStatusChanged(response?.data?.taskStatusChanged)
            settaskWatcherAdded(response?.data?.taskWatcherAdded)
            settaskWatcherRemoved(response?.data?.taskWatcherRemoved)
        } catch (error) {
            console.log(error)
        }
    }

    const submitNotificationsSettings = async () => {
        const data = {
            taskAssigned,
            taskReassigned,
            taskStatusChanged,
            taskNameChanged,
            taskDescriptionChanged,
            taskPriorityChanged,
            taskDueDateChanged,
            taskWatcherAdded,
            taskWatcherRemoved,
            taskNewComment,
            taskDeleted,
            taskBeforeDueDateReminder,
            taskBeforeDueDateReminderTime,
            taskAfterDueDateReminder,
            taskAfterDueDateReminderTime,
            taskOverdue: true,
            taskDeadlineReminder: true
        }
        setSubmitLoading(true)
        try {
            const response = await http.post('/UserNotificationSettings/current', data)
            if (response?.code === 500) {
                toast.error(response?.error)
            } else {
                getUserNotificationsSettingsCurrent()
                toast.success('Saved')
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setSubmitLoading(false)
        }
    }

    useEffect(() => {
        getUserNotificationsSettingsCurrent()
    }, [])

    return (
        <div className='box'>
            <Text className='text-[18px] font-bold'>Notifications Settings</Text>
            <Divider />
            <Row>
                <Col span={8} className='mb-5 notification-col'>
                    <Switch checked={taskAssigned} onChange={(checked) => settaskAssigned(checked)} />
                    <label className='ml-5'>Task Assigned</label>
                </Col>
                <Col span={8} className='mb-5 notification-col'>
                    <Switch checked={taskReassigned} onChange={(checked) => settaskReassigned(checked)} />
                    <label className='ml-5'>Task Reassigned</label>
                </Col>
                <Col span={8} className='mb-5 notification-col'>
                    <Switch checked={taskStatusChanged} onChange={(checked) => settaskStatusChanged(checked)} />
                    <label className='ml-5'>Task Status Changed</label>
                </Col>
                <Col span={8} className='mb-5 notification-col'>
                    <Switch checked={taskNameChanged} onChange={(checked) => settaskNameChanged(checked)} />
                    <label className='ml-5'>Task Name Changed</label>
                </Col>
                <Col span={8} className='mb-5 notification-col'>
                    <Switch checked={taskDescriptionChanged} onChange={(checked) => settaskDescriptionChanged(checked)} />
                    <label className='ml-5'>Task Description Changed</label>
                </Col>
                <Col span={8} className='mb-5 notification-col'>
                    <Switch checked={taskPriorityChanged} onChange={(checked) => settaskPriorityChanged(checked)} />
                    <label className='ml-5'>Task Priority Changed</label>
                </Col>
                <Col span={8} className='mb-5 notification-col'>
                    <Switch checked={taskDueDateChanged} onChange={(checked) => settaskDueDateChanged(checked)} />
                    <label className='ml-5'>Task Due Date Changed</label>
                </Col>
                <Col span={8} className='mb-5 notification-col'>
                    <Switch checked={taskWatcherAdded} onChange={(checked) => settaskWatcherAdded(checked)} />
                    <label className='ml-5'>Task Watcher Added</label>
                </Col>
                <Col span={8} className='mb-5 notification-col'>
                    <Switch checked={taskWatcherRemoved} onChange={(checked) => settaskWatcherRemoved(checked)} />
                    <label className='ml-5'>Task Watcher Removed</label>
                </Col>
                <Col span={8} className='mb-5 notification-col'>
                    <Switch checked={taskNewComment} onChange={(checked) => settaskNewComment(checked)} />
                    <label className='ml-5'>Task New Comment</label>
                </Col>
                <Col span={8} className='mb-5 notification-col'>
                    <Switch checked={taskDeleted} onChange={(checked) => settaskDeleted(checked)} />
                    <label className='ml-5'>Task Deleted</label>
                </Col>
            </Row>

            <Row>
                <Col span={8} className='mb-5 notification-col'>
                    <Switch checked={taskBeforeDueDateReminder} onChange={(checked) => settaskBeforeDueDateReminder(checked)} />
                    <label className='ml-5'>Task Before Due Date Reminder</label>
                </Col>
                <Col span={8} className='mb-5 notification-col'>
                    <label className='mr-3'>Before</label>
                    <Select
                        value={taskBeforeDueDateReminderTime}
                        placeholder="Select time"
                        allowClear
                        options={customOptions}
                        onChange={(value) => settaskBeforeDueDateReminderTime(value)}
                        style={{ width: '50%' }}
                    />
                </Col>
            </Row>

            <Row>
                <Col span={8} className='mb-5 notification-col'>
                    <Switch checked={taskAfterDueDateReminder} onChange={(checked) => settaskAfterDueDateReminder(checked)} />
                    <label className='ml-5'>Task After Due Date Reminder</label>
                </Col>
                <Col span={8} className='mb-5 notification-col'>
                    <label className='mr-3'>After</label>
                    <Select
                        value={taskAfterDueDateReminderTime}
                        placeholder="Select time"
                        allowClear
                        options={customOptions}
                        onChange={(value) => settaskAfterDueDateReminderTime(value)}
                        style={{ width: '50%' }}
                    />
                </Col>
            </Row>

            <Row>
                <Button
                    type="primary"
                    className='ml-auto'
                    onClick={submitNotificationsSettings}
                    loading={submitLoading}
                >
                    Save
                </Button>
            </Row>
        </div>
    )
}

export default NotificationsSettings