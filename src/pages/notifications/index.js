import { Empty, Pagination, Row, Spin, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import TaskAssigned from '../../sources/notification-types/taskAssigned'
import TaskDescriptionChanged from '../../sources/notification-types/taskDescriptionChanged'
import TaskDueDateChanged from '../../sources/notification-types/taskDueDateChanged'
import TaskNameChanged from '../../sources/notification-types/taskNameChanged'
import TaskNewComment from '../../sources/notification-types/taskNewComment'
import TaskPriorityChanged from '../../sources/notification-types/taskPriorityChanged'
import TaskReAssigned from '../../sources/notification-types/taskReAssigned'
import TaskStatusChanged from '../../sources/notification-types/taskStatusChanged'
import TaskWatcherAdded from '../../sources/notification-types/taskWatcherAdded'

const Notifications = () => {
    const [allNotifications, setAllNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [totalCount, setTotalCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [notificationType, setNotificationType] = useState('unread')


    const items = [
        {
            key: 'unread',
            label: `New`,
        },
        {
            key: 'read',
            label: `Read`,
        },
    ]

    const getAllNotifications = async () => {
        setIsLoading(true)
        setAllNotifications([])
        try {
            const response = await http.post('/Notifications/filter', {
                new: notificationType === 'read' ? false : true,
                pagination: {
                    pageNumber: currentPage,
                    pageSize
                }
            })
            setAllNotifications(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const markAsRead = async (id) => {
        try {
            const response = await http.post(`/Notifications/mark-as-read/${id}`, {})
            if (response?.code === 200) {
                toast.success('Marked as Read')
                getAllNotifications()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        }
    }

    useEffect(() => {
        getAllNotifications()

        // eslint-disable-next-line
    }, [pageSize, currentPage, notificationType])

    return (
        <div className='box'>
            <Tabs
                items={items}
                onChange={(key) => {
                    setNotificationType(key)
                }}
                defaultActiveKey='unread'
            />
            <Row>
                {isLoading ? (
                    <div className='mx-auto'><Spin /></div>
                ) : null}
                {
                    allNotifications === null && !isLoading ? (
                        <div className='mx-auto'>
                            <Empty />
                        </div>
                    ) : null
                }
                {
                    allNotifications?.map((item, index) => {
                        switch (item?.Type) {
                            case "TaskAssigned":
                                return <TaskAssigned item={item} markAsRead={markAsRead} key={index} />
                            case "TaskDeadlineReminder":
                                return (
                                    <p>TaskDeadLineReminder</p>
                                )
                            case "TaskDeleted":
                                return (
                                    <p>TaskDeleted</p>
                                )
                            case "TaskDescriptionChanged":
                                return <TaskDescriptionChanged item={item} markAsRead={markAsRead} key={index} />
                            case "TaskDueDateChanged":
                                return <TaskDueDateChanged item={item} key={index} markAsRead={markAsRead} />
                            case "TaskNameChanged":
                                return <TaskNameChanged item={item} key={index} markAsRead={markAsRead} />
                            case "TaskNewComment":
                                return <TaskNewComment item={item} key={index} markAsRead={markAsRead} />
                            case "TaskOverdue":
                                return (
                                    <p>TaskOverdue</p>
                                )
                            case "TaskPriorityChanged":
                                return <TaskPriorityChanged item={item} key={index} markAsRead={markAsRead} />
                            case "TaskReassigned":
                                return <TaskReAssigned item={item} key={index} markAsRead={markAsRead} />
                            case "TaskStatusChanged":
                                return <TaskStatusChanged item={item} key={index} markAsRead={markAsRead} />
                            case "TaskWatcherAdded":
                                return <TaskWatcherAdded item={item} key={index} markAsRead={markAsRead} />
                            case "TaskWatcherRemoved":
                                return (
                                    <p>TaskWatcherRemoved</p>
                                )
                            default:
                                return 0
                        }
                    })
                }
                {
                    allNotifications?.length > 0 ? (
                        <Pagination
                            total={totalCount}
                            current={currentPage}
                            pageSizeOptions={[10, 20, 50, 100]}
                            showSizeChanger
                            pageSize={pageSize}
                            size='small'
                            onChange={(currentPage, pageSize) => {
                                setCurrentPage(currentPage)
                                setPageSize(pageSize)
                            }}
                            className='mt-5 ml-auto'
                        />
                    ) : null
                }
            </Row>
        </div>
    )
}

export default Notifications