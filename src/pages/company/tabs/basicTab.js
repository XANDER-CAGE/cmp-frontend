import { Button, Col, Form, Input, InputNumber, Row, Select, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify'
import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import { makeOptions } from '../../../utils';
import http from '../../../utils/axiosInterceptors';
import { MdContentCopy, MdCopyAll } from 'react-icons/md';
import { FaLongArrowAltLeft } from 'react-icons/fa';

const BasicTab = (props) => {
    const { openedCompanyId, getInvoiceInfo } = props
    const { companyId } = useParams()
    const [form] = Form.useForm()

    const [submitLoading, setSubmitLoading] = useState(false)

    const [agentsLoading, setAgentsLoading] = useState(false)
    const [agents, setAgents] = useState([])
    const [company, setCompany] = useState()

    const getAgents = async () => {
        setAgentsLoading(true)
        try {
            const response = await http.get("Agents")
            setAgents(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setAgentsLoading(false)
        }
    }

    const getCompanyById = async () => {
        try {
            const response = await http.get(`Companies/${companyId || openedCompanyId}`)
            setCompany(response?.data)
            form.setFieldValue('name', response?.data?.name)
            form.setFieldValue('description', response?.data?.description)
            form.setFieldValue('ownerNames', response?.data?.ownerNames)
            form.setFieldValue('phoneNumbers', response?.data?.phoneNumbers)
            form.setFieldValue('emails', response?.data?.emails)
            form.setFieldValue('address', response?.data?.address)
            form.setFieldValue('website', response?.data?.website)
            form.setFieldValue('creditScore', response?.data?.creditScore)
            form.setFieldValue('agentId', response?.data?.agentId)
            form.setFieldValue('companyStatus', response?.data?.companyStatus)
            form.setFieldValue('status', response?.data?.status)
            form.setFieldValue('isTrusted', response?.data?.isTrusted)
            form.setFieldValue('notes', response?.data?.notes)
            form.setFieldValue('untrustedReason', response?.data?.untrustedReason)
        } catch (error) {
            console.log(error)
        }
    }

    const submitForm = async (values) => {
        setSubmitLoading(true)
        try {
            const response = await http.put(`Companies/${companyId || openedCompanyId}/`, { ...values, id: companyId || openedCompanyId })
            if (response?.success) {
                toast.success(`Succesfully ${companyId ? 'updated' : 'added'}!`)
                getInvoiceInfo()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setSubmitLoading(false)
        }
    }

    const copyAgentName = () => {
        const agentId = form.getFieldValue('agentId');
        const agent = agents.find((agent) => agent.id === agentId);
        if (agent) {
            copyToClipboardFallback(agent.name);
        }else{
            toast.error('Agent not found!', {
                position: 'top-right',
            });
        }
    };

    const copyToClipboardFallback = (text) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');

            successful ? toast.success('Agent copied to clipboard!', {
                  position: 'top-right',
              }) :
              toast.error('Failed to copy!', {
                  position: 'top-right',
              });
        } catch (err) {
            toast.error('Failed to copy!', {
                position: 'top-right',
            });
        } finally {
            document.body.removeChild(textArea);
        }
    };

    const newOptions = [
        ...makeOptions(agents, 'name'),
        { label: company?.agent?.name, value: company?.agent?.id }
    ]

    const isExist = makeOptions(agents, 'name').some(c => c.value === company?.agent?.id)

    useEffect(() => {
        if (companyId || openedCompanyId) {
            getCompanyById().then(() => getAgents())
        }

        // eslint-disable-next-line
    }, [companyId, openedCompanyId])

    return (
        <div>
            <Form
                name="companies-modal"
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
                            <Input placeholder='Name' />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Description"
                            name="description"
                        >
                            <Input.TextArea placeholder='Description' />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <label className={'mt-2 mb-2 block'}>Owner Names</label>
                        <Form.List key="ownerNames" name="ownerNames">
                            {(listFields, { add, remove }, { errors }) => (
                                <>
                                    {listFields.map((listField, index) => (
                                        <Form.Item
                                            required={true}
                                            key={listField.key}
                                            css={css`
                                                .ant-form-item-control-input-content {
                                                    display: flex;
                                                }
                                                margin-bottom: 1rem !important;
                                            `}
                                        >
                                            <Form.Item validateTrigger={['onChange', 'onBlur']} {...listField} noStyle>
                                                <Input
                                                    type='text'
                                                    className="my-0 mr-2"
                                                    placeholder="Phone number"
                                                    style={{ width: 'calc(100% - 30px)' }}
                                                />
                                            </Form.Item>
                                            {listFields.length >= 1 ? (
                                                <MinusCircleOutlined
                                                    className="dynamic-delete-button"
                                                    onClick={() => remove(listField.name)}
                                                />
                                            ) : null}
                                        </Form.Item>
                                    ))}

                                    <Form.Item className={'mb-2'}>
                                        <Button type="dashed" onClick={() => add()} style={{ width: '150px' }} icon={<PlusOutlined />}>
                                            Add Owner
                                        </Button>

                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Col>

                    <Col lg={12} xs={24}>
                        <label className={'mt-2 mb-2 block'}>Phones</label>
                        <Form.List key="phoneNumbers" name="phoneNumbers">
                            {(listFields, { add, remove }, { errors }) => (
                                <>
                                    {listFields.map((listField, index) => (
                                        <Form.Item
                                            required={true}
                                            key={listField.key}
                                            css={css`
                                                .ant-form-item-control-input-content {
                                                    display: flex;
                                                }
                                                margin-bottom: 1rem !important;
                                            `}
                                        >
                                            <Form.Item validateTrigger={['onChange', 'onBlur']} {...listField} noStyle>
                                                <Input
                                                    type='text'
                                                    className="my-0 mr-2"
                                                    placeholder="Phone number"
                                                    style={{ width: 'calc(100% - 30px)' }}
                                                />
                                            </Form.Item>
                                            {listFields.length >= 1 ? (
                                                <MinusCircleOutlined
                                                    className="dynamic-delete-button"
                                                    onClick={() => remove(listField.name)}
                                                />
                                            ) : null}
                                        </Form.Item>
                                    ))}

                                    <Form.Item className={'mb-2'}>
                                        <Button type="dashed" onClick={() => add()} style={{ width: '150px' }} icon={<PlusOutlined />}>
                                            Add phone
                                        </Button>

                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Col>

                    <Col lg={12} xs={24} className='mb-5'>
                        <label className={'mt-2 mb-2 block'}>Emails</label>
                        <Form.List key="emails" name="emails">
                            {(listFields, { add, remove }, { errors }) => (
                                <>
                                    {listFields.map((listField, index) => (
                                        <Form.Item
                                            required={true}
                                            key={listField.key}
                                            css={css`
                                                .ant-form-item-control-input-content {
                                                    display: flex;
                                                }
                                                margin-bottom: 1rem !important;
                                            `}
                                        >
                                            <Form.Item validateTrigger={['onChange', 'onBlur']} {...listField} noStyle>
                                                <Input
                                                    type='text'
                                                    className="my-0 mr-2"
                                                    placeholder="Email"
                                                    style={{ width: 'calc(100% - 30px)' }}
                                                />
                                            </Form.Item>
                                            {listFields.length >= 1 ? (
                                                <MinusCircleOutlined
                                                    className="dynamic-delete-button"
                                                    onClick={() => remove(listField.name)}
                                                />
                                            ) : null}
                                        </Form.Item>
                                    ))}

                                    <Form.Item className={'mb-2'}>
                                        <Button type="dashed" onClick={() => add()} style={{ width: '150px' }} icon={<PlusOutlined />}>
                                            Add email
                                        </Button>

                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Address"
                            name="address"
                        >
                            <Input placeholder='Address' />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Website"
                            name="website"
                        >
                            <Input placeholder='Website' />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Credit Score"
                            name="creditScore"
                        >
                            <InputNumber required min={0} max={999} placeholder='Credit Score' />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <div className="flex items-center" style={{ width: '100%' }}>
                            <Form.Item
                              style={{ flexGrow: 1 }}
                              label="Agents"
                              name="agentId"
                            >
                                <Select
                                  className="mr-2"
                                  placeholder="Select an Agent"
                                  options={makeOptions(agents, 'name')}
                                  loading={agentsLoading}
                                  showSearch
                                  allowClear
                                  filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                  }
                                />
                            </Form.Item>
                            <Tooltip title="Copy Agent name">
                                <Button className='ml-3 mt-1.5' icon={<MdContentCopy />} onClick={copyAgentName} />
                            </Tooltip>
                        </div>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Status"
                            name="companyStatus"
                        >
                            <Select
                                placeholder="Select a Status"
                                options={[
                                    { value: "Active", label: "Active" },
                                    { value: "Inactive", label: "Inactive" }
                                ]}
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Is Trusted"
                            name="isTrusted"
                        >
                            <Select
                                placeholder="Select"
                                options={[
                                    { value: true, label: "Yes" },
                                    { value: false, label: "No" }
                                ]}
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Notes"
                            name="notes"
                        >
                            <Input.TextArea placeholder='Notes' />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Untrusted Reason"
                            name="untrustedReason"
                        >
                            <Input.TextArea placeholder='Untrusted Reason' />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col className='ml-auto'>
                        <Button htmlType='submit' type='primary' loading={submitLoading}>
                            {companyId || openedCompanyId ? "Update" : "Add"}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default BasicTab