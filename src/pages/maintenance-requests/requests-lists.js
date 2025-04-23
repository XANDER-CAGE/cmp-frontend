import React, { useEffect, useMemo, useState } from 'react';
import CustomTable from '../../components/custom-table';
import { Button, Col, Collapse, DatePicker, Input, Row, Select, Switch } from 'antd';
import { maintenancesColumns } from '../../sources/columns/maintenancesColumns';
import MaintenancesModal from '../../modals/maintenancesModal';
import MaintenanceInvoiceAttachModal from '../../modals/maintenanceInvoiceAttachModal';
import http from '../../utils/axiosInterceptors';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useLocalStorageState } from 'ahooks';
import { makeOptions } from '../../utils';
import { FaFilter } from 'react-icons/fa';
import { billingCycleOptions } from '../../constants';
import { useUserInfo } from '../../contexts/UserInfoContext';
import CompanyDetailsModal from '../../modals/companyDetailsModal';

const { RangePicker } = DatePicker

const RequestsLists = () => {
    let showOptions = true

    const { permissions } = useUserInfo();

    const [maintenances, setMaintenances] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [editId, setEditId] = useState(null)
    const [isOpenModalAttachment, setIsOpenModalAttachment] = useState(false)
    const [isLoadingExportTable, setIsLoadingExportTable] = useState(false)
    const [manualInvoice, setManualInvoice] = useState(null)

    const openCompanyDetailsModal = (companyId) => {
        setIsOpenCompanyDetailsModal(true);
        setOpenCompanyDetailsId(companyId);
        console.log(companyId)
    }
    const [isOpenCompanyDetailsModal, setIsOpenCompanyDetailsModal] = useState(false);
    const [openCompanyDetailsId, setOpenCompanyDetailsId] = useState(null);

    const [dateStrings, setDateStrings] = useLocalStorageState('dateStrings', {
        defaultValue: [],
    })
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

    const [searchTerm, setSearchTerm] = useState('')
    const [isOpenFilter, setIsOpenFilter] = useLocalStorageState("maintenanceFilter", { defaultValue: false })
    const [organizations, setOrganizations] = useState([])
    const [organizationId, setOrganizationId] = useLocalStorageState("maintenance-organizationId", { defaultValue: undefined })
    const [efsAccounts, setEfsAccounts] = useState([])
    const [efsAccountId, setEfsAccountId] = useLocalStorageState("maintenance-EfsAccountId", { defaultValue: undefined })
    const [searchCompanyText, setSearchCompanyText] = useState('')
    const [companies, setCompanies] = useState([])
    const [companyId, setCompanyId] = useLocalStorageState("maintenance-CompanyId", { defaultValue: undefined })
    const [billingCycle, setBillingCycle] = useLocalStorageState('maintenance-billingCycle', { defaultValue: undefined });
    const [status, setStatus] = useState(null)
    const [paymentStatus, setPaymentStatus] = useState(null)
    const [sorts, setSorts] = useState([])


    const filters = useMemo(() => {
        return {
            pagination: {
                pageNumber,
                pageSize,
            },
            period: dateStrings && dateStrings.length > 0 ? {
                startDate: dateStrings[0],
                endDate: dateStrings[1]
            } : undefined,
            organizationId,
            efsAccountId,
            companyId,
            searchTerm,
            status,
            paymentStatus,
            billingCycle,
            sorts,
            hasManualInvoice: manualInvoice
        }
    },
        [pageNumber, pageSize, dateStrings, organizationId, efsAccountId, companyId, searchTerm, status, paymentStatus, billingCycle, sorts, manualInvoice]
    )


    const getOrganizations = async () => {
        try {
            const response = await http.get("Organizations")
            setOrganizations(response?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getEFSAccounts = async () => {
        try {
            const response = await http.post("EfsAccounts/filter", {
                organizationId
            })
            setEfsAccounts(response?.data?.items)
        } catch (error) {
            console.log(error)
        }
    }

    const getCompanies = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("Companies/discounting/filter/v2", {
                organizationId,
                efsAccountId,
                pagination: {
                    pageNumber: 1,
                    pageSize: 20
                },
                searchTerm: searchCompanyText
            })
            setCompanies(response?.data?.items)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

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
                            className='w-[100%]'
                            placeholder="Organization"
                            options={makeOptions(organizations, 'name')}
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label || '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={organizationId}
                            onChange={(e) => {
                                setOrganizationId(e)
                                setEfsAccountId(null)
                                setCompanyId(null)
                            }}
                        />
                    </Col>
                    <Col span={6}>
                        <Select
                            className='w-[100%]'
                            placeholder="EFS Account"
                            options={makeOptions(efsAccounts, 'name')}
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label || '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={efsAccountId}
                            onChange={(e) => {
                                setEfsAccountId(e)
                                setCompanyId(null)
                            }}
                        />
                    </Col>
                    <Col span={6}>
                        <Select
                            className='w-[100%]'
                            placeholder="Company"
                            options={makeOptions(companies, 'name')}
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
                          className='w-[100%]'
                          placeholder="Status"
                          options={[
                              { value: "Draft", label: "Draft" },
                              { value: "Completed", label: "Completed" }
                          ]}
                          showSearch
                          allowClear
                          filterOption={(input, option) =>
                            (option?.label || '').toLowerCase().includes(input.toLowerCase())
                          }
                          value={status}
                          onChange={(e) => setStatus(e)}
                        />
                    </Col>

                    <Col span={6}>
                        <Select
                          className='w-[100%]'
                          placeholder="Payment Status"
                          options={[
                              { value: "NotInvoiced", label: "Not Invoiced" },
                              { value: "Unpaid", label: "Unpaid" },
                              { value: "Paid", label: "Paid" },
                              { value: "Debtor", label: "Debtor" },
                          ]}
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
                    <Col span={6} className="notification-col ">
                        <label className="mr-5">Manual Invoice</label>
                        <Switch
                          checked={manualInvoice === null || manualInvoice === false ? false : true}
                          onChange={(checked) => setManualInvoice(checked === false || checked === null ? null : true)}
                        />
                    </Col>
                </Row>,
        }
    ]

    const openModal = (id) => {
        setIsOpenModal(true)
        setEditId(id)
    }
    const closeModal = () => {
        setIsOpenModal(false)
        setEditId(null)
    }

    const openModalAttachment = (id) => {
        setIsOpenModalAttachment(true)
        setEditId(id)
    }

    const getMaintenances = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("Maintenances/filter", filters)
            setMaintenances(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteMaintenanceRequest = async (id) => {
        setDeleteLoading(true)
        try {
            const response = await http.delete(`Maintenances/${id}`)
            if (response?.success) {
                toast.success('Succesfully deleted!')
                await getMaintenances()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setDeleteLoading(false)
        }
    }

    const exportTable = async () => {
        setIsLoadingExportTable(true);

        const data = {
            ...filters
        };

        try {
            const response = await http.post('/Maintenances/export-table', data, {
                responseType: 'arraybuffer',
            });
            const url = window.URL.createObjectURL(
                new Blob([response], {
                    type: 'application/zip',
                }),
            );
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Maintenances-export.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            return 1;
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!');
        } finally {
            setIsLoadingExportTable(false);
        }
    };

    const onSort = (sorter) => {
        console.log(sorter)
        const { field, order } = sorter;

        if(!order){
            // remove sort if exists in sorts
            const newSorts = sorts?.filter(s => s.field !== field);

            setSorts(newSorts)

            return;
        }

        const isDescending = order !== 'ascend';
        const newSorts = sorts?.filter(s => s.field !== field) || [];

        newSorts.push({
            field,
            isDescending
        });

        setSorts(newSorts);
    }

    const downloadInvoice = async (row, type) => {

        try {
            const response = await http.get(`Invoices/${row?.invoiceId}/download?invoiceReportFormat=${type}`, {
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
              `${row?.companyName} (com), ` +
              `${row?.organizatioName} (org), ` +
              `${row?.efsAccountName} (efs), ` +
              `${row.invoiceNumber}` +
              `.${type === 'EXCEL' ? 'xlsx' : 'pdf'}`,
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

    useEffect(() => {
        getMaintenances()

        // eslint-disable-next-line
    }, [filters])

    useEffect(() => {
        getOrganizations()
    }, [])

    useEffect(() => {
        getEFSAccounts()

        // eslint-disable-next-line
    }, [organizationId])

    useEffect(() => {
        getCompanies()

        // eslint-disable-next-line
    }, [organizationId, efsAccountId, searchCompanyText])


    return (
        <div>
            <Row className='mb-5'>
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
                <Col
                    span={6}
                >
                    <Row className='mb-3'>
                        <Col className='flex ml-auto'>
                            <Button
                                type="primary"
                                className="ml-3"
                                onClick={exportTable}
                                disabled={isLoadingExportTable}
                                loading={isLoadingExportTable}
                            >
                                Export Table
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => openModal(null)}
                                className="ml-3"
                            >
                                + Add
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='flex ml-auto'>
                            <Input.Search
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search"
                                allowClear
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <CustomTable
                name="maintenances"
                columns={maintenancesColumns(pageNumber, pageSize, deleteMaintenanceRequest, deleteLoading, openModal, openModalAttachment, showOptions, permissions, true, downloadInvoice, openCompanyDetailsModal )}
                data={maintenances}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                totalCount={totalCount}
                scrollY="60vh"
                onSort={onSort}
            />

            {/* MAINTENANCES MODAL */}
            {
                isOpenModal ? (
                    <MaintenancesModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getMaintenances={getMaintenances}
                        editId={editId}
                    />
                ) : null
            }

            {/* MAINTENANCES INVOICE ATTACHMENT MODAL */}
            {
                isOpenModalAttachment ? (
                    <MaintenanceInvoiceAttachModal
                        isOpenModalAttachment={isOpenModalAttachment}
                        maintenanceId={editId}
                        setIsOpenModalAttachment={setIsOpenModalAttachment}
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
    )
}

export default RequestsLists