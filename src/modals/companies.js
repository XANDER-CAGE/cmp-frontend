// src/modals/companies.js - with RingCentral telephony integration
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import { css } from '@emotion/react';
import { makeOptions } from '../utils';
import { MdCopyAll } from 'react-icons/md';
import PhoneButton from '../components/PhoneButton';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import { t } from '../utils/transliteration';

const CompaniesModal = (props) => {
    const { isOpenModal, getCompanies, closeModal, editId, language } = props
    
    const [form] = Form.useForm()

    const [submitLoading, setSubmitLoading] = useState(false)

    const [agentsLoading, setAgentsLoading] = useState(false)
    const [agents, setAgents] = useState([])

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
            const response = await http.get(`Companies/${editId}`)
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
            form.setFieldValue('untrustedReason', response?.data?.untrustedReason)
        } catch (error) {
            console.log(error)
        }
    }

    const submitForm = async (values) => {
        setSubmitLoading(true)
        try {
            const response = editId ? await http.put(`Companies/${editId}/`, { ...values, id: editId }) : await http.post('Companies', values)
            if (response?.success) {
                toast.success(`Succesfully ${editId ? 'updated' : 'added'}!`)
                closeModal()
                getCompanies()
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
            getCompanyById()
        }

        // eslint-disable-next-line
    }, [editId])

    useEffect(() => {
        getAgents()
    }, [])

    return (
        <Modal
            open={isOpenModal}
            centered
            width={1000}
            title={`${editId ? t(translations, 'edit', language) : t(translations, 'add', language)} ${t(translations, 'company', language)}`}
            footer={[]}
            closeIcon={null}
        >
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
                            label={t(translations, 'name', language)}
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: t(translations, 'pleaseInputName', language),
                                },
                            ]}
                        >
                            <Input placeholder={t(translations, 'name', language)} />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label={t(translations, 'description', language)}
                            name="description"
                        >
                            <Input.TextArea placeholder={t(translations, 'description', language)} />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <label className={'mt-2 mb-2 block'}>{t(translations, 'ownerNames', language)}</label>
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
                                                    placeholder={t(translations, 'ownerName', language)}
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
                                            {t(translations, 'addOwner', language)}
                                        </Button>

                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Col>

                    <Col lg={12} xs={24}>
                        <label className={'mt-2 mb-2 block'}>{t(translations, 'phones', language)}</label>
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
                                            <Form.Item 
                                                validateTrigger={['onChange', 'onBlur']} 
                                                {...listField} 
                                                noStyle 
                                                shouldUpdate={(prevValues, currentValues) => {
                                                    return prevValues.phoneNumbers && currentValues.phoneNumbers &&
                                                        prevValues.phoneNumbers[index] !== currentValues.phoneNumbers[index];
                                                }}
                                            >
                                                {({ getFieldValue }) => {
                                                    const phoneNumbers = getFieldValue('phoneNumbers') || [];
                                                    const currentPhone = phoneNumbers[index];
                                                    
                                                    return (
                                                        <Input
                                                            type='text'
                                                            className="my-0 mr-2"
                                                            placeholder={t(translations, 'phoneNumber', language)}
                                                            style={{ width: 'calc(100% - 30px)' }}
                                                            suffix={
                                                                currentPhone ? (
                                                                    <PhoneButton 
                                                                        phoneNumber={currentPhone} 
                                                                        size="small"
                                                                    />
                                                                ) : null
                                                            }
                                                        />
                                                    );
                                                }}
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
                                            {t(translations, 'addPhone', language)}
                                        </Button>

                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Col>

                    <Col lg={12} xs={24} className='mb-5'>
                        <label className={'mt-2 mb-2 block'}>{t(translations, 'emails', language)}</label>
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
                                                    placeholder={t(translations, 'email', language)}
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
                                            {t(translations, 'addEmail', language)}
                                        </Button>

                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label={t(translations, 'address', language)}
                            name="address"
                        >
                            <Input placeholder={t(translations, 'address', language)} />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label={t(translations, 'website', language)}
                            name="website"
                        >
                            <Input placeholder={t(translations, 'website', language)} />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label={t(translations, 'creditScore', language)}
                            name="creditScore"
                        >
                            <Input placeholder={t(translations, 'creditScore', language)} />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label={t(translations, 'agents', language)}
                            name="agentId"
                        >
                            <Select
                                placeholder={t(translations, 'selectAgent', language)}
                                options={makeOptions(agents, 'name')}
                                loading={agentsLoading}
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
                            label={t(translations, 'status', language)}
                            name="companyStatus"
                        >
                            <Select
                                placeholder={t(translations, 'selectStatus', language)}
                                options={[
                                    { value: "Active", label: t(translations, 'statusActive', language) },
                                    { value: "Inactive", label: t(translations, 'statusInactive', language) }
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
                            label={t(translations, 'isTrusted', language)}
                            name="isTrusted"
                        >
                            <Select
                                placeholder={t(translations, 'select', language)}
                                options={[
                                    { value: true, label: t(translations, 'yes', language) },
                                    { value: false, label: t(translations, 'no', language) }
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
                            label={t(translations, 'notes', language)}
                            name="notes"
                        >
                            <Input.TextArea placeholder={t(translations, 'notes', language)} />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label={t(translations, 'untrustedReason', language)}
                            name="untrustedReason"
                        >
                            <Input.TextArea placeholder={t(translations, 'untrustedReason', language)} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col className='ml-auto'>
                        <Button className='mr-3' onClick={closeModal}>{t(translations, 'cancel', language)}</Button>
                        <Button htmlType='submit' type='primary' loading={submitLoading}>
                            {editId ? t(translations, 'update', language) : t(translations, 'add', language)}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default CompaniesModal