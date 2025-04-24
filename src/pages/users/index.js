import React, { useEffect, useMemo, useState } from 'react';
import http from '../../utils/axiosInterceptors';
import { 
  Button, 
  Col, 
  Input, 
  Row, 
  Card, 
  Typography, 
  Space,
  Tag,
  Table,
  Dropdown,
  Avatar,
  Tooltip,
  Modal,
  Badge
} from 'antd';
import { toast } from 'react-toastify';
import UsersModal from '../../modals/users';
import { 
  CopyOutlined, 
  UserOutlined, 
  SearchOutlined, 
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  EyeOutlined
} from '@ant-design/icons';
import ResetPassword from '../../modals/resetPassword';
import AuthorizedView from '../../components/authorize-view';
import { PERMISSIONS } from '../../constants';
import { useUserInfo } from '../../contexts/UserInfoContext';

const { Title, Text } = Typography;

const Users = () => {
  const { permissions } = useUserInfo();

  const [users, setUsers] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [resetPasswordUserId, setResetPasswordUserId] = useState(null);
  const [resetPasswordUserName, setResetPasswordUserName] = useState(null);
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Modal interaction functions
  const openEditModal = (id) => {
    setIsOpenModal(true);
    setEditId(id);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setEditId(null);
  };

  const onOpenResetPasswordModal = (id, name) => {
    setOpenResetPasswordModal(true);
    setResetPasswordUserId(id);
    setResetPasswordUserName(name);
  };

  const onCloseResetPasswordModal = () => {
    setOpenResetPasswordModal(false);
    setResetPasswordUserId(null);
    setResetPasswordUserName(null);
  };

  // API functions
  const getUsers = async () => {
    setIsLoading(true);
    try {
      const response = await http.post("Users/filter", filters);
      setUsers(response?.data?.items);
      setTotalCount(response?.data?.totalCount);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = () => {
    if (selectedRecord) {
      deleteUser(selectedRecord.id);
    }
    setConfirmDelete(false);
    setSelectedRecord(null);
  };

  const deleteUser = async (id) => {
    setDeleteLoading(true);
    try {
      const response = await http.delete(`Users/${id}`);
      if (response?.success) {
        toast.success('Successfully deleted!');
        getUsers();
      } else {
        toast.error(response?.error);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!');
    } finally {
      setDeleteLoading(false);
    }
  };

  const updateUserStatus = async (id, status) => {
    setUpdateStatusLoading(true);
    try {
      const response = await http.put(`Users/${id}/status?status=${status}`);
      if (response?.success) {
        toast.success('Status successfully updated!');
        getUsers();
      } else {
        toast.error(response?.error);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!');
    } finally {
      setUpdateStatusLoading(false);
    }
  };

  const getPassword = async (id) => {
    try {
      const response = await http.get(`Users/show-password/${id}`);
      if (response?.success) {
        notifyPassword(response?.data);
      } else {
        toast.error(response?.error);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!');
    }
  };

  const notifyPassword = (password) => {
    const copyToClipboard = async (text) => {
      if (!navigator.clipboard) {
        copyToClipboardFallback(text);
        return;
      }

      try {
        await navigator.clipboard.writeText(text);
        toast.success('Password copied to clipboard!', {
          position: 'top-right'
        });
      } catch (err) {
        copyToClipboardFallback(text);
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

        successful ? toast.success('Password copied to clipboard!', {
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

    toast.info(
      <div>
        <p>User's Password: <strong>{password}</strong></p>
        <Button
          type="primary"
          icon={<CopyOutlined />}
          onClick={() => copyToClipboard(password)}
        >
          Copy
        </Button>
      </div>,
      {
        position: 'top-right',
        closeOnClick: false,
      }
    );
  };

  const filters = useMemo(() => {
    return {
      searchTerm,
      pageNumber,
      pageSize,
    }
  }, [pageNumber, pageSize, searchTerm]);

  useEffect(() => {
    getUsers();
  }, [pageNumber, pageSize, searchTerm]);

  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm]);

  // Generate avatar color based on user name
  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };

  // Table columns definition
  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar 
            icon={<UserOutlined />} 
            className="mr-2" 
            style={{ 
              backgroundColor: stringToColor(`${record.name}${record.surname}`),
              color: '#fff'
            }}
          >
            {record.name?.charAt(0)}{record.surname?.charAt(0)}
          </Avatar>
          <div>
            <Text strong>{record.name} {record.surname}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>{record.username}</Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (text) => text || '-',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      render: (text) => text || '-',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color="blue">{role?.name}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Badge 
          status={isActive ? "success" : "error"} 
          text={isActive ? "Active" : "Inactive"} 
        />
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      width: 80,
      render: (_, record) => {
        const items = [
          {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: () => openEditModal(record.id),
            disabled: !permissions.includes(PERMISSIONS.USERS.EDIT)
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => {
              setSelectedRecord(record);
              setConfirmDelete(true);
            },
            disabled: !permissions.includes(PERMISSIONS.USERS.DELETE)
          },
          {
            type: 'divider',
          },
          {
            key: 'status',
            label: record.isActive ? 'Deactivate' : 'Activate',
            icon: record.isActive ? <LockOutlined /> : <UnlockOutlined />,
            onClick: () => updateUserStatus(record.id, !record.isActive),
            disabled: !permissions.includes(PERMISSIONS.USERS.EDIT)
          },
          {
            key: 'password',
            label: 'Show Password',
            icon: <EyeOutlined />,
            onClick: () => getPassword(record.id),
            disabled: !permissions.includes(PERMISSIONS.USERS.SHOW_PASSWORD)
          },
          {
            key: 'resetPassword',
            label: 'Reset Password',
            icon: <LockOutlined />,
            onClick: () => onOpenResetPasswordModal(record.id, `${record.name} ${record.surname}`),
            disabled: !permissions.includes(PERMISSIONS.USERS.CHANGE_PASSWORD)
          },
        ];

        return (
          <Dropdown 
            menu={{ 
              items: items.filter(item => !item.disabled || item.type === 'divider'),
              onClick: ({ key, domEvent }) => {
                domEvent.stopPropagation();
                const selectedItem = items.find(item => item.key === key);
                if (selectedItem && selectedItem.onClick) {
                  selectedItem.onClick();
                }
              }
            }} 
            trigger={['click']}
            placement="bottomRight"
          >
            <Button 
              type="text" 
              icon={<MoreOutlined />} 
              className="flex items-center justify-center"
            />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Card
      className="shadow-md rounded-lg"
      bodyStyle={{ padding: '24px' }}
    >
      <Space direction="vertical" size="middle" className="w-full">
        <div className="flex justify-between items-center">
          <Title level={4} style={{ margin: 0 }}>Users</Title>
          <Space>
            <Input.Search
              placeholder="Search users"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              allowClear
              style={{ width: 300 }}
              prefix={<SearchOutlined className="text-gray-400" />}
            />
            <AuthorizedView requiredPermissions={[PERMISSIONS.USERS.CREATE]}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openEditModal(null)}
              >
                Add User
              </Button>
            </AuthorizedView>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: pageNumber,
            pageSize: pageSize,
            total: totalCount,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (page, size) => {
              setPageNumber(page);
              setPageSize(size);
            },
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: 'max-content' }}
          size="middle"
          className="users-table"
        />
      </Space>

      {/* User modal */}
      {isOpenModal && (
        <UsersModal
          isOpenModal={isOpenModal}
          closeModal={closeModal}
          getUsers={getUsers}
          editId={editId}
        />
      )}

      {/* Reset password modal */}
      <AuthorizedView requiredPermissions={[PERMISSIONS.USERS.CHANGE_PASSWORD]}>
        {openResetPasswordModal && (
          <ResetPassword
            isOpenModal={openResetPasswordModal}
            closeModal={onCloseResetPasswordModal}
            resetPasswordUserId={resetPasswordUserId}
            resetPasswordUserName={resetPasswordUserName}
          />
        )}
      </AuthorizedView>

      {/* Delete confirmation modal */}
      <Modal
        title="Confirm Delete"
        open={confirmDelete}
        onOk={handleDeleteUser}
        onCancel={() => {
          setConfirmDelete(false);
          setSelectedRecord(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true, loading: deleteLoading }}
      >
        <p>Are you sure you want to delete user <strong>{selectedRecord?.name} {selectedRecord?.surname}</strong>?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </Card>
  );
};

export default Users;