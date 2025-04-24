import React, { useEffect, useMemo, useState } from 'react';
import http from '../../utils/axiosInterceptors';
import { 
  Button, 
  Card, 
  Input, 
  Space, 
  Table, 
  Typography, 
  Dropdown, 
  Tag, 
  Modal,
  Tooltip,
  Avatar
} from 'antd';
import { toast } from 'react-toastify';
import AgentsModal from '../../modals/agents';
import { 
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../translations';
import { t } from '../../utils/transliteration';

const { Title, Text } = Typography;

const Agents = () => {
  const { language } = useLanguage();
  const [agents, setAgents] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const openModal = (id) => {
    setIsOpenModal(true);
    setEditId(id);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setEditId(null);
  };

  const getAgents = async () => {
    setIsLoading(true);
    try {
      const response = await http.post("Agents/filter", filters);
      setAgents(response?.data?.items);
      setTotalCount(response?.data?.totalCount);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedAgent) {
      deleteAgent(selectedAgent.id);
    }
    setConfirmDelete(false);
    setSelectedAgent(null);
  };

  const deleteAgent = async (id) => {
    setDeleteLoading(true);
    try {
      const response = await http.delete(`agents/${id}`);
      if (response?.success) {
        toast.success(language === 'en' ? 'Successfully deleted!' : 'Успешно удалено!');
        getAgents();
      } else {
        toast.error(response?.error);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 
                 (language === 'en' ? 'Server Error!' : 'Ошибка сервера!'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const filters = useMemo(() => {
    return {
      searchTerm,
      pagination: {
        pageNumber,
        pageSize,
      }
    };
  }, [pageNumber, pageSize, searchTerm]);

  useEffect(() => {
    getAgents();
    // eslint-disable-next-line
  }, [pageNumber, pageSize, searchTerm]);

  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm]);

  // Generate avatar color based on agent name
  const stringToColor = (string) => {
    if (!string) return '#4f46e5';
    
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

  // Table columns
  const columns = [
    {
      title: t(translations, 'agent', language),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar 
            icon={<UserOutlined />} 
            className="mr-2" 
            style={{ 
              backgroundColor: stringToColor(record.name),
              color: '#fff'
            }}
          >
            {record.name?.charAt(0)}
          </Avatar>
          <div>
            <Text strong>{record.name}</Text>
            {record.company && (
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  <TeamOutlined className="mr-1" />{record.company}
                </Text>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: t(translations, 'contactInformation', language),
      dataIndex: 'contactInfo',
      key: 'contactInfo',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.email && (
            <Text type="secondary">
              <MailOutlined className="mr-1" /> {record.email}
            </Text>
          )}
          {record.phone && (
            <Text type="secondary">
              <PhoneOutlined className="mr-1" /> {record.phone}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: t(translations, 'status', language),
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'blue';
        if (status === 'Active') color = 'green';
        if (status === 'Inactive') color = 'red';
        return <Tag color={color}>{
          status === 'Active' 
            ? t(translations, 'statusActive', language) 
            : status === 'Inactive' 
              ? t(translations, 'statusInactive', language) 
              : status || 'N/A'
        }</Tag>;
      },
    },
    {
      title: t(translations, 'createdDate', language),
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (date) => new Date(date).toLocaleDateString(language === 'en' ? 'en-US' : 'ru-RU'),
    },
    {
      title: t(translations, 'actions', language),
      key: 'actions',
      width: 80,
      render: (_, record) => {
        const items = [
          {
            key: 'edit',
            label: t(translations, 'edit', language),
            icon: <EditOutlined />,
            onClick: () => openModal(record.id),
          },
          {
            key: 'delete',
            label: t(translations, 'delete', language),
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => {
              setSelectedAgent(record);
              setConfirmDelete(true);
            },
          },
        ];

        return (
          <Dropdown 
            menu={{ 
              items,
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
          <Title level={4} style={{ margin: 0 }}>{t(translations, 'agents', language)}</Title>
          <Space>
            <Input.Search
              placeholder={t(translations, 'searchAgents', language)}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              allowClear
              style={{ width: 300 }}
              prefix={<SearchOutlined className="text-gray-400" />}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal(null)}
            >
              {t(translations, 'addAgent', language)}
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={agents}
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
            showTotal: (total, range) => 
              language === 'en' 
                ? `${range[0]}-${range[1]} of ${total} items` 
                : `${range[0]}-${range[1]} из ${total} элементов`,
          }}
          scroll={{ x: 'max-content' }}
          size="middle"
          className="agents-table"
        />
      </Space>

      {/* Agent Modal */}
      {isOpenModal && (
        <AgentsModal
          isOpenModal={isOpenModal}
          closeModal={closeModal}
          getAgents={getAgents}
          editId={editId}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        title={t(translations, 'confirmDelete', language)}
        open={confirmDelete}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setConfirmDelete(false);
          setSelectedAgent(null);
        }}
        okText={t(translations, 'delete', language)}
        cancelText={t(translations, 'cancel', language)}
        okButtonProps={{ danger: true, loading: deleteLoading }}
      >
        <p>
          {language === 'en' 
            ? `Are you sure you want to delete agent `
            : `Вы уверены, что хотите удалить агента `}
          <strong>{selectedAgent?.name}</strong>?
        </p>
        <p>{t(translations, 'actionCannotBeUndone', language)}</p>
      </Modal>
    </Card>
  );
};

export default Agents;