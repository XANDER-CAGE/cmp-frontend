import { Button, Form, Input, Modal, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import http from '../utils/axiosInterceptors';

const MaintenanceInvoiceAttachInnerModal = (props) => {
    const { isOpenModal, maintenanceId, getMaintenanceInvoiceAttachmentsById, editId, closeModal } = props
    const [dataById, setDataById] = useState({})

    const [isLoading, setIsLoading] = useState(false)

    const [form] = Form.useForm()

    const getDataById = async () => {
        try {
            const response = await http.get(`/MaintenanceInvoiceAttachments/${editId}`)
            setDataById(response?.data)
            form.setFieldsValue(response?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const submitForm = async (values) => {
        setIsLoading(true)
        const formData = new FormData();

        // UPDATING
        if (editId) {
            // EDIT FILE
            if (values.file) {
                formData.append('file', values.file[0].originFileObj)
                try {
                    const response = await http.put(`/MaintenanceInvoiceAttachments/${editId}/file`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                    if (response.success) {
                        toast.success("Succesfully updated file!")
                        closeModal()
                        getMaintenanceInvoiceAttachmentsById()
                    } else {
                        toast.error(response?.error)
                    }
                } catch (error) {
                    toast.error('An error occured')
                }
            }
            if (values.notes && dataById?.notes !== values?.notes) {
                formData.append('notes', values.notes);
                try {
                    const response = await http.put(`/MaintenanceInvoiceAttachments/${editId}`, formData)
                    if (response.success) {
                        toast.success("Succesfully updated notes!")
                        closeModal()
                        getMaintenanceInvoiceAttachmentsById()
                    } else {
                        toast.error(response?.error)
                    }
                } catch (error) {
                    toast.error('An error occured')
                }
            }
        }

        // CREATING
        else {
            if (values.file) {
                formData.append('file', values.file[0].originFileObj)
            }
            if (values.notes) {
                formData.append('notes', values.notes);
            }
            try {
                const response = await http.post(`/MaintenanceInvoiceAttachments/${maintenanceId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                if (response?.success) {
                    toast.success("Succesfully!")
                    closeModal()
                    getMaintenanceInvoiceAttachmentsById()
                } else {
                    toast.error(response?.error)
                }
            } catch (error) {
                toast.error("An error occured")
            }
        }

        setIsLoading(false)
    }

    useEffect(() => {
        if (editId) {
            getDataById()
        }
        //eslint-disable-next-line
    }, [editId])

    return (
        <Modal
            open={isOpenModal}
            centered
            width={500}
            onCancel={closeModal}
            title={`Maintenance Invoice Attachment`}
            footer={[]}
            closeIcon={null}
        >
            <Form
                name="maintenance-invoice-attach-modal"
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
                <Form.Item
                    name="file"
                    label="Upload File"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e?.fileList}
                // rules={[{ required: true, message: 'Please upload a file!' }]}
                >
                    <Upload beforeUpload={() => false} maxCount={1}>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    label="Notes"
                    name="notes"
                >
                    <Input.TextArea rows={2} />
                </Form.Item>

                <div className='text-right'>
                    <Button onClick={closeModal}>Cancel</Button>
                    <Button type='primary' htmlType='submit' className='ml-3' loading={isLoading}>
                        {editId ? "Update" : "Save"}
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default MaintenanceInvoiceAttachInnerModal