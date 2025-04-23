import React, { useEffect, useMemo, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { Button, Col, Collapse, Input, Row, Select } from 'antd'
import { toast } from 'react-toastify'
import TasksModal from '../../modals/tasks'
import { tasksColumns } from '../../sources/columns/tasksColumns'
import { FaFilter } from 'react-icons/fa'
import { useLocalStorageState } from 'ahooks'
import { taskFilterTypeOptions, taskPriorityOptions, taskStatusOptions } from '../../constants'
import TaskStatusModal from '../../modals/task-status'
import queryString from 'query-string'
import { useNavigate } from 'react-router-dom'

const Tasks = () => {
    const { view, task_id } = queryString.parse(window.location.search)
    const navigate = useNavigate()

    const [tasks, setTasks] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [isLoading, setIsLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [taskId, setTaskId] = useState('')
    const [isOpenStatusModal, setIsOpenStatusModal] = useState(false)
    const [initialStatus, setInitialStatus] = useState('')
    const [editId, setEditId] = useState(null)
    const [totalCount, setTotalCount] = useState(0)
    const [isOpenFilter, setIsOpenFilter] = useLocalStorageState("tasksFilter", { defaultValue: false })
    const [searchTerm, setSearchTerm] = useState('')
    const [taskPriority, setTaskPriority] = useState(null)
    const [taskStatus, setTaskStatus] = useState(null)
    const [filterType, setFilterType] = useState(null)

    const openModal = (id) => {
        setIsOpenModal(true)
        setEditId(id)
    }

    const openStatusModal = (statusType, id) => {
        setIsOpenStatusModal(true)
        setInitialStatus(statusType)
        setTaskId(id)
    }

    const closeModal = () => {
        setIsOpenModal(false)
        setEditId(null)
        navigate(`/tasks?${queryString.stringify({ view: undefined, task_id: undefined })}`)
    }

    const filters = useMemo(() => {
        return {
            searchTerm,
            taskStatus,
            taskPriority,
            assignedToMe: filterType === 'AssignedToMe',
            createdByMe: filterType === 'CreatedByMe',
            watchedByMe: filterType === 'WatchedByMe',
            pagination: {
                pageNumber,
                pageSize,
            }
        }
    },
        [pageNumber, pageSize, searchTerm, taskPriority, taskStatus, filterType]
    )

    const filterItems = [
        {
            key: '1',
            label: 'Tap to Filter',
            children:
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Select
                            className='w-[100%]'
                            placeholder="Task Priority"
                            options={taskPriorityOptions}
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label || '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={taskPriority}
                            onChange={(e) => setTaskPriority(e)}
                        />
                    </Col>
                    <Col span={12}>
                        <Select
                            className='w-[100%]'
                            placeholder="Filter"
                            value={filterType}
                            options={taskFilterTypeOptions}
                            filterOption={(input, option) =>
                                (option?.label || '').toLowerCase().includes(input.toLowerCase())
                            }
                            onChange={(value) => setFilterType(value)}
                            allowClear
                        />
                    </Col>
                    <Col span={12}>
                        <Select
                            className='w-[100%]'
                            placeholder="Task Status"
                            options={taskStatusOptions}
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label || '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={taskStatus}
                            onChange={(e) => setTaskStatus(e)}
                        />
                    </Col>
                    <Col span={12}>
                        <Input.Search
                            placeholder='Search by Title'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            allowClear
                        />
                    </Col>
                </Row>,
        }
    ]

    const getTasks = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("Tasks/filter", filters)
            setTasks(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteTask = async (id) => {
        setDeleteLoading(true)
        try {
            const response = await http.delete(`Tasks/${id}`)
            if (response?.success) {
                toast.success('Succesfully deleted!')
                getTasks()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setDeleteLoading(false)
        }
    }

    useEffect(() => {
        getTasks()

        // eslint-disable-next-line
    }, [filters])

    useEffect(() => {
        if (task_id) {
            openModal(task_id)
        }
    }, [task_id])

    return (
        <div className='box'>
            <Row className='mb-5'>
                <Col span={18}>
                    <Collapse
                        style={{ width: '100%' }}
                        items={filterItems}
                        bordered={false}
                        activeKey={isOpenFilter ? ['1'] : null}
                        size='small'
                        expandIconPosition='end'
                        expandIcon={() => <FaFilter />}
                        onChange={() => setIsOpenFilter(!isOpenFilter)}
                    />
                </Col>
                <Col
                    className='ml-auto'
                >
                    <Button
                        type='primary'
                        onClick={() => openModal(null)}
                    >
                        + Add
                    </Button>
                </Col>
            </Row>

            <CustomTable
                name="tasks"
                columns={tasksColumns(pageNumber, pageSize, deleteTask, deleteLoading, openModal, openStatusModal)}
                data={tasks}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                totalCount={totalCount}
                scrollY="60vh"
            />

            {/* TASKS MODAL */}
            {
                isOpenModal || view ? (
                    <TasksModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getTasks={getTasks}
                        editId={editId}
                    />
                ) : null
            }

            {/* TASK STATUS MODAL */}
            {
                isOpenStatusModal ? (
                    <TaskStatusModal
                        isOpenStatusModal={isOpenStatusModal}
                        setIsOpenStatusModal={setIsOpenStatusModal}
                        initialStatus={initialStatus}
                        taskId={taskId}
                        getTasks={getTasks}
                    />
                ) : null
            }
        </div>
    )
}

export default Tasks