import { Button, Col, Form, Input, Modal, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import { makeOptions } from '../utils'
import queryString from 'query-string'

const StationsModal = (props) => {
    const { isOpenModal, getStations, closeModal, editId } = props

    const { stationName, state, city } = queryString.parse(window.location.search)

    const [form] = Form.useForm()

    const [submitLoading, setSubmitLoading] = useState(false)
    const [stationChainsLoading, setStationChainsLoading] = useState(false)
    const [stationChains, setStationChains] = useState([])

    const getStationChains = async () => {
        setStationChainsLoading(true)
        try {
            const response = await http.get("StationChains")
            setStationChains(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setStationChainsLoading(false)
        }
    }

    const getStationsById = async () => {
        try {
            const response = await http.get(`Stations/${editId}`)
            form.setFieldValue('name', response?.data?.name)
            form.setFieldValue('description', response?.data?.description)
            form.setFieldValue('status', response?.data?.status)
            form.setFieldValue('chainId', response?.data?.chainId)
            form.setFieldValue('state', response?.data?.state)
            form.setFieldValue('city', response?.data?.city)
        } catch (error) {
            console.log(error)
        }
    }

    const submitForm = async (values) => {
        setSubmitLoading(true)
        try {
            const response = editId ? await http.put(`Stations/${editId}/`, { ...values, id: editId }) : await http.post('Stations', values)
            if (response?.success) {
                toast.success(`Succesfully ${editId ? 'updated' : 'added'}!`)
                closeModal()
                getStations()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setSubmitLoading(false)
        }
    }

    useEffect(() => {
        if (editId) {
            getStationsById()
        }

        // eslint-disable-next-line
    }, [editId])

    useEffect(() => {
        getStationChains()
    }, [])

    useEffect(() => {
        form.setFieldValue('name', stationName)
        form.setFieldValue('state', state)
        form.setFieldValue('city', city)

    }, [stationName, state, city, form])

    return (
        <Modal
            open={isOpenModal}
            centered
            width={600}
            title={`${editId ? "Edit" : "Add"} Stations`}
            footer={[]}
            closeIcon={null}
        >
            <Form
                name="station-modal"
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
                    <Col lg={24} xs={24}>
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
                            <Input placeholder='Name' disabled={!!stationName} />
                        </Form.Item>
                    </Col>
                    <Col lg={24} xs={24}>
                        <Form.Item
                            label="Description"
                            name="description"
                        >
                            <Input.TextArea placeholder='Description' />
                        </Form.Item>
                    </Col>
                    <Col lg={24} xs={24}>
                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a status!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select a status"
                                options={[
                                    { value: "NonDiscount", label: "NonDiscount" },
                                    { value: "Discount", label: "Discount" }
                                ]}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={24} xs={24}>
                        <Form.Item
                            label="Station Chain"
                            name="chainId"
                        >
                            <Select
                                placeholder="Select a station chain"
                                options={makeOptions(stationChains, 'name')}
                                allowClear
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                                loading={stationChainsLoading}
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={24} xs={24}>
                        <Form.Item
                            label="State"
                            name="state"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input state!',
                                },
                            ]}
                        >
                            <Input placeholder='State' disabled={!!state} />
                        </Form.Item>
                    </Col>
                    <Col lg={24} xs={24}>
                        <Form.Item
                            label="City"
                            name="city"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input city!',
                                },
                            ]}
                        >
                            <Input placeholder='City' disabled={!!city} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col className='ml-auto'>
                        <Button className='mr-3' onClick={closeModal}>Cancel</Button>
                        <Button htmlType='submit' type='primary' loading={submitLoading}>
                            {editId ? "Update" : "Add"}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default StationsModal