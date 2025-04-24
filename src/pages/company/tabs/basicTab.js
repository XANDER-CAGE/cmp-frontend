import React, { useEffect, useState } from 'react';
import { 
  Button, 
  Col, 
  Form, 
  Input, 
  InputNumber, 
  Row, 
  Select, 
  Tooltip, 
  Card, 
  Divider, 
  Typography,
  Space,
  Alert
} from 'antd';
import { 
  MinusCircleOutlined, 
  PlusOutlined, 
  CopyOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  GlobalOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import { makeOptions } from '../../../utils';
import http from '../../../utils/axiosInterceptors';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

const BasicTab = (props) => {
  const { openedCompanyId, getInvoiceInfo } = props;
  const { companyId } = useParams();
  const [form] = Form.useForm();

  const [submitLoading, setSubmitLoading] = useState(false);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [company, setCompany] = useState();

  // Check if form has been modified
  const [isFormModified, setIsFormModified] = useState(false);

  // Get agents from API
  const getAgents = async () => {
    setAgentsLoading(true);
    try {
      const response = await http.get("Agents");
      setAgents(response?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setAgentsLoading(false);
    }
  };

  // Get company data by ID
  const getCompanyById = async () => {
    try {
      const response = await http.get(`Companies/${companyId || openedCompanyId}`);
      setCompany(response?.data);
      form.setFieldsValue({
        name: response?.data?.name,
        description: response?.data?.description,
        ownerNames: response?.data?.ownerNames,
        phoneNumbers: response?.data?.phoneNumbers,
        emails: response?.data?.emails,
        address: response?.data?.address,
        website: response?.data?.website,
        creditScore: response?.data?.creditScore,
        agentId: response?.data?.agentId,
        companyStatus: response?.data?.companyStatus,
        status: response?.data?.status,
        isTrusted: response?.data?.isTrusted,
        notes: response?.data?.notes,
        untrustedReason: response?.data?.untrustedReason
      });
      // Reset form modified state after loading data
      setIsFormModified(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Submit form data
  const submitForm = async (values) => {
    setSubmitLoading(true);
    try {
      const response = await http.put(`Companies/${companyId || openedCompanyId}/`, {
        ...values,
        id: companyId || openedCompanyId
      });
      if (response?.success) {
        toast.success(`Successfully updated!`);
        if (getInvoiceInfo) getInvoiceInfo();
        setIsFormModified(false);
      } else {
        toast.error(response?.error);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Copy agent name to clipboard
  const copyAgentName = () => {
    const agentId = form.getFieldValue('agentId');
    const agent = agents.find((agent) => agent.id === agentId);
    if (agent) {
      copyToClipboardFallback(agent.name);
    } else {
      toast.error('Agent not found!', {
        position: 'top-right',
      });
    }
  };

  // Fallback method to copy text to clipboard
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

      successful
        ? toast.success('Agent copied to clipboard!', {
            position: 'top-right',
          })
        : toast.error('Failed to copy!', {
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

  useEffect(() => {
    if (companyId || openedCompanyId) {
      getCompanyById().then(() => getAgents());
    }
    // eslint-disable-next-line
  }, [companyId, openedCompanyId]);

  // Watch form values to detect changes
  const handleFormChange = () => {
    setIsFormModified(true);
  };

  return (
    <Card className="shadow-sm">
      <Title level={4}>Company Information</Title>
      <Text type="secondary" className="block mb-6">
        Update the company's basic information, contact details and status.
      </Text>

      {isFormModified && (
        <Alert
          message="You have unsaved changes"
          description="Make sure to save your changes before leaving this tab."
          type="warning"
          showIcon
          className="mb-6"
          action={
            <Button type="primary" onClick={() => form.submit()}>
              Save Changes
            </Button>
          }
        />
      )}

      <Form
        name="companies-form"
        form={form}
        layout="vertical"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        style={{ maxWidth: 'none' }}
        onFinish={submitForm}
        onValuesChange={handleFormChange}
        autoComplete="off"
      >
        <Divider orientation="left">Basic Information</Divider>
        
        <Row gutter={24}>
          <Col lg={12} xs={24}>
            <Form.Item
              label="Company Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input company name!',
                },
              ]}
            >
              <Input 
                placeholder="Enter company name" 
                prefix={<TeamOutlined className="text-gray-400" />} 
              />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item
              label="Description"
              name="description"
            >
              <Input.TextArea 
                placeholder="Enter company description" 
                autoSize={{ minRows: 2, maxRows: 4 }}
              />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item
              label="Address"
              name="address"
            >
              <Input 
                placeholder="Enter address" 
                prefix={<HomeOutlined className="text-gray-400" />} 
              />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item
              label="Website"
              name="website"
            >
              <Input 
                placeholder="Enter website URL" 
                prefix={<GlobalOutlined className="text-gray-400" />} 
              />
            </Form.Item>
          </Col>

          <Col lg={8} xs={24}>
            <Form.Item
              label="Credit Score"
              name="creditScore"
            >
              <InputNumber 
                min={0} 
                max={999} 
                placeholder="Credit Score" 
                style={{ width: '100%' }} 
              />
            </Form.Item>
          </Col>

          <Col lg={8} xs={24}>
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
              />
            </Form.Item>
          </Col>

          <Col lg={8} xs={24}>
            <Form.Item
              label="Is Trusted"
              name="isTrusted"
            >
              <Select
                placeholder="Select trusted status"
                options={[
                  { 
                    value: true, 
                    label: (
                      <span>
                        <CheckCircleOutlined style={{ color: '#52c41a' }} /> Yes
                      </span>
                    )
                  },
                  { 
                    value: false, 
                    label: (
                      <span>
                        <CloseCircleOutlined style={{ color: '#ff4d4f' }} /> No
                      </span>
                    )
                  }
                ]}
                showSearch
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Owner Information</Divider>
        
        <Form.List name="ownerNames">
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  required={true}
                  key={field.key}
                  css={css`
                    .ant-form-item-control-input-content {
                      display: flex;
                    }
                    margin-bottom: 1rem !important;
                  `}
                >
                  <Form.Item validateTrigger={['onChange', 'onBlur']} {...field} noStyle>
                    <Input
                      prefix={<UserOutlined className="text-gray-400" />}
                      className="my-0 mr-2"
                      placeholder="Owner name"
                      style={{ width: 'calc(100% - 40px)' }}
                    />
                  </Form.Item>
                  {fields.length >= 1 ? (
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(field.name)}
                    />
                  ) : null}
                </Form.Item>
              ))}

              <Form.Item className="mb-4">
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '200px' }}
                  icon={<PlusOutlined />}
                >
                  Add Owner
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider orientation="left">Contact Information</Divider>
        
        <Space direction="vertical" className="w-full mb-4">
          <Text strong>Phone Numbers</Text>
          <Form.List name="phoneNumbers">
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    required={true}
                    key={field.key}
                    css={css`
                      .ant-form-item-control-input-content {
                        display: flex;
                      }
                      margin-bottom: 1rem !important;
                    `}
                  >
                    <Form.Item validateTrigger={['onChange', 'onBlur']} {...field} noStyle>
                      <Input
                        prefix={<PhoneOutlined className="text-gray-400" />}
                        className="my-0 mr-2"
                        placeholder="Phone number"
                        style={{ width: 'calc(100% - 40px)' }}
                      />
                    </Form.Item>
                    {fields.length >= 1 ? (
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(field.name)}
                      />
                    ) : null}
                  </Form.Item>
                ))}

                <Form.Item className="mb-4">
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '200px' }}
                    icon={<PlusOutlined />}
                  >
                    Add Phone Number
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Space>

        <Space direction="vertical" className="w-full mb-4">
          <Text strong>Email Addresses</Text>
          <Form.List name="emails">
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    required={true}
                    key={field.key}
                    css={css`
                      .ant-form-item-control-input-content {
                        display: flex;
                      }
                      margin-bottom: 1rem !important;
                    `}
                  >
                    <Form.Item validateTrigger={['onChange', 'onBlur']} {...field} noStyle>
                      <Input
                        prefix={<MailOutlined className="text-gray-400" />}
                        className="my-0 mr-2"
                        placeholder="Email address"
                        style={{ width: 'calc(100% - 40px)' }}
                      />
                    </Form.Item>
                    {fields.length >= 1 ? (
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(field.name)}
                      />
                    ) : null}
                  </Form.Item>
                ))}

                <Form.Item className="mb-4">
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '200px' }}
                    icon={<PlusOutlined />}
                  >
                    Add Email Address
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Space>

        <Divider orientation="left">Additional Information</Divider>
        
        <Row gutter={24}>
          <Col lg={12} xs={24}>
            <Form.Item
              label="Agent"
              name="agentId"
            >
              <div className="flex items-center">
                <Select
                  placeholder="Select an Agent"
                  options={makeOptions(agents, 'name')}
                  loading={agentsLoading}
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                  }
                  style={{ width: '100%' }}
                />
                <Tooltip title="Copy Agent name">
                  <Button 
                    className="ml-2" 
                    icon={<CopyOutlined />} 
                    onClick={copyAgentName} 
                  />
                </Tooltip>
              </div>
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item
              label="Notes"
              name="notes"
            >
              <Input.TextArea 
                placeholder="Enter notes" 
                autoSize={{ minRows: 2, maxRows: 4 }}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Untrusted Reason"
              name="untrustedReason"
              dependencies={['isTrusted']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue('isTrusted') === false && !value) {
                      return Promise.reject(new Error('Please provide a reason why this company is not trusted'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input.TextArea 
                placeholder="Explain why this company is not trusted" 
                autoSize={{ minRows: 2, maxRows: 4 }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Form.Item className="text-right mb-0">
          <Space>
            <Button 
              onClick={() => {
                form.resetFields();
                getCompanyById();
                setIsFormModified(false);
              }} 
              disabled={!isFormModified}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={submitLoading}
              disabled={!isFormModified}
            >
              Save Changes
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default BasicTab;