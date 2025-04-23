import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Table } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import { makeOptions } from '../utils'

const RolesModal = (props) => {
    const { isOpenModal, getRoles, closeModal, editId, systemRoles } = props

    const [form] = Form.useForm()

    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [allPermissions, setAllPermissions] = useState([])
    const [permissionsLoading, setPermissionsLoading] = useState(false)
    const [checkeds, setCheckeds] = useState({})
    const [allSelectedRoles, setAllSelectedRoles] = useState([])
    const [isView, setIsView] = useState(false)

    const permissionsColumns = useMemo(
        () => [
            {
                title: `#`,
                key: 'numberOfRow',
                fixed: 'left',
                align: 'center',
                width: 50,
                render: (text, obj, index) => {
                    return (
                        <span> {(pageNumber - 1) * pageSize + index + 1} </span>
                    )
                },
                checked: true,
            },
            {
                title: `Name`,
                dataIndex: 'name',
                key: 'name',
                type: 'string',
                align: 'center',
                width: 250,
                checked: true,
            },
            {
                title: `Description`,
                dataIndex: 'description',
                key: 'description',
                type: 'string',
                align: 'center',
                width: 250,
                checked: true,
            },
            {
                title: `check`,
                key: 'check',
                dataIndex: 'id',
                fixed: 'right',
                align: 'center',
                width: 50,
                render: (id, row) => {
                    return <Checkbox disabled={isView} checked={checkeds ? !!checkeds[id] : false}></Checkbox>
                },
                checked: true,
            },
        ], [pageNumber, pageSize, checkeds, isView]
    )

    const getPermissions = async () => {
        setPermissionsLoading(true)
        try {
            const response = await http.get("Permissions")
            setAllPermissions(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setPermissionsLoading(false)
        }
    }

    const getRoleById = async () => {
        try {
            const response = await http.get(`Roles/${editId}`)
            setIsView(response?.data?.isSystemRole)
            form.setFieldValue('name', response?.data?.name)
            form.setFieldValue('description', response?.data?.description)
            const pers = response?.data?.permissions.reduce(
                (obj, value) => ({ ...obj, [value.id]: value.name }),
                {},
            )
            setCheckeds(pers)
        } catch (error) {
            console.log(error)
        }
    }

    const submitForm = async (values) => {
        setSubmitLoading(true)
        const data = { ...values, permissions: Object.values(checkeds).filter((value) => !!value), systemRoles: null }
        try {
            const response = editId ? await http.put(`Roles/${editId}/`, { ...data, id: editId }) : await http.post('Roles', data)
            if (response?.success) {
                toast.success(`Succesfully ${editId ? 'updated' : 'added'}!`)
                closeModal()
                getRoles()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setSubmitLoading(false)
        }
    }

    const setSelectedRole = (id, type) => {
        systemRoles?.forEach((item) => {
            if (id === item?.id) {
                if (type === 'add') {
                    const pers = item?.permissions?.reduce(
                        (obj, value) => ({ ...obj, [value.id]: value.name }),
                        {},
                    );
                    setCheckeds(pers)
                } else {
                    setCheckeds(
                        item?.permissions?.forEach((p) => {
                            delete checkeds[p?.id]
                        }),
                    );
                }
            }
        });
    }

    useEffect(() => {
        if (editId) {
            getRoleById()
        }

        // eslint-disable-next-line
    }, [editId])

    useEffect(() => {
        let allPermissions = []

        systemRoles?.forEach((item) => {
            if (allSelectedRoles?.includes(item?.id)) {
                allPermissions.push(...item?.permissions)
                const pers = allPermissions?.reduce(
                    (obj, value) => ({ ...obj, [value.id]: value.name }),
                    {},
                );
                setCheckeds(pers)
            }
        })

    }, [allSelectedRoles, systemRoles])

    useEffect(() => {
        getPermissions()
    }, [])

    return (
        <Modal
            open={isOpenModal}
            centered
            width={1000}
            title={`${editId ? (isView ? "View" : "Edit") : "Add"} Role`}
            footer={[]}
            closeIcon={null}
        >
            <Form
                name="role-modal"
                form={form}
                layout='vertical'
                labelCol={{
                    span: 24,
                }}
                wrapperCol={{
                    span: 24,
                }}
                style={{ maxWidth: 'none' }}
                initialValues={{
                    remember: true,
                }}
                onFinish={submitForm}
                autoComplete="off"
            >
                <Row
                    gutter={{
                        xs: 8,
                        sm: 16,
                        md: 24,
                        lg: 32,
                    }}
                >
                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input name!',
                                },
                            ]}
                        >
                            <Input placeholder='Name' disabled={isView} />
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="System Roles"
                            name="systemRoles"
                        >
                            <Select
                                placeholder="System Roles"
                                value={allSelectedRoles}
                                options={makeOptions(systemRoles, 'name')}
                                onChange={(value) => {
                                    setAllSelectedRoles(value);
                                }}
                                onSelect={(value) => {
                                    setSelectedRole(value, 'add');
                                }}
                                onDeselect={(value) => {
                                    setSelectedRole(value, 'remove');
                                }}
                                showSearch
                                mode="multiple"
                                disabled={isView}
                            />
                        </Form.Item>
                    </Col>

                    <Col lg={24} xs={24}>
                        <Table
                            dataSource={allPermissions}
                            columns={permissionsColumns}
                            loading={permissionsLoading}
                            rowKey={"id"}
                            size='small'
                            pagination={{ defaultPageSize: pageSize, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100'] }}
                            onChange={(e) => {
                                setPageNumber(e.current)
                                setPageSize(e.pageSize)
                            }}
                            scroll={{
                                y: '400px'
                            }}
                            onRow={(row) => {
                                return {
                                    onClick: () => {
                                        if (!isView) {
                                            setCheckeds({ ...checkeds, [row?.id]: !checkeds[row?.id] ? row?.name : undefined })
                                        }
                                    }
                                };
                            }}
                        />
                    </Col>
                    <Col lg={24} xs={24}>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input description!',
                                },
                            ]}
                        >
                            <Input.TextArea placeholder='Description' disabled={isView} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col className='ml-auto'>
                        <Button className='mr-3' onClick={closeModal}>Cancel</Button>
                        <Button htmlType='submit' type='primary' loading={submitLoading} disabled={isView}>
                            {editId ? "Update" : "Add"}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default RolesModal