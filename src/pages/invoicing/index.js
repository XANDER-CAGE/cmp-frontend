import React, { useEffect, useMemo, useState } from 'react';
import http from '../../utils/axiosInterceptors';
import CustomTable from '../../components/custom-table';
import { Button, Col, Collapse, DatePicker, Dropdown, Flex, Input, Row, Select, Switch } from 'antd';
import { toast } from 'react-toastify';
import { FaFilter } from 'react-icons/fa';
import { useLocalStorageState } from 'ahooks';
import {
  billingCycleOptions,
  billingTypeOptions,
  paymentStatusOptions,
  PERMISSIONS, serviceTypeConditionOptions, serviceTypeOptions,
} from '../../constants';
import { invoicingColumns } from '../../sources/columns/invoicingColumns';
import dayjs from 'dayjs';
import { get } from 'lodash';
import { IoIosArrowDown } from 'react-icons/io';
import InvoiceModal from '../../modals/invoiceModal';
import InvoiceDetailsModal from '../../modals/invoiceDetailsModal';
import InvoiceEditModal from '../../modals/invoiceEditModal';
import TransactionReportModal from '../../modals/transactionReportModal';
import MoneyCodeReportModal from '../../modals/moneyCodeReportModal';
import DriverReportModal from '../../modals/driverReportModal';
import IftaReporByDrivertModal from '../../modals/iftaReportByDriverModal';
import IftaReportByCompanyModal from '../../modals/iftaReportByCompanyModal';
import BulkEmailModal from '../../modals/bulkEmailModal';
import ExportTransactionsModal from '../../modals/exportTransactionsModal';
import { useUserInfo } from '../../contexts/UserInfoContext';
import AuthorizedView from '../../components/authorize-view';
import { makeOptions } from '../../utils';
import CompanyDetailsModal from '../../modals/companyDetailsModal';

const { RangePicker } = DatePicker;

