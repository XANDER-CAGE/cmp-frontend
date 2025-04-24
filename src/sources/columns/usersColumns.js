import { Dropdown, Popconfirm, Tag } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {
    MdCancel,
    MdCheckCircle,
    MdEdit,
    MdOutlineDelete,
    MdOutlineMoreVert,
    MdPassword,
    MdRemoveRedEye,
} from 'react-icons/md';
import { setTashkentTime } from '../../utils';
import { useState } from 'react';
import Authorize from '../../utils/Authorize';
import { PERMISSIONS } from '../../constants';
import { translations } from "../../translations";
import { t } from "../../utils/transliteration";

const UserActionDropDownMenu = (
  { row, deleteUser, deleteLoading, openEditModal, showPassword, onOpenResetPasswordModal, userPermissions, updateUserStatus, updateStatusLoading, language = 'en' }) => {
    const [openMenu, setOpenMenu] = useState(false);

    return (
      <Dropdown menu={{
          items: [
              Authorize(userPermissions, [PERMISSIONS.USERS.EDIT]) &&{
                  label: t(translations, 'edit', language),
                  key: 'edit',
                  icon: <MdEdit size={18} />,
              },
              Authorize(userPermissions, [PERMISSIONS.USERS.SHOW_PASSWORD]) && {
                  label: t(translations, 'showPassword', language),
                  key: 'showPassword',
                  icon: <MdRemoveRedEye size={18} />,
              },
              Authorize(userPermissions, [PERMISSIONS.USERS.CHANGE_PASSWORD]) && {
                  label: t(translations, 'resetPassword', language),
                  key: 'resetPassword',
                  icon: <MdPassword size={18} />,
              },

              Authorize(userPermissions, [PERMISSIONS.USERS.DELETE]) &&
              {
                  type: 'divider',
              },
              Authorize(userPermissions, [PERMISSIONS.USERS.EDIT]) &&
              row?.userStatus !== 'Active' && {
                  label: (
                    <Popconfirm
                      isLoading={updateStatusLoading}
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      title={t(translations, 'areYouSureToActivate', language)}
                      onConfirm={() => {
                          updateUserStatus(row?.id, 'Active');
                          setOpenMenu(false);
                      }}
                      okText={t(translations, 'yes', language)}
                      cancelText={t(translations, 'no', language)}
                    >
                        <div>{t(translations, 'activate', language)}</div>
                    </Popconfirm>
                  ),
                  key: 'activate',
                  success: true,
                  icon: <MdCheckCircle size={18} />,
              },

              Authorize(userPermissions, [PERMISSIONS.USERS.EDIT]) &&
              row?.userStatus === 'Active' && {
                  label: (
                    <Popconfirm
                      isLoading={updateStatusLoading}
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      title={t(translations, 'areYouSureToDeactivate', language)}
                      onConfirm={() => {
                          updateUserStatus(row?.id, 'Inactive');
                          setOpenMenu(false);
                      }}
                      okText={t(translations, 'yes', language)}
                      cancelText={t(translations, 'no', language)}
                    >
                        <div>{t(translations, 'deactivate', language)}</div>
                    </Popconfirm>
                  ),
                  key: 'deactivate',
                  danger: true,
                  icon: <MdCancel size={18} />,
              },
              Authorize(userPermissions, [PERMISSIONS.USERS.DELETE]) && {
                  label: (
                    <Popconfirm
                      isLoading={deleteLoading}
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      title={t(translations, 'areYouSureToDelete', language)}
                      onConfirm={() => {
                          deleteUser(row?.id);
                          setOpenMenu(false);
                      }}
                      okText={t(translations, 'yes', language)}
                      cancelText={t(translations, 'no', language)}
                    >
                        <div>{t(translations, 'delete', language)}</div>
                    </Popconfirm>
                  ),
                  key: 'delete',
                  danger: true,
                  icon: <MdOutlineDelete size={18} />,
              },
          ],
          onClick: (e) => {
              if (e.key === 'edit') {
                  setOpenMenu(false);
                  openEditModal(row?.id);
              }
              if (e.key === 'showPassword') {
                  setOpenMenu(false);
                  showPassword(row?.id);
              }
              if (e.key === 'resetPassword') {
                  setOpenMenu(false);
                  onOpenResetPasswordModal(row?.id, row?.username);
              }
          },
      }}
                open={openMenu}
                onOpenChange={(nextOpen, info) => {
                    if (info.source === 'trigger' || nextOpen) {
                        setOpenMenu(nextOpen);
                    }
                }}
                trigger={['click']}>
          <div className="flex justify-center">
              <div className="icon">
                  <MdOutlineMoreVert />
              </div>
          </div>
      </Dropdown>
    );
};

