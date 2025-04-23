import { Button, Form, Input, Modal, Select, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { makeOptions } from '../utils'
import { toast } from 'react-toastify'

const Text = Typography

const AttachToCompany = (props) => {
    const {
        isOpenModal,
        onSuccess,
        setIsOpenModal,
        issuedTo,
        attachedCompanyName,
        attachedCompanyId,
        selectAttachment = true,
        refNo,
        moneyCodeId,
        attachmentType,
        isUncheckedMoneyCode = false
    } = props;

    const [companiesLoading, setCompaniesLoading] = useState(false)
    const [companies, setCompanies] = useState([])
    const [companySearch, setCompanySearch] = useState(null)
    const [attachLoading, setAttachLoading] = useState(false)

    const [form] = Form.useForm();

    const closeModal = () => {
        setIsOpenModal(false)
    }

    const getCompanies = async () => {
        setCompaniesLoading(true)
        try {
            const response = await http.post("Companies/discounting/filter/v2", {
                pagination: {
                    pageNumber: 1,
                    pageSize: 20
                },
                searchTerm: companySearch
            })
            setCompanies(response?.data?.items)
        } catch (error) {
            console.log(error)
        } finally {
            setCompaniesLoading(false)
        }
    }

    const attachCompany = async (values) => {
        const data = {
            moneyCodeId,
            ...values
        }

        setAttachLoading(true)

        try {
            const response = isUncheckedMoneyCode ?
              await http.post(`/EfsMoneyCodes/attach-to-company/${moneyCodeId}`, data) :
              await http.post(`/MoneyCodes/attach-to-company/${moneyCodeId}`, data);

            if (response?.success) {
                toast.success('Attached Succesfully!')
                onSuccess()
                closeModal()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setAttachLoading(false)
        }
    }

    useEffect(() => {
        form.setFieldValue('refNo', refNo)
        form.setFieldValue('issuedTo', issuedTo)
        form.setFieldValue('attachedCompanyId', attachedCompanyId)
        form.setFieldValue('attachmentType', attachmentType ?? 'OneTime')
    }, [attachedCompanyId])

    useEffect(() => {
        getCompanies()

        // eslint-disable-next-line
    }, [companySearch])

    const newOptions = [
        ...makeOptions(companies, 'name'),
        { label: attachedCompanyName, value: attachedCompanyId }

    ]

    const isExist = makeOptions(companies, 'name').some(c => c.value === attachedCompanyId)

    return (
        <Modal
            open={isOpenModal}
            footer={[]}
            title={`Attach To Company`}
            width={500}
        >
            <Form
              form={form}
              onFinish={attachCompany}
              layout="vertical"
              autoComplete="off">
                <Form.Item name={'refNo'}  label={<Text className={'font-bold'}>Ref No</Text>}>
                    <Input readOnly />
                </Form.Item>

                <Form.Item name={'issuedTo'} label={<Text className={'font-bold'}>Issued To</Text>}>
                    <Input readOnly />
                </Form.Item>

                <Form.Item
                  label={<Text className={'font-bold'}>Attachment Type</Text>}
                  name="attachmentType"
                >
                    <Select
                      placeholder="Attachment Type"
                      disabled={!selectAttachment}
                      options={[
                          { value: 'OneTime', label: 'One Time' },
                          { value: 'Always', label: 'Always' },
                      ]}
                    />
                </Form.Item>

            <Form.Item
                rules={[
                    {
                        required: true,
                        message: 'Please select a company!',
                    },
                ]}
                name={'attachedCompanyId'}
                label={<Text className={'font-bold'}>Company</Text>}
            >
                <Select
                    placeholder="Company"
                    options={attachedCompanyId && !isExist ? newOptions : makeOptions(companies, 'name')}
                    loading={companiesLoading}
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                        (option?.label || '').toLowerCase().includes(input.toLowerCase())
                    }
                    onSearch={e => setCompanySearch(e)}
                    width={'100%'}
                />
            </Form.Item>

            <div className='text-right'>
                <Button onClick={closeModal}>Cancel</Button>
                <Button type='primary' className='ml-3' htmlType="submit" loading={attachLoading}>Attach</Button>
            </div>
            </Form>
        </Modal>
    )
}

export default AttachToCompany