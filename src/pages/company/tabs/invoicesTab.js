import React, { useEffect, useMemo, useState } from 'react';
import { 
  Card,
  Col, 
  DatePicker,
  Input, 
  Row,
  Typography,
  Table,
  Tag,
  Button,
  Space,
  Dropdown,
  Badge,
  Menu,
  Tooltip,
  Empty
} from 'antd';
import {
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  CalendarOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useLocalStorageState } from 'ahooks';
import http from '../../../utils/axiosInterceptors';
import { toast } from 'react-toastify';
import InvoiceEditModal from '../../../modals/invoiceEditModal';
import InvoiceDetailsModal from '../../../modals/invoiceDetailsModal';
import { useUserInfo } from '../../../contexts/UserInfoContext';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const InvoicesTab = (props) => {
  const { companyId } = props;
  const { permissions } = useUserInfo();

  // State management
  const [invoiceInfo, setInvoiceInfo] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // Modals state
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [openedCompanyId, setOpenedCompanyId] = useState(null);
  const [invoiceId, setInvoiceId] = useState(null);
  const [initialBonus, setInitialBonus] = useState(null);

  // Date range filter
  const [dateStrings, setDateStrings] = useState([]);
  const [dateRangeValue, setDateRangeValue] = useState([]);
  
  // Handle date range change
  const onChangeRange = (dates, dateStrings) => {
    setDateRangeValue(dates);

    if (dateStrings[0] === '' && dateStrings[1] === '') {
      setDateStrings([]);
    } else {
      setDateStrings(dateStrings);
    }
  };

  // Create filter object for API request
  const filters = useMemo(() => {
    return {
      searchTerm,
      invoicePeriod: dateStrings && dateStrings.length > 0 ? {
        startDate: dateStrings[0],
        endDate: dateStrings[1]
      } : undefined,
      pagination: {
        pageNumber,
        pageSize,
      },
      companyId,
    };
  }, [pageNumber, pageSize, searchTerm, dateStrings, companyId]);

  // Open invoice details modal
  const openInvoiceDetailsModal = async (record) => {
    setIsOpenDetailsModal(true);
    setInvoiceId(record?.id);
    setOpenedCompanyId(record?.companyAccount?.company?.id);
    setInitialBonus(record?.bonus);
    setSelectedInvoice(record);
  };

  // Open edit invoice modal
  const openEditInvoiceModal = (record) => {
    setIsOpenEditModal(true);
    setInvoiceId(record?.id);
    setSelectedInvoice(record);
  };

  // Get invoice data from API
  const getInvoiceInfo = async () => {
    setIsLoading(true);
    try {
      const response = await http.post("Invoices/filter", filters);
      setInvoiceInfo(response?.data?.items);
      setTotalCount(response?.data?.totalCount);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel (delete) invoice
  const deleteInvoice = async (id) => {
    setDeleteLoading(true);
    try {
      const response = await http.put(`Invoices/${id}/update-status`, {
        status: 'Cancelled'
      });
      if (response?.success) {
        toast.success('Invoice successfully cancelled!');
        getInvoiceInfo();
      } else {
        toast.error(response?.error);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Download invoice
  const downloadInvoice = async (record, type) => {
    try {
      const response = await http.get(`Invoices/${record?.id}/download?invoiceReportFormat=${type}`, {
        responseType: 'blob'
      });
      
      const href = URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = href;
      
      // Create filename
      const filename = `Invoice_${record?.companyAccount?.company?.name}_${record.invoiceNumber}_${record.invoiceDate.slice(0, 10)}.${type === 'EXCEL' ? 'xlsx' : 'pdf'}`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
      
      toast.success(`Invoice downloaded as ${type === 'EXCEL' ? 'Excel' : 'PDF'} file`);
    } catch (error) {
      console.log(error);
      toast.error('Failed to download invoice');
    }
  };

  // Load data when filters change
  useEffect(() => {
    getInvoiceInfo();
    // eslint-disable-next-line
  }, [pageNumber, pageSize, searchTerm, dateStrings, companyId]);

  // Table columns definition
  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <CalendarOutlined className="mr-1" />
              {dayjs(record.invoiceDate).format('MMM D, YYYY')}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Account',
      dataIndex: ['companyAccount', 'accountName'],
      key: 'accountName',
      render: (text, record) => (
        <div>
          <Text>{text}</Text>
          {record.companyAccount?.organization && (
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {record.companyAccount.organization.name}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
      render: (_, record) => (
        <>
          {record.startDate && record.endDate ? (
            <Text>
              {dayjs(record.startDate).format('MMM D')} - {dayjs(record.endDate).format('MMM D, YYYY')}
            </Text>
          ) : (
            <Text type="secondary">No period specified</Text>
          )}
        </>
      ),
    },
    {
      title: 'Amount ($)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <Text strong>${parseFloat(amount).toFixed(2)}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        let icon = null;
        
        switch (status) {
          case 'Paid':
            color = 'success';
            icon = <CheckCircleOutlined />;
            break;
          case 'Unpaid':
            color = 'warning';
            break;
          case 'Cancelled':
            color = 'error';
            icon = <CloseCircleOutlined />;
            break;
          default:
            color = 'default';
        }
        
        return (
          <Tag color={color} icon={icon}>
            {status || 'Unknown'}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => {
        // Create items for dropdown menu
        const items = [
          {
            key: 'view',
            label: 'View Details',
            icon: <EyeOutlined />,
            onClick: () => openInvoiceDetailsModal(record),
          }
        ];
        
        // Add edit option if invoice is not cancelled
        if (permissions?.includes('invoice.edit') && record.status !== 'Cancelled') {
          items.push({
            key: 'edit',
            label: 'Edit Invoice',
            icon: <EditOutlined />,
            onClick: () => openEditInvoiceModal(record),
          });
        }
        
        // Add cancel option if invoice is not cancelled
        if (permissions?.includes('invoice.cancel') && record.status !== 'Cancelled') {
          items.push({
            key: 'cancel',
            label: 'Cancel Invoice',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => deleteInvoice(record.id),
          });
        }
        
        // Add download options
        items.push(
          {
            type: 'divider',
          },
          {
            key: 'download-excel',
            label: 'Download as Excel',
            icon: <FileExcelOutlined />,
            onClick: () => downloadInvoice(record, 'EXCEL'),
          },
          {
            key: 'download-pdf',
            label: 'Download as PDF',
            icon: <FilePdfOutlined />,
            onClick: () => downloadInvoice(record, 'EXCEL_AS_PDF'),
          }
        );

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
    <div className="invoices-tab">
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Title level={5} style={{ margin: 0 }}>Invoice Filters</Title>
          <Space>
            <Button 
              size="small" 
              onClick={() => {
                setDateRangeValue([]);
                setDateStrings([]);
                setSearchTerm('');
              }}
              disabled={!searchTerm && (!dateStrings || dateStrings.length === 0)}
            >
              Clear Filters
            </Button>
          </Space>
        </div>

        <Row gutter={16} align="middle">
          <Col xs={24} sm={12} lg={6}>
            <Text strong className="block mb-2">Date Range</Text>
            <RangePicker
              onChange={onChangeRange}
              value={dateRangeValue}
              className="w-full"
              placeholder={['Start date', 'End date']}
              allowClear
              format="YYYY-MM-DD"
            />
          </Col>
          <Col xs={24} sm={12} lg={6} className="mt-4 sm:mt-0">
            <Text strong className="block mb-2">Search</Text>
            <Input
              placeholder="Search by invoice number"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              allowClear
              prefix={<SearchOutlined className="text-gray-400" />}
            />
          </Col>
        </Row>
      </Card>

      <Card>
        <div className="mb-4 flex justify-between items-center">
          <Title level={5} style={{ margin: 0 }}>
            Invoices
            {totalCount > 0 && (
              <Tag className="ml-2" color="blue">{totalCount}</Tag>
            )}
          </Title>
        </div>

        <Table
          columns={columns}
          dataSource={invoiceInfo}
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
          className="invoices-table"
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No invoices found"
              />
            )
          }}
          onRow={(record) => ({
            onClick: () => openInvoiceDetailsModal(record),
            style: { cursor: 'pointer' }
          })}
        />
      </Card>

      {/* Invoice Edit Modal */}
      {isOpenEditModal && invoiceId && (
        <InvoiceEditModal
          isOpenEditModal={isOpenEditModal}
          setIsOpenEditModal={setIsOpenEditModal}
          getInvoiceInfo={getInvoiceInfo}
          invoiceId={invoiceId}
        />
      )}

      {/* Invoice Details Modal */}
      {isOpenDetailsModal && invoiceId && (
        <InvoiceDetailsModal
          isOpenDetailsModal={isOpenDetailsModal}
          setIsOpenDetailsModal={setIsOpenDetailsModal}
          invoiceId={invoiceId}
          openedCompanyId={openedCompanyId}
          initialBonus={initialBonus}
          getInvoiceInfo={getInvoiceInfo}
        />
      )}
    </div>
  );
};

export default InvoicesTab;