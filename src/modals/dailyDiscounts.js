import { Button, Col, DatePicker, Form, Input, Modal, Popconfirm, Row } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import { QuestionCircleOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker

const DailyDiscountsModal = (props) => {
    const { isOpenModal, getDailyDiscounts, closeModal, editData } = props

    const [form] = Form.useForm()

    const [discount, setDiscount] = useState(0)
    const [submitLoading, setSubmitLoading] = useState(false)
    const defaultDates = useMemo(() => [dayjs(), dayjs().add(1, 'month')], [])
    const [dateStrings, setDateStrings] = useState(
        defaultDates.map((date) => date.format('YYYY-MM-DD')),
    )
    const [dateRangeValue, setDateRangeValue] = useState(defaultDates)
    const onChangeRange = (dates, dateStrings) => {
        setDateRangeValue(dates)

        if(dateStrings[0] === '' && dateStrings[1] === '') {
            setDateStrings([])
        }
        else {
            setDateStrings(dateStrings)
        }
    };

    const submitForm = async () => {
        setSubmitLoading(true)
        const data = {
            discount,
            from: dateStrings ? dateStrings[0] : null,
            to: dateStrings ? dateStrings[1] : null
        }
        try {
            const response = editData ? await http.put(`DailyUpToDiscounts/list`, data) : await http.post('DailyUpToDiscounts/list', data)

            if (response?.success) {
                toast.success(`Succesfully ${editData ? 'updated' : 'added'}!`)
                closeModal()
                getDailyDiscounts()
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
        if (editData) {
            setDiscount(editData?.discount)
            setDateRangeValue([dayjs(editData?.fromDate), dayjs(editData?.toDate)])
            setDateStrings([editData?.fromDate, editData?.toDate])
        }
    }, [editData, form])

    return (
        <Modal
            open={isOpenModal}
            width={500}
            title={`${editData ? "Edit" : "Add"} Daily Discount`}
            footer={[]}
            closeIcon={null}
        >
            <Form
                name="daily-discount-modal"
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
                            label="Discount"
                        >
                            <Input
                                type='number'
                                placeholder='Discount'
                                value={discount}
                                onChange={e => setDiscount(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={24} xs={24}>
                        <Form.Item
                            label="Period"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select period!',
                                },
                            ]}
                        >
                            <RangePicker
                                onChange={onChangeRange}
                                value={dateRangeValue}
                                className='w-[100%]'
                                disabled={!!editData}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col className='ml-auto'>
                        <Button className='mr-3' onClick={closeModal}>Cancel</Button>
                        <Popconfirm
                            isLoading={submitLoading}
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            title={(
                                <>
                                    The line maybe contains the generated customer invoice.
                                    <br />
                                    Are you confirming that you want to perform this action?
                                </>
                            )}
                            onConfirm={submitForm}
                            okText="Yes"
                            cancelText="No"
                            className={'shadow-lg overflow-hidden'}
                        >
                            <Button type='primary'>
                                {editData ? "Update" : "Add"}
                            </Button>
                        </Popconfirm>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default DailyDiscountsModal