import { Button, Col, DatePicker, Form, Modal, Row } from 'antd'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import { useState } from 'react';

const { RangePicker } = DatePicker

const ExportTransactionsModal = (props) => {
    const { isOpenExportTransactionsModal, setIsOpenExportTransactionsModal } = props

    const [form] = Form.useForm()

    const [isLoading, setIsLoading] = useState(false)

    const [dateStrings, setDateStrings] = useState([])
    const [dateRangeValue, setDateRangeValue] = useState(undefined)
    const onChangeRange = (dates, dateStrings) => {
        setDateRangeValue(dates)

        if(dateStrings[0] === '' && dateStrings[1] === '') {
            setDateStrings([])
        }
        else {
            setDateStrings(dateStrings)
        }
    };

    const submitForm = async (values) => {
        setIsLoading(true)
        try {
            const response = await http.post('/Export/transactions', {
                startDate: dateStrings[0],
                endDate: dateStrings[1]
            }, {
                responseType: 'arraybuffer',
            })
            const fileName = `TransactionsExport_[${dateStrings[0]} ${dateStrings[1]}].xlsx`

            const url = window.URL.createObjectURL(
                new Blob([response], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                }),
            )
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            return 1
        } catch (error) {
            console.log(error)
            toast.error('No transactions Found!')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal
            open={isOpenExportTransactionsModal}
            width={600}
            title={`Export Transactions`}
            footer={[]}
            closeIcon={null}
        >
            <Form
                name="companyAccounts-modal"
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
                    <Col span={24}>
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
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col className='ml-auto'>
                        <Button className='mr-3' disabled={isLoading} onClick={() => setIsOpenExportTransactionsModal(false)}>Close</Button>
                        <Button type='primary' htmlType='submit' loading={isLoading} disabled={isLoading}>Download</Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default ExportTransactionsModal