const Invoicing = () => {
  const { permissions } = useUserInfo();

  const [invoiceInfo, setInvoiceInfo] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [invoiceId, setInvoiceId] = useState(null);
  const [openedCompanyId, setOpenedCompanyId] = useState(null);
  const [initialBonus, setInitialBonus] = useState(null);
  const [isLoadingExportTable, setIsLoadingExportTable] = useState(false);
  const [isLoadingExportFile, setIsLoadingExportFile] = useState(false);
  const [isOpenTransactionsReportModal, setIsOpenTransactionsReportModal] = useState(false);
  const [isOpenMoneyCodeReportModal, setIsOpenMoneyCodeReportModal] = useState(false);
  const [isOpenDriverReportModal, setIsOpenDriverReportModal] = useState(false);
  const [isOpenIftaReportByDriverModal, setIsOpenIftaReportByDriverModal] = useState(false);
  const [isOpenIftaReportByCompanyModal, setIsOpenIftaReportByCompanyModal] = useState(false);
  const [isOpenBulkEmailModal, setIsOpenBulkEmailModal] = useState(false);

  const [isOpenExportTransactionsModal, setIsOpenExportTransactionsModal] = useState(false);
  const [isLoadingExportCardCompanyMapping, setIsLoadingExportCardCompanyMapping] = useState(false);
  const [isLoadingExportCardAgentMapping, setIsLoadingExportCardAgentMapping] = useState(false);
  const [isLoadingExportCompanyWithAccounts, setIsLoadingExportCompanyWithAccounts] = useState(false);

  const [dateStrings, setDateStrings] = useLocalStorageState('dateStrings', {
    defaultValue: [],
  });

  const [dateRangeValue, setDateRangeValue] = useState(
    dateStrings && dateStrings.length > 0 && dateStrings[0] ?
      [dayjs(dateStrings[0], 'YYYY-MM-DD'), dayjs(dateStrings[1], 'YYYY-MM-DD')] :
      []);

  const onChangeRange = (dates, dateStrings) => {
    setDateRangeValue(dates)

    if(dateStrings[0] === '' && dateStrings[1] === '') {
      setDateStrings([])
    }
    else {
      setDateStrings(dateStrings)
    }
  };

  const openInvoiceDetailsModal = async (row) => {
    setIsOpenDetailsModal(true);
    setInvoiceId(row?.id);
    setOpenedCompanyId(row?.companyAccount?.company?.id);
    setInitialBonus(row?.bonus);
  };

  const openEditInvoiceModal = (row) => {
    setIsOpenEditModal(true);
    setInvoiceId(row?.id);
  };

  const openCompanyDetailsModal = (companyId) => {
    setIsOpenCompanyDetailsModal(true);
    setOpenCompanyDetailsId(companyId);
    console.log(companyId)
  }
  const [isOpenCompanyDetailsModal, setIsOpenCompanyDetailsModal] = useState(false);
  const [openCompanyDetailsId, setOpenCompanyDetailsId] = useState(null);

  const [isOpenFilter, setIsOpenFilter] = useLocalStorageState('invoicingFilter', { defaultValue: false });
  const [organizations, setOrganizations] = useState([]);
  const [organizationId, setOrganizationId] = useLocalStorageState('invoicing-organizationId', { defaultValue: undefined });
  const [efsAccounts, setEfsAccounts] = useState([]);
  const [efsAccountId, setEfsAccountId] = useLocalStorageState('invoicing-EfsAccountId', { defaultValue: undefined });
  const [searchCompanyText, setSearchCompanyText] = useState('');
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useLocalStorageState('invoicing-CompanyId', { defaultValue: undefined });
  const [billingCycle, setBillingCycle] = useLocalStorageState('invoicing-billingCycle', { defaultValue: undefined });
  const [billingType, setBillingType] = useLocalStorageState('invoicing-billingType', { defaultValue: undefined });
  const [paymentStatus, setPaymentStatus] = useLocalStorageState('invoicing-paymentStatus', { defaultValue: undefined });
  const [hasBonus, setHasBonus] = useLocalStorageState('invoicing-hasBonus', { defaultValue: undefined });
  const [companyStatus, setCompanyStatus] = useLocalStorageState('invoicing-companyStatus', { defaultValue: undefined });
  const [discountEditedBy, setDiscountEditedBy] = useLocalStorageState('invoicing-discountEditedBy', { defaultValue: undefined });
  const [investedByConditionalDiscount, setInvestedByConditionalDiscount] = useLocalStorageState('invoicing-investedByConditionalDiscount', { defaultValue: null });
  const [companyDataById, setCompanyDataById] = useState({});
  const [serviceTypeFilter, setServiceTypeFilter] = useState();
  const [serviceTypeCondition, setServiceTypeCondition] = useState();

  const getOrganizations = async () => {
    try {
      const response = await http.get('Organizations');
      setOrganizations(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getEFSAccounts = async () => {
    try {
      const response = await http.post('EfsAccounts/filter', {
        organizationId,
      });
      setEfsAccounts(response?.data?.items);
    } catch (error) {
      console.log(error);
    }
  };

  const getCompanies = async () => {
    setIsLoading(true);
    try {
      const response = await http.post('Companies/discounting/filter/v2', {
        organizationId,
        efsAccountId,
        pagination: {
          pageNumber: 1,
          pageSize: 20,
        },
        searchTerm: searchCompanyText,
      });
      setCompanies(response?.data?.items);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCompanyById = async () => {
    try {
      const response = await http.get(`Companies/${companyId}`);
      setCompanyDataById(response?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInvoiceInfo = async () => {
    setIsLoading(true);
    try {
      const response = await http.post('Invoices/filter', filters);
      setInvoiceInfo(response?.data?.items);
      setTotalCount(response?.data?.totalCount);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInvoice = async (id) => {
    setDeleteLoading(true);
    try {
      const response = await http.put(`Invoices/${id}/update-status`, {
        status: 'Cancelled',
      });
      console.log(response)
      if (response?.success) {
        toast.success('Succesfully deleted!');
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

  const regenerateInvoiceReportByVersion = async (id, version) => {
    try {
      const response = await http.post(`Invoices/${id}/regenerate-by-design-version?reportDesignVersion=${version}`);

      if(response?.success){
        toast.success('Report regenerated successfully');
        getInvoiceInfo();
      }
      else{
        toast.error(response?.error);
      }
    } catch(error){
      toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!');
    }
  }

  const downloadInvoice = async (row, type) => {
    try {
      const response = await http.get(`Invoices/${row?.id}/download?invoiceReportFormat=${type}`, {
        responseType: 'arraybuffer',
      });
      const href = window.URL.createObjectURL(
        new Blob([response], {
          type: 'application/zip',
        }),
      );

      const link = document.createElement('a');
      link.href = href;
      link.setAttribute(
        'download',
        `${row?.companyAccount?.company?.name} (com), ` +
        `${row?.companyAccount?.organization?.name} (org), ` +
        `${row?.companyAccount?.efsAccount?.name} (efs), ` +
        `${row.companyAccount?.accountName}. Number ${row.invoiceNumber}. ` +
        `Date ${row.invoiceDate.slice(0, 10)}.${type === 'EXCEL' ? 'xlsx' : 'pdf'}`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    } catch (error) {
      if (!error?.response?.data)
        return 1;

      const decoder = new TextDecoder();
      const errorMessage = decoder.decode(error?.response?.data);
      toast.error(errorMessage);
    }
  };

  const exportTable = async () => {
    setIsLoadingExportTable(true);
    const defaultColumns = JSON.parse(window.localStorage.getItem('table-columns-invoicing') ?? '{}');

    let columnsArr = [];
    let checkedColumns = {};
    for (let key in defaultColumns) {
      columnsArr.push(key);
    }

    columnsArr.forEach((item) => {
      checkedColumns[defaultColumns[item].key] = defaultColumns[item].checked;
    });

    const data = {
      ...filters,
      columns: checkedColumns,
    };

    try {
      const response = await http.post('/Invoices/export-invoice-table', data, {
        responseType: 'arraybuffer',
      });
      const url = window.URL.createObjectURL(
        new Blob([response], {
          type: 'application/zip',
        }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `table.xlsx`);
      document.body.appendChild(link);
      link.click();
      return 1;
    } catch (error) {
      toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!');
    } finally {
      setIsLoadingExportTable(false);
    }
  };

  const exportCardCompanyMapping = async () => {
    setIsLoadingExportCardCompanyMapping(true);

    try {
      const response = await http.get('/Export/card-company-mapping', {
        responseType: 'arraybuffer',
      });
      const url = window.URL.createObjectURL(
        new Blob([response], {
          type: 'application/zip',
        }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `mapping_card_company_${dayjs().format('YYYY-MM-DD')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      return 1;
    } catch (error) {
      toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!');
    } finally {
      setIsLoadingExportCardCompanyMapping(false);
    }
  };

  const exportCompanyWithAccounts = async () => {
    setIsLoadingExportCompanyWithAccounts(true);

    try {
      const response = await http.get('/Export/company-with-accounts', {
        responseType: 'arraybuffer',
      });
      const url = window.URL.createObjectURL(
        new Blob([response], {
          type: 'application/zip',
        }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `company_with_accounts${dayjs().format('YYYY-MM-DD')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      return 1;
    } catch (error) {
      toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!');
    } finally {
      setIsLoadingExportCompanyWithAccounts(false);
    }
  };

  const exportCardAgentMapping = async () => {
    setIsLoadingExportCardAgentMapping(true);

    try {
      const response = await http.get('/Export/card-agent-mapping', {
        responseType: 'arraybuffer',
      });
      const url = window.URL.createObjectURL(
        new Blob([response], {
          type: 'application/zip',
        }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `mapping_card_agent_${dayjs().format('YYYY-MM-DD')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      return 1;
    } catch (error) {
      toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!');
    } finally {
      setIsLoadingExportCardAgentMapping(false);
    }
  };

  const exportFile = async (type) => {
    setIsLoadingExportFile(true);
    try {
      const response = await http.post('/Invoices/files-export/file.zip', {
        ...filters,
        exportType: type,
        pagination: undefined,
      }, {
        responseType: 'arraybuffer',
      });
      const url = window.URL.createObjectURL(
        new Blob([response], {
          type: 'application/zip',
        }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoices.zip`);
      document.body.appendChild(link);
      link.click();
      return 1;
    } catch (error) {
      toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!');
    } finally {
      setIsLoadingExportFile(false);
    }
  };

  const filters = useMemo(() => {
      return {
        searchTerm,
        pagination: {
          pageNumber,
          pageSize,
        },
        invoicePeriod: dateStrings && dateStrings.length > 0 ? {
          startDate: dateStrings[0],
          endDate: dateStrings[1],
        } : undefined,
        organizationId,
        efsAccountId,
        companyId,
        billingCycle,
        invoiceStatus: paymentStatus,
        hasBonus,
        companyStatus,
        discountEditedBy,
        billingType,
        investedByConditionalDiscount,
        serviceType: serviceTypeFilter,
        serviceTypeCondition: serviceTypeCondition
      };
    },
    [pageNumber, pageSize, searchTerm, dateStrings, organizationId, efsAccountId, companyId, billingCycle, billingType, paymentStatus, hasBonus, companyStatus, discountEditedBy, investedByConditionalDiscount, serviceTypeFilter, serviceTypeCondition],
  );

  const newOptions = [
    ...makeOptions(companies, 'name'),
    { label: companyDataById?.name, value: companyDataById?.id },

  ];

  const isExist = makeOptions(companies, 'name').some(c => c.value === companyDataById?.company?.id);

  const filterItems = [
    {
      key: '1',
      label: 'Tap to Filter',
      children:
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <RangePicker
              onChange={onChangeRange}
              value={dateRangeValue}
            />
          </Col>
          <Col span={6}>
            <Select
              className="w-[100%]"
              placeholder="Organization"
              options={makeOptions(organizations, 'name')}
              showSearch
              allowClear
              filterOption={(input, option) =>
                (option?.label || '').toLowerCase().includes(input.toLowerCase())
              }
              value={organizationId}
              onChange={(e) => {
                setOrganizationId(e);
                setEfsAccountId(null);
                setCompanyId(null);
              }}
            />
          </Col>
          <Col span={6}>
            <Select
              className="w-[100%]"
              placeholder="EFS Account"
              options={makeOptions(efsAccounts, 'name')}
              showSearch
              allowClear
              filterOption={(input, option) =>
                (option?.label || '').toLowerCase().includes(input.toLowerCase())
              }
              value={efsAccountId}
              onChange={(e) => {
                setEfsAccountId(e);
                setCompanyId(null);
              }}
            />
          </Col>
          <Col span={6}>
            <Select
              className="w-[100%]"
              placeholder="Company"
              options={!isExist ? newOptions : makeOptions(companies, 'name')}
              showSearch
              allowClear
              filterOption={(input, option) =>
                (option?.label || '').toLowerCase().includes(input.toLowerCase())
              }
              value={companyId}
              onChange={(e) => setCompanyId(e)}
              onSearch={e => setSearchCompanyText(e)}
            />
          </Col>
          <Col span={6}>
            <Select
              className="w-[100%]"
              placeholder="Billing Cycle"
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
          <Col span={6}>
            <Select
              className="w-[100%]"
              placeholder="Billing Type"
              options={billingTypeOptions}
              showSearch
              allowClear
              filterOption={(input, option) =>
                (option?.label || '').toLowerCase().includes(input.toLowerCase())
              }
              value={billingType}
              onChange={(e) => setBillingType(e)}
            />
          </Col>
          <Col span={6}>
            <Select
              className="w-[100%]"
              placeholder="Payment Status"
              options={paymentStatusOptions}
              showSearch
              allowClear
              filterOption={(input, option) =>
                (option?.label || '').toLowerCase().includes(input.toLowerCase())
              }
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e)}
            />
          </Col>
          <Col span={6}>
            <Select
              className="w-[100%]"
              placeholder="Has Bonus"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' },
              ]}
              showSearch
              allowClear
              filterOption={(input, option) =>
                (option?.label || '').toLowerCase().includes(input.toLowerCase())
              }
              value={hasBonus}
              onChange={(e) => setHasBonus(e)}
            />
          </Col>
          <Col span={6}>
            <Select
              className="w-[100%]"
              placeholder="Company Status"
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
              showSearch
              allowClear
              filterOption={(input, option) =>
                (option?.label || '').toLowerCase().includes(input.toLowerCase())
              }
              value={companyStatus}
              onChange={(e) => setCompanyStatus(e)}
            />
          </Col>
          <Col span={6}>
            <Select
              className="w-[100%]"
              placeholder="Discount Edited By"
              options={[
                { value: 'ByDiscount', label: 'ByDiscount' },
                { value: 'ByPercentage', label: 'ByPercentage' },
              ]}
              showSearch
              allowClear
              filterOption={(input, option) =>
                (option?.label || '').toLowerCase().includes(input.toLowerCase())
              }
              value={discountEditedBy}
              onChange={(e) => setDiscountEditedBy(e)}
            />
          </Col>
          <Col span={6}>
            <Select
              className="w-[100%]"
              placeholder="Service Type"
              options={serviceTypeOptions}
              allowClear
              mode="multiple"
              filterOption={(input, option) =>
                (option?.label || '').toLowerCase().includes(input.toLowerCase())
              }
              onChange={(e) => onServiceTypeChange(e)}
            />
          </Col>
          <Col span={6}>
            <Select
              className="w-[100%]"
              placeholder="Service Type Condition"
              options={serviceTypeConditionOptions}
              allowClear
              filterOption={(input, option) =>
                (option?.label || '').toLowerCase().includes(input.toLowerCase())
              }
              value={serviceTypeCondition}
              onChange={(e) => onServiceTypeConditionChange(e)}
            />
          </Col>
          <Col span={12} className="notification-col ">
            <label className="mr-5">Invested By Conditional Discount</label>
            <Switch
              checked={investedByConditionalDiscount === null || investedByConditionalDiscount === false ? false : true}
              onChange={(checked) => setInvestedByConditionalDiscount(checked === false || checked === null ? null : true)}
            />
          </Col>
        </Row>,
    },
  ];

  const onServiceTypeChange = (e) => {
    let serviceType = null;

    if(e.length > 0){
      for (let i = 0; i < e.length; i++) {
        const item = e[i];

        if(item === 'Fuel')
          serviceType += 1;

        if(item === 'Maintenance')
          serviceType += 2;

        if(item === 'MoneyCode')
          serviceType += 4;

      }
    }

    setServiceTypeFilter(serviceType ?? null);
  }

  const onServiceTypeConditionChange = (e) => {
    setServiceTypeCondition(e);
  }

  const iftaItems = [
    {
      label: (
        <div onClick={() => setIsOpenIftaReportByCompanyModal(true)}>
          By Company
        </div>
      ),
      key: '1',
    },
    {
      label: (
        <div onClick={() => setIsOpenIftaReportByDriverModal(true)}>
          By Driver
        </div>
      ),
      key: '2',
    },
  ];

  const exportItems = [
    {
      label: (
        <p
          className={'m-0'}
          style={{ width: '100%' }}
          onClick={() => exportFile('Pdf')}
        >
          PDF
        </p>
      ),
      key: '1',
    },
    {
      label: (
        <p
          className={'m-0'}
          style={{ width: '100%' }}
          onClick={() => exportFile('Excel')}
        >
          Excel
        </p>
      ),
      key: '2',
    },
    {
      label: (
        <p
          className={'m-0'}
          style={{ width: '100%' }}
          onClick={() => exportFile('All')}
        >
          PDF + Excel
        </p>
      ),
      key: '3',
    },
  ];

  useEffect(() => {
    getInvoiceInfo();

    // eslint-disable-next-line
  }, [filters]);

  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm]);

  useEffect(() => {
    getOrganizations();
  }, []);

  useEffect(() => {
    getEFSAccounts();

    // eslint-disable-next-line
  }, [organizationId]);

  useEffect(() => {
    getCompanies();

    // eslint-disable-next-line
  }, [organizationId, efsAccountId, searchCompanyText]);

  useEffect(() => {
    if (companyId) {
      getCompanyById();
    }

    // eslint-disable-next-line
  }, [companyId]);

  return (
    <div className="box">
      <AuthorizedView requiredPermissions={[PERMISSIONS.REPORTS.EXPORT, PERMISSIONS.INVOICE.SEND]} validateAll={false}>
        <Flex wrap="wrap" gap="small" className="mb-5 justify-end">
          <AuthorizedView requiredPermissions={[PERMISSIONS.REPORTS.EXPORT]}>
            <Button
              type="primary"
              onClick={exportCompanyWithAccounts}
              disabled={isLoadingExportCompanyWithAccounts}
              loading={isLoadingExportCompanyWithAccounts}
            >
              Company - Accounts
            </Button>
            <Button
              type="primary"
              onClick={exportCardCompanyMapping}
              disabled={isLoadingExportCardCompanyMapping}
              loading={isLoadingExportCardCompanyMapping}
            >
              Card - Company
            </Button>
            <Button
              type="primary"
              onClick={exportCardAgentMapping}
              disabled={isLoadingExportCardAgentMapping}
              loading={isLoadingExportCardAgentMapping}
            >
              Card - Agent
            </Button>
            <Button
              type="primary"
              onClick={() => setIsOpenExportTransactionsModal(true)}
            >
              Export Transactions
            </Button>
            <AuthorizedView requiredPermissions={[PERMISSIONS.INVOICE.SEND]}>
              <Button
                type="primary"
                onClick={() => setIsOpenBulkEmailModal(true)}
              >
                Bulk Email
              </Button>
            </AuthorizedView>
            <Dropdown
              menu={{ items: iftaItems }}
              trigger={['click']}
            >
              <Button
                type="primary"
                className="flex items-center justify-center"
              >
                IFTA Report <IoIosArrowDown className="ml-1" />
              </Button>
            </Dropdown>
            <Button
              type="primary"
              onClick={() => setIsOpenTransactionsReportModal(true)}
            >
              Transaction Report
            </Button>
            <Button
              type="primary"
              onClick={() => setIsOpenMoneyCodeReportModal(true)}
            >
              Money Code Report
            </Button>
            <Button
              type="primary"
              onClick={() => setIsOpenDriverReportModal(true)}
            >
              Driver Report
            </Button>
          </AuthorizedView>

          <AuthorizedView requiredPermissions={[PERMISSIONS.INVOICE.EXPORT]}>
            <Dropdown
              menu={{ items: exportItems }}
              trigger={['click']}
            >
              <Button
                type="primary"
                className="flex items-center justify-center"
                disabled={!!isLoadingExportFile}
                loading={isLoadingExportFile}
              >
                Export <IoIosArrowDown className="ml-1" />
              </Button>
            </Dropdown>
            <Button
              type="primary"
              onClick={exportTable}
              disabled={isLoadingExportTable}
              loading={isLoadingExportTable}
            >
              Export Table
            </Button>
          </AuthorizedView>
        </Flex>
      </AuthorizedView>

      <Row className="mb-5">
        <Col span={18}>
          <Collapse
            style={{ width: '100%' }}
            items={filterItems}
            bordered={false}
            activeKey={isOpenFilter ? ['1'] : null}
            size="small"
            expandIconPosition="end"
            expandIcon={() => <FaFilter />}
            onChange={() => setIsOpenFilter(!isOpenFilter)}
          />
        </Col>
        <Col className="flex ml-auto" span={5}>
          <Input.Search
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search"
            allowClear
          />
          <AuthorizedView requiredPermissions={[PERMISSIONS.INVOICE.CREATE]}>
            <Button
              type="primary"
              onClick={() => setIsOpenModal(true)}
              className="ml-3"
            >
              + New
            </Button>
          </AuthorizedView>
        </Col>
      </Row>

      <CustomTable
        name="invoicing"
        columns={invoicingColumns(pageNumber, pageSize, deleteInvoice, deleteLoading, downloadInvoice, openInvoiceDetailsModal, openEditInvoiceModal, permissions, regenerateInvoiceReportByVersion, openCompanyDetailsModal)}
        data={invoiceInfo}
        size="small"
        setPageNumber={setPageNumber}
        setPageSize={setPageSize}
        isLoading={isLoading}
        pageSize={pageSize}
        pageNumber={pageNumber}
        totalCount={totalCount}
        scrollY={'60vh'}
      />

      {/* INVOICE CREATE MODAL */}
      {
        isOpenModal ? (
          <InvoiceModal
            isOpenModal={isOpenModal}
            setIsOpenModal={setIsOpenModal}
            getInvoiceInfo={getInvoiceInfo}
          />
        ) : null
      }

      {/* INVOICE EDIT MODAL */}
      {
        isOpenEditModal ? (
          <InvoiceEditModal
            isOpenEditModal={isOpenEditModal}
            setIsOpenEditModal={setIsOpenEditModal}
            getInvoiceInfo={getInvoiceInfo}
            invoiceId={invoiceId}
          />
        ) : null
      }

      {/* INVOICE DETAILS MODAL */}
      {
        isOpenDetailsModal && invoiceId ? (
          <InvoiceDetailsModal
            isOpenDetailsModal={isOpenDetailsModal}
            setIsOpenDetailsModal={setIsOpenDetailsModal}
            invoiceId={invoiceId}
            openedCompanyId={openedCompanyId}
            initialBonus={initialBonus}
            getInvoiceInfo={getInvoiceInfo}
          />
        ) : null
      }

      {/* TRANSACTIONS EXPORT MODAL */}
      {
        isOpenExportTransactionsModal ? (
          <ExportTransactionsModal
            isOpenExportTransactionsModal={isOpenExportTransactionsModal}
            setIsOpenExportTransactionsModal={setIsOpenExportTransactionsModal}
          />
        ) : null
      }

      {/* TRANSACTIONS REPORT MODAL */}
      {
        isOpenTransactionsReportModal ? (
          <TransactionReportModal
            isOpenTransactionsReportModal={isOpenTransactionsReportModal}
            setIsOpenTransactionsReportModal={setIsOpenTransactionsReportModal}
          />
        ) : null
      }

      {/* MONEY CODE REPORT MODAL */}
      {
        isOpenMoneyCodeReportModal ? (
          <MoneyCodeReportModal
            isOpenMoneyCodeReportModal={isOpenMoneyCodeReportModal}
            setIsOpenMoneyCodeReportModal={setIsOpenMoneyCodeReportModal}
          />
        ) : null
      }

      {/* DRIVER REPORT MODAL */}
      {
        isOpenDriverReportModal ? (
          <DriverReportModal
            isOpenDriverReportModal={isOpenDriverReportModal}
            setIsOpenDriverReportModal={setIsOpenDriverReportModal}
          />
        ) : null
      }

      {/* IFTA REPORT BY DRIVER MODAL */}
      {
        isOpenIftaReportByDriverModal ? (
          <IftaReporByDrivertModal
            isOpenIftaReportByDriverModal={isOpenIftaReportByDriverModal}
            setIsOpenIftaReportByDriverModal={setIsOpenIftaReportByDriverModal}
          />
        ) : null
      }

      {/* IFTA REPORT BY COMPANY MODAL */}
      {
        isOpenIftaReportByCompanyModal ? (
          <IftaReportByCompanyModal
            isOpenIftaReportByCompanyModal={isOpenIftaReportByCompanyModal}
            setIsOpenIftaReportByCompanyModal={setIsOpenIftaReportByCompanyModal}
          />
        ) : null
      }

      {/* BULK EMAIL MODAL */}
      {
        isOpenBulkEmailModal ? (
          <BulkEmailModal
            isOpenBulkEmailModal={isOpenBulkEmailModal}
            setIsOpenBulkEmailModal={setIsOpenBulkEmailModal}
          />
        ) : null
      }

      {/* COMPANY DETAILS MODAL */}
      {
        isOpenCompanyDetailsModal ? (
          <CompanyDetailsModal
            isOpenModal={isOpenCompanyDetailsModal}
            setIsOpenModal={setIsOpenCompanyDetailsModal}
            companyId={openCompanyDetailsId}
          />
        ) : null
      }
    </div>
  );
};

export default Invoicing;