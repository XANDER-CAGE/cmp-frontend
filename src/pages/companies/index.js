import React, { useEffect, useMemo, useState } from 'react';
import http from '../../utils/axiosInterceptors';
import { 
  Button, 
  Card, 
  Col, 
  Input, 
  Row, 
  Select, 
  Space, 
  Table, 
  Typography,
  Dropdown,
  Tag,
  Modal,
  Badge,
  Tooltip,
  Collapse
} from 'antd';
import { toast } from 'react-toastify';
import { makeOptions } from '../../utils';
import { billingCycleOptions, missingFilterOptions } from '../../constants';
import CompaniesModal from '../../modals/companies';
import { 
  SearchOutlined, 
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BankOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useLocalStorageState } from 'ahooks';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Filter states
  const [isOpenFilter, setIsOpenFilter] = useLocalStorageState("companiesFilter", { defaultValue: false });
  const [organizations, setOrganizations] = useState([]);
  const [organizationId, setOrganizationId] = useLocalStorageState("companies-organizationId", { defaultValue: null });
  const [efsAccounts, setEfsAccounts] = useState([]);
  const [efsAccountId, setEfsAccountId] = useLocalStorageState("companies-EfsAccountId", { defaultValue: null });
  const [billingCycle, setBillingCycle] = useLocalStorageState("companies-billingCycle", { defaultValue: null });
  const [isTrusted, setIsTrusted] = useLocalStorageState("companies-isTrusted", { defaultValue: null });
  const [companyStatus, setCompanyStatus] = useLocalStorageState("companies-companyStatus", { defaultValue: null });
  const [missingStatus, setMissingStatus] = useLocalStorageState("companies-missingStatus", { defaultValue: null });

  // Modal functions
  const openModal = (id) => {
    setIsOpenModal(true);
    setEditId(id);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setEditId(null);
  };

  // API functions
  const getOrganizations = async () => {
    try {
      const response = await http.get("Organizations");
      setOrganizations(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getEFSAccounts = async () => {
    try {
      const response = await http.post("EfsAccounts/filter", {
        organizationId
      });
      setEfsAccounts(response?.data?.items);
    } catch (error) {
      console.log(error);
    }
  };

  const getCompanies = async () => {
    setIsLoading(true);
    try {
      const response = await http.post("Companies/filter", filters);
      setCompanies(response?.data?.items);
      setTotalCount(response?.data?.totalCount);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCompany = () => {
    if (selectedCompany) {
      deleteCompany(selectedCompany.id);
    }
    setConfirmDelete(false);
    setSelectedCompany(null);
  };

  const deleteCompany = async (id) => {
    setDeleteLoading(true);
    try {
      const response = await http.delete(`Companies/${id}`);
      if (response?.success) {
        toast.success('Successfully deleted!');
        getCompanies();
      } else {
        toast.error(response?.error);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filters = useMemo(() => {
    return {
      searchTerm,
      pageNumber,
      pageSize,
      organizationId,
      efsAccountId,
      billingCycle,
      isTrusted,
      companyStatus,
      missingStatus
    };
  }, [pageNumber, pageSize, searchTerm, organizationId, efsAccountId, billingCycle, isTrusted, companyStatus, missingStatus]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (organizationId) count++;
    if (efsAccountId) count++;
    if (billingCycle) count++;
    if (isTrusted !== null) count++;
    if (companyStatus) count++;
    if (missingStatus) count++;
    return count;
  }, [organizationId, efsAccountId, billingCycle, isTrusted, companyStatus, missingStatus]);

  // Clear all filters
  const clearAllFilters = () => {
    setOrganizationId(null);
    setEfsAccountId(null);
    setBillingCycle(null);
    setIsTrusted(null);
    setCompanyStatus(null);
    setMissingStatus(null);
  };

  useEffect(() => {
    getCompanies();
    // eslint-disable-next-line
  }, [pageNumber, pageSize, searchTerm, organizationId, efsAccountId, billingCycle, isTrusted, companyStatus, missingStatus]);

  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm, organizationId, efsAccountId, billingCycle, isTrusted, companyStatus, missingStatus]);

  useEffect(() => {
    getOrganizations();
  }, []);

  useEffect(() => {
    getEFSAccounts();
    // eslint-disable-next-line
  }, [organizationId]);

  // Table columns
  const columns = [
    {
      title: 'Company',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white mr-3">
            <BankOutlined />
          </div>
          <div>
            <Text strong>{record.name}</Text>
            {record.organization && (
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  <ShopOutlined className="mr-1" />{record.organization.name}
                </Text>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Contact Information',
      dataIndex: 'contact',
      key: 'contact',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.email && (
            <Text type="secondary">
              <span role="img" aria-label="mail" className="mr-1">✉️</span> {record.email}
            </Text>
          )}
          {record.phone && (
            <Text type="secondary">
              <span role="img" aria-label="phone" className="mr-1">📞</span> {record.phone}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Billing Cycle',
      dataIndex: 'billingCycle',
      key: 'billingCycle',
      render: (cycle) => {
        const option = billingCycleOptions.find(o => o.value === cycle);
        return cycle ? <Tag color="blue">{option?.label || cycle}</Tag> : '-';
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Badge
            status={record.companyStatus === 'Active' ? 'success' : 'error'}
            text={record.companyStatus || '-'}
          />
          {record.isTrusted !== undefined && (
            <Tag color={record.isTrusted ? 'green' : 'red'} className="ml-0">
              {record.isTrusted ? (
                <span><CheckCircleOutlined /> Trusted</span>
              ) : (
                <span><CloseCircleOutlined /> Not Trusted</span>
              )}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'EFS Account',
      dataIndex: 'efsAccount',
      key: 'efsAccount',
      render: (_, record) => record.efsAccount?.name || '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_, record) => {
        const items = [
          {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: () => openModal(record.id),
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => {
              setSelectedCompany(record);
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
          <Title level={4} style={{ margin: 0 }}>Companies</Title>
          <Space>
            <Input.Search
              placeholder="Search companies"
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
              Add Company
            </Button>
          </Space>
        </div>

        {/* Filter Section */}
        <Card 
          className={`${isOpenFilter ? 'bg-gray-50' : 'bg-white'} border border-gray-200`}
          bodyStyle={{ padding: isOpenFilter ? '16px' : '8px' }}
        >
          <Collapse 
            activeKey={isOpenFilter ? ['1'] : []}
            onChange={() => setIsOpenFilter(!isOpenFilter)}
            ghost
            expandIcon={({ isActive }) => (
              <Tooltip title={isActive ? 'Hide Filters' : 'Show Filters'}>
                <Badge count={activeFilterCount} size="small" offset={[5, -3]}>
                  <Button
                    type="text"
                    icon={<FilterOutlined rotate={isActive ? 180 : 0} />}
                    style={{ 
                      transition: 'all 0.3s',
                      transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  />
                </Badge>
              </Tooltip>
            )}
          >
            <Panel header={<Text strong>Filters</Text>} key="1" showArrow={false}>
              <Row gutter={[16, 16]} align="middle">
                <Col span={24}>
                  <div className="flex justify-between items-center mb-4">
                    <Text type="secondary">
                      {activeFilterCount > 0 ? `${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} applied` : 'No filters applied'}
                    </Text>
                    {activeFilterCount > 0 && (
                      <Button 
                        type="link" 
                        onClick={clearAllFilters}
                        icon={<SyncOutlined />}
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                  <Text strong className="block mb-1">Organization</Text>
                  <Select
                    className="w-full"
                    placeholder="Select Organization"
                    options={makeOptions(organizations, 'name')}
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                      (option?.label || '').toLowerCase().includes(input.toLowerCase())
                    }
                    value={organizationId}
                    onChange={(e) => setOrganizationId(e)}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                  <Text strong className="block mb-1">EFS Account</Text>
                  <Select
                    className="w-full"
                    placeholder="Select EFS Account"
                    options={makeOptions(efsAccounts, 'name')}
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                      (option?.label || '').toLowerCase().includes(input.toLowerCase())
                    }
                    value={efsAccountId}
                    onChange={(e) => setEfsAccountId(e)}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                  <Text strong className="block mb-1">Billing Cycle</Text>
                  <Select
                    className="w-full"
                    placeholder="Select Billing Cycle"
                    options={billingCycleOptions}
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                      (option?.label || '').toLowerCase().includes(input.toLowerCase())
                    }
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e)}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                  <Text strong className="block mb-1">Trusted Status</Text>
                  <Select
                    className="w-full"
                    placeholder="Is Trusted"
                    options={[
                      { value: true, label: "Yes" },
                      { value: false, label: "No" }
                    ]}
                    allowClear
                    value={isTrusted}
                    onChange={(e) => setIsTrusted(e)}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                  <Text strong className="block mb-1">Company Status</Text>
                  <Select
                    className="w-full"
                    placeholder="Select Status"
                    options={[
                      { value: "Active", label: "Active" },
                      { value: "Inactive", label: "Inactive" }
                    ]}
                    allowClear
                    value={companyStatus}
                    onChange={(e) => setCompanyStatus(e)}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                  <Text strong className="block mb-1">Missing Information</Text>
                  <Select
                    className="w-full"
                    placeholder="Missing Information"
                    options={missingFilterOptions}
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                      (option?.label || '').toLowerCase().includes(input.toLowerCase())
                    }
                    value={missingStatus}
                    onChange={(e) => setMissingStatus(e)}
                  />
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </Card>

        <Table
          columns={columns}
          dataSource={companies}
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
          className="companies-table"
        />
      </Space>

      {/* Company Modal */}
      {isOpenModal && (
        <CompaniesModal
          isOpenModal={isOpenModal}
          closeModal={closeModal}
          getCompanies={getCompanies}
          editId={editId}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={confirmDelete}
        onOk={handleDeleteCompany}
        onCancel={() => {
          setConfirmDelete(false);
          setSelectedCompany(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true, loading: deleteLoading }}
      >
        <p>Are you sure you want to delete company <strong>{selectedCompany?.name}</strong>?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </Card>
  );
};

export default Companies;