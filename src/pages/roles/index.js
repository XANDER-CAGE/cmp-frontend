import React, { useEffect, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { Button, Col, Row, Tabs } from 'antd'
import { toast } from 'react-toastify';
import RolesModal from '../../modals/roles';
import { rolesColumns } from '../../sources/columns/rolesColumns';

const Roles = () => {
    const [systemRoles, setSystemRoles] = useState([])
    const [manuallyRoles, setManuallyRoles] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [isLoading, setIsLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [editId, setEditId] = useState(null)
    const [tabType, setTabType] = useState("system")

    const items = [
        {
            key: 'system',
            label: 'System',
        },
        {
            key: 'manually',
            label: 'Manually',
        },
    ]

    const openModal = (id) => {
        setIsOpenModal(true)
        setEditId(id)
    }

    const closeModal = () => {
        setIsOpenModal(false)
        setEditId(null)
    }

    const getRoles = async () => {
        setIsLoading(true)
        try {
            const response = await http.get("Roles")
            setSystemRoles(response?.data?.filter(item => item.isSystemRole))
            setManuallyRoles(response?.data?.filter(item => !item.isSystemRole))
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteRole = async (id) => {
        setDeleteLoading(true)
        try {
            const response = await http.delete(`Roles/${id}`)
            if (response?.success) {
                toast.success('Succesfully deleted!')
                getRoles()
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
        getRoles()
    }, [])

    return (
        <div className='box'>
            <Tabs
                items={items}
                onChange={(e) => setTabType(e)}
                defaultActiveKey={tabType}
            />

            {
                tabType === "system" ? null : (
                    <Row className='mb-5'>
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
                )
            }

            <CustomTable
                name="roles"
                columns={rolesColumns(pageNumber, pageSize, tabType, openModal, deleteRole, deleteLoading)}
                data={tabType === "system" ? systemRoles : manuallyRoles}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                scrollY="60vh"
            />

            {/* ROLE MODAL */}
            {
                isOpenModal ? (
                    <RolesModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getRoles={getRoles}
                        editId={editId}
                        systemRoles={systemRoles}
                    />
                ) : null
            }
        </div>
    )
}

export default Roles