export const usersColumns = (pageNumber, pageSize, deleteUser, deleteLoading, openEditModal, getPassword, onOpenResetPasswordModal, permissions, updateUserStatus, updateStatusLoading, language = 'en') => [
    {
        title: `#`,
        key: 'numberOfRow',
        fixed: 'left',
        align: 'center',
        width: 60,
        render: (text, obj, index) => {
            return (
                <span> {(pageNumber - 1) * pageSize + index + 1} </span>
            )
        },
        checked: true,
    },
    {
        title: t(translations, 'name', language),
        key: 'name',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (row) => {
            return (
                <span>{row?.name} {row?.surname}</span>
            )
        }
    },
    {
        title: t(translations, 'username', language),
        dataIndex: 'username',
        key: 'username',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'email', language),
        dataIndex: 'email',
        key: 'email',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: t(translations, 'userStatus', language),
        dataIndex: 'userStatus',
        key: 'userStatus',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
        render: (data) => (
            data === 'Active' ?
              <Tag color="success">{t(translations, 'active', language)}</Tag> :
              <Tag color="error">{t(translations, 'inactive', language)}</Tag>
        )
    },
    {
        title: t(translations, 'roles', language),
        dataIndex: 'roles',
        key: 'roles',
        type: 'string',
        align: 'center',
        render: (data) => (
          <span>
                {data?.map((role, index) => {
                    return <li key={index}>{role.name}</li>;
                })}
            </span>
        ),
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'phoneNumber', language),
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'department', language),
        dataIndex: 'department',
        key: 'department',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (data) =>(<> {data?.name} </>)
    },
    {
        title: t(translations, 'position', language),
        dataIndex: 'position',
        key: 'position',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (data) =>(<> {data?.name} </>)
    },
    {
        title: t(translations, 'createdOnUtc', language),
        dataIndex: 'createdOnUtc',
        key: 'createdOnUtc',
        type: 'date',
        align: 'center',
        width: 200,
        checked: true,
        render: (date) => {
            return (
                <>{setTashkentTime(date)}</>
            )
        }
    },
    {
        title: t(translations, 'createdByName', language),
        dataIndex: 'createdByName',
        key: 'createdByName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'lastModifiedOnUtc', language),
        dataIndex: 'lastModifiedOnUtc',
        key: 'lastModifiedOnUtc',
        type: 'date',
        align: 'center',
        width: 200,
        checked: true,
        render: (date) => {
            return (
              <>{setTashkentTime(date ?? null)}</>
            )
        }
    },
    {
        title: t(translations, 'lastModifiedByName', language),
        dataIndex: 'lastModifiedByName',
        key: 'lastModifiedByName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'operations', language),
        key: 'operations',
        fixed: 'right',
        align: 'center',
        width: 100,
        render: (row) =>
          <UserActionDropDownMenu
            row={row}
            deleteUser={deleteUser}
            deleteLoading={deleteLoading}
            openEditModal={openEditModal}
            showPassword={getPassword}
            onOpenResetPasswordModal={onOpenResetPasswordModal}
            userPermissions={permissions}
            updateUserStatus={updateUserStatus}
            updateStatusLoading={updateStatusLoading}
            language={language}
          />,
        checked: true,
    },
]