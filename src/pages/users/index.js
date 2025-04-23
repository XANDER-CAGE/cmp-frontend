import React, { useEffect, useMemo, useState } from 'react';
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { Button, Col, Input, Row } from 'antd';
import { toast } from 'react-toastify';
import UsersModal from '../../modals/users';
import { usersColumns } from '../../sources/columns/usersColumns';
import { CopyOutlined } from '@ant-design/icons';
import ResetPassword from '../../modals/resetPassword';
import AuthorizedView from '../../components/authorize-view';
import { PERMISSIONS } from '../../constants';
import { useUserInfo } from '../../contexts/UserInfoContext';

const Users = () => {
    const { permissions } = useUserInfo();

    const [users, setUsers] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [updateStatusLoading, setUpdateStatusLoading] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [editId, setEditId] = useState(null)

    const [resetPasswordUserId, setResetPasswordUserId] = useState(null)
    const [resetPasswordUserName, setResetPasswordUserName] = useState(null)
    const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false)

    const openEditModal = (id) => {
        setIsOpenModal(true)
        setEditId(id)
    }

    const closeModal = () => {
        setIsOpenModal(false)
        setEditId(null)
    }

    const onOpenResetPasswordModal = (id, name) => {
        setOpenResetPasswordModal(true)
        setResetPasswordUserId(id)
        setResetPasswordUserName(name)
    }

    const onCloseResetPasswordModal = () => {
        setOpenResetPasswordModal(false)
        setResetPasswordUserId(null)
        setResetPasswordUserName(null)
    }

    const getUsers = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("Users/filter", filters)
            setUsers(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteUser = async (id) => {
        setDeleteLoading(true)
        try {
            const response = await http.delete(`Users/${id}`)
            if (response?.success) {
                toast.success('Succesfully deleted!')
                getUsers()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setDeleteLoading(false)
        }
    }

    const updateUserStatus = async (id, status) => {
        setUpdateStatusLoading(true)
        try {
            const response = await http.put(`Users/${id}/status?status=${status}`)
            if (response?.success) {
                toast.success('Succesfully updated!')
                getUsers()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setUpdateStatusLoading(false)
        }
    }

    const getPassword = async (id) => {
        try {
            const response = await http.get(`Users/show-password/${id}`)
            if (response?.success) {
                notifyPassword(response?.data)
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
        }
    }

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
      },
      [pageNumber, pageSize, searchTerm]
    )

    useEffect(() => {
        getUsers()
    }, [pageNumber, pageSize, searchTerm])

    useEffect(() => {
        setPageNumber(1)
    }, [searchTerm])

    return (
        <div className='box'>
            <Row className='mb-5'>
                <Col
                    className='flex ml-auto'
                >
                    <Input.Search
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder='Search'
                      allowClear
                    />
                    <Button
                        type='primary'
                        onClick={() => openEditModal(null)}
                        className='ml-3'
                    >
                        + Add
                    </Button>
                </Col>
            </Row>

            <CustomTable
                name="users"
                columns={usersColumns(pageNumber, pageSize, deleteUser, deleteLoading, openEditModal, getPassword, onOpenResetPasswordModal, permissions, updateUserStatus, updateStatusLoading)}
                data={users}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
                scrollY="60vh"
            />

            {/* USER MODAL */}
            {
                isOpenModal ? (
                    <UsersModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getUsers={getUsers}
                        editId={editId}
                    />
                ) : null
            }

            <AuthorizedView requiredPermissions={[PERMISSIONS.USERS.CHANGE_PASSWORD]}>
                {/* RESET PASSWORD MODAL */}
                {
                    openResetPasswordModal ? (
                      <ResetPassword
                        isOpenModal={openResetPasswordModal}
                        closeModal={onCloseResetPasswordModal}
                        resetPasswordUserId={resetPasswordUserId}
                        resetPasswordUserName={resetPasswordUserName}
                      />
                    ) : null
                }
            </AuthorizedView>
        </div>
    )
}

export default Users