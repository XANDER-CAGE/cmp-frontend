import { Button, Col, Form, Input, Modal, Row } from 'antd';
import http from '../utils/axiosInterceptors';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';

const ResetPassword = (props) => {
  const { isOpenModal, closeModal, resetPasswordUserId, resetPasswordUserName } = props;
  const [form] = Form.useForm();
  const [token, setToken] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submittable, setSubmittable] = useState(false);

  const values = Form.useWatch([], form);


  const generateResetPasswordToken = async () => {
    try {
      const response = await http.post(`/Users/generate-password-reset-token/${resetPasswordUserId}`);
        setToken(response?.data);

        if(response?.status === false)
          toast.error(response?.error);
    } catch (error) {
      toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!');
    }
  };

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Password is required"));
    }
    const errors = [];

    if (value.length < 8) {
      errors.push("Passwords must be at least 8 characters.");
    }
    if (!/[a-z]/.test(value)) {
      errors.push("Passwords must have at least one lowercase ('a'-'z').");
    }
    if (!/[A-Z]/.test(value)) {
      errors.push("Passwords must have at least one uppercase ('A'-'Z').");
    }
    if (!/[^a-zA-Z0-9]/.test(value)) {
      errors.push("Passwords must have at least one non-alphanumeric character.");
    }

    if (errors.length > 0) {
      setPasswordErrors(errors); // Set all errors in state
      return Promise.reject();
    }

    setPasswordErrors([]); // Clear errors if validation passes
    return Promise.resolve();
  };


  const submitForm = async (values) => {
    const validationResult = await form.validateFields();

    if (validationResult.errorFields && validationResult.errorFields.length > 0) {
      return;
    }

    setSubmitLoading(true)
    try {
      const response = await http.post(`/Users/reset-password/${resetPasswordUserId}`, {
        ...values,
        token,
      });
      if (response?.code === 400) {
        toast.error(`
                ${response?.data['PasswordRequiresLower'] ? response?.data['PasswordRequiresLower'][0] : ''}
                ${response?.data['PasswordRequiresNonAlphanumeric']
          ? response?.data['PasswordRequiresNonAlphanumeric'][0]
          : ''
        }
                ${response?.data['PasswordRequiresUpper'] ? response?.data['PasswordRequiresUpper'][0] : ''}
                ${response?.data['PasswordTooShort'] ? response?.data['PasswordTooShort'][0] : ''}
              `);
      } else if (response?.code === 500) {
        toast.error(response?.error);
      } else {
        toast.success('Successfully updated password');
        closeModal();
      }
    } catch (error) {
      toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!');
    }
    finally {
      setSubmitLoading(true)
    }
  };

  useEffect(() => {
    if (isOpenModal) {
      generateResetPasswordToken();
    }
  }, [isOpenModal]);

  React.useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return (
    <Modal
      open={isOpenModal}
      centered
      width={500}
      title={`Reset Password for ${resetPasswordUserName}`}
      footer={[]}
      closeIcon={null}
    >
      <Form
        name="password-update-modal"
        form={form}
        layout="vertical"
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
          <Col xs={24}>
            <Form.Item
              label="New Password"
              name="newPassword"
              hasFeedback
              // validateStatus={passwordErrors.length > 0 ? "error" : ''}
              help={passwordErrors.length > 0 ? passwordErrors.map((err, index) => (
                <div key={index}>{err}</div>
              )) : null}
              rules={[
                {
                  required: true,
                  validator: validatePassword,
                },
              ]}
            >
              <Input.Password placeholder="*****" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please Confirm New Password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The new password that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="*****" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col className="ml-auto">
            <Button className="mr-3" onClick={closeModal}>Cancel</Button>
            <Button htmlType="submit" type="primary" loading={submitLoading} disabled={!submittable}>Save</Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ResetPassword;
