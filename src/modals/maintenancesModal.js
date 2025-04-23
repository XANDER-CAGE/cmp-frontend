import {
    Alert,
    Button,
    Col,
    DatePicker,
    Flex,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Popconfirm,
    Row,
    Select,
    Switch,
    Table,
    Upload,
} from 'antd';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import http from '../utils/axiosInterceptors';
import { toast } from 'react-toastify';
import { makeOptions } from '../utils';
import dayjs from 'dayjs';
import { QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { maintenanceInvoiceLineItemColumns } from '../sources/columns/maintenanceInvoiceLineItemColumns';
import { v4 as uuidv4 } from 'uuid';

const MaintenancesModal = (props) => {
    const { isOpenModal, getMaintenances, closeModal, editId } = props

    const [form] = Form.useForm()

    const [submitLoading, setSubmitLoading] = useState(false)
    const [searchCompanyText, setSearchCompanyText] = useState('')
    const [companies, setCompanies] = useState([])
    const [companyId, setCompanyId] = useState(null)
    const [companyAccountId, setCompanyAccountId] = useState(null)
    const [companyAccounts, setCompanyAccounts] = useState([])
    const [companyAccountCards, setCompanyAccountCards] = useState([])
    const [companyAccountSearchText, setCompanyAccountSearchText] = useState(null)
    const [companyAccountCardSearchText, setCompanyAccountCardSearchText] = useState(null)
    const [dateUsed, setDateUsed] = useState(null);
    const [billingDate, setBillingDate] = useState(null);
    const [efsAccounts, setEfsAccounts] = useState([])
    const [dataById, setDataById] = useState({})
    const [invoiceNumber, setInvoiceNumber] = useState(null)
    const [switchType, setSwitchType] = useState(true)

    const notificated = React.useRef(false);

    const [manualInvoice, setManualInvoice] = useState(false)
    const EditableContext = React.createContext(null);
    const [lineItems, setLineItems] = useState([]);
    const [totalLineItems, setTotalLineItems] = useState(1);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [openWaringOnUncheckManualInvoice, setOpenWaringOnUncheckManualInvoice] = useState(false);
    const [deletedLineItemIds, setDeletedLineItemIds] = useState([]);
    const [updatedLineItemKeys, setUpdatedLineItemKeys] = useState([]);
    const [addedLineItemKeys, setAddedLineItemKeys] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [calculateExtPrice, setCalculateExtPrice] = useState(false);
    const [totalSummary, setTotalSummary] = useState(null);
    const [billingCycle, setBillingCycle] = useState(null);

    const onChangeDateUsed = (dates, dateUsed) => {
        setDateUsed(dateUsed);
    }
    const onChangeBillingDate = (dates, dateValue) => {
        setBillingDate(dateValue);
    }

    const getCompanies = async () => {
        try {
            const response = await http.post("Companies/discounting/filter/v2", {
                pagination: {
                    pageNumber: 1,
                    pageSize: 20
                },
                searchTerm: searchCompanyText
            })
            setCompanies(response?.data?.items)
        } catch (error) {
            console.log(error)
        }
    }

    const getCompanyAccounts = async () => {
        if (!companyId) {
            setCompanyAccounts(null)
            return;
        }
        try {
            const uri = companyId ? `CompanyAccounts/filter?companyId=${companyId}` : "CompanyAccounts/filter/"
            const response = await http.post(uri, {
                pageNumber: 1,
                pageSize: 20,
                companyId,
                searchTerm: companyAccountSearchText
            })
            setCompanyAccounts(response?.data?.items)
        } catch (error) {
            console.log(error)
        }
    }

    const getCompanyAccountCards = async () => {
        try {
            const uri = `CompanyAccountCards/filter`
            const response = await http.post(uri, {
                pageNumber: 1,
                pageSize: 20,
                accountId: companyAccountId,
                searchTerm: companyAccountCardSearchText
            })
            setCompanyAccountCards(response?.data?.items)
        } catch (error) {
            console.log(error)
        }
    }

    const getEFSAccounts = async () => {
        try {
            const response = await http.post("EfsAccounts/filter", {
                maintenanceAccount: true
            })
            setEfsAccounts(response?.data?.items)
        } catch (error) {
            console.log(error)
        }
    }

    const getInvoiceNumber = async () => {
        try {
            const response = await http.get(`/Invoices/get-id-by-maintenance/${editId}`)
            setInvoiceNumber(response?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getMaintenancesById = async () => {
        try {
            const response = await http.get(`Maintenances/${editId}`)
            setDataById(response?.data)

            const dateUsedRes = response?.data?.dateUsed
                ? dayjs.utc(`${response?.data?.dateUsed}`)
                : null

            const billingDateRes = response?.data?.billingDate
                ? dayjs.utc(`${response?.data?.billingDate}`)
                : null

            form.setFieldsValue({
                companyId: response?.data?.companyId,
                companyAccountId: response?.data?.companyAccountId,
                driverName: response?.data?.driverName,
                retailAmount: response?.data?.retailAmount,
                customerDiscount: response?.data?.customerDiscount,
                discountedAmount: response?.data?.discountedAmount,
                ourCommission: response?.data?.ourCommission,
                purchasedItem: response?.data?.purchasedItem,
                location: response?.data?.location,
                nationalTireAccount: response?.data?.nationalTireAccount,
                invoiceNumber: response?.data?.invoiceNumber,
                maintenanceEfsAccountId: response?.data?.maintenanceEfsAccountId,
                notes: response?.data?.notes,
                billingDate: billingDateRes,
                dateUsed: dateUsedRes,
                card: `${response?.data?.cardNumber}/${response?.data?.driverName}/${response?.data?.unit}`,
                status: response?.data?.status,
                calculateExtPrice: response?.data?.calculateExtPrice,
            })

            setBillingCycle(response?.data?.billingCycle)

            setCompanyId(response?.data?.companyId)
            setDateUsed(response?.data?.dateUsed)
            setBillingDate(response?.data?.billingDate)
            setCompanyAccountId(response?.data?.companyAccountId)
            setCalculateExtPrice(response?.data?.calculateExtPrice)
        } catch (error) {
            console.log(error)
        }
    }

    const uploadProps = {
        multiple: true,
        beforeUpload: (file, fileList) => {
            const index = fileList.indexOf(file);
            const maxLimit = 10;

            if (fileList.length > maxLimit) {
                if (!notificated.current) {
                    notificated.current = true;
                    message.error('Only 10 files allowed');
                }

                if (index === fileList.length - 1) {
                    // reached last upload item
                    // we must reset notification status now
                    notificated.current = false;
                }
                return Upload.LIST_IGNORE;
            }


            if (fileList.length > maxLimit) {
                message.error(`Only 10 files allowed`);
                return Upload.LIST_IGNORE;
            }

            const maxFileSize = 50 * 1024 * 1024; // 50MB limit
            if (file.size > maxFileSize) {
                message.error(`${file.name} file upload failed (exceeds 50MB)`);
                console.error('File size exceeds the limit of 50MB');
                return Upload.LIST_IGNORE;
            }
            return false;
        },
    };

    const submitForm = async (values) => {
        let cardInfo = values?.card.split("/")
        const formData = new FormData();

        if(manualInvoice && !validateManualInvoice()){
            return;
        }

        const files = values.files;

        const filteredValues = Object.fromEntries(
          Object.entries(values).filter(([key]) => key !== 'files')
        );

        const data = {
            ...filteredValues,
            dateUsed,
            billingDate: billingDate,
            cardNumber: cardInfo && cardInfo[0],
            driverName: cardInfo && cardInfo[1],
            unit: cardInfo && cardInfo[2],
            calculateExtPrice
        }
        console.log('manual invoice', manualInvoice)


        if (editId) {
            data.id = editId

            if(manualInvoice){

                // get new line items from addedLineItemKeys
                const newLineItems = lineItems.filter((item) => addedLineItemKeys.includes(item.key));

                // get updated line items from updatedLineItemKeys
                const updatedLineItems = lineItems.filter((item) => updatedLineItemKeys.includes(item.key));

                console.log("lineItems", lineItems)

                console.log("deletedLineItemIds", deletedLineItemIds)

                data.newLineItems = newLineItems;
                data.updatedLineItems = updatedLineItems;
                data.deletedLineItems = deletedLineItemIds;
            }
            else{
                data.deletedLineItems = lineItems.filter((item) => item.id).map((item) => item.id);
            }
        }
        else if(manualInvoice){
            data.lineItems = lineItems;
        }

        console.log('data', data)

        formData.append('data', JSON.stringify(data));

        if(files && files.length > 0){
            for (let i = 0; i < files.length; i++) {
                formData.append('files[]', files[i].originFileObj);
            }
        }

        setSubmitLoading(true)
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const response = editId
                ? await http.put(`Maintenances/${editId}`, formData, config)
                : await http.post('Maintenances', formData, config)

            if (response?.success) {
                toast.success(`Succesfully ${editId ? 'updated' : 'added'}!`)
                closeModal()
                getMaintenances()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setSubmitLoading(false)
        }
    }

    const validateManualInvoice = () => {

        if(!lineItems || lineItems.length === 0){
            toast.error('Please add line items!')
            return false;
        }

        if(lineItems.findIndex((item) => !item.description) !== -1){
            toast.error('Please fill all line items description!')
            return false;
        }

        let isValid = true;

        lineItems.forEach((item) => {
            const extPrice = item.quantity * item.discountedPrice;
            const diff = Math.abs(extPrice - item.extPrice);

            if (diff > 0.5) {
                toast.error(
                  `Validation Error: The calculated 'Ext. Price' (${extPrice.toFixed(2)}) for '${item.description}' differs from the entered value (${item.extPrice.toFixed(2)}) by more than 0.5. Please correct it.`
                );

                isValid = false;
            }
        })

        return isValid;
    }

    useEffect(() => {
        if (editId) {
            getMaintenancesById()
            getInvoiceNumber()
            getLineItems(editId)
        }else{
            getDefaultLineItems()
        }

        // eslint-disable-next-line
    }, [editId])

    useEffect(() => {
        getCompanies()

        // eslint-disable-next-line
    }, [searchCompanyText])

    useEffect(() => {
        getCompanyAccounts()

        // eslint-disable-next-line
    }, [companyAccountSearchText, companyId])

    useEffect(() => {
        if (companyAccountId) {
            getCompanyAccountCards()
        }
        else {
            setCompanyAccountCards([])
        }

        // eslint-disable-next-line
    }, [companyAccountCardSearchText, companyAccountId])

    useEffect(() => {
        getEFSAccounts()
        form.setFieldValue("status", "Draft")
        // eslint-disable-next-line
    }, [])

    const newOptions = useMemo(
        () => [
            ...makeOptions(
                companyAccounts,
                (item) =>
                    `${item?.organization?.name} (org), ${item?.efsAccount?.name} (efs), ${item?.company?.name} (com)`
            ),
            {
                label: `${dataById?.organizationName} (org), ${dataById?.efsAccountName} (efs), ${dataById?.companyName}`,
                value: dataById?.companyAccountId
            }
        ], [companyAccounts, dataById]
    )

    const isExist = useMemo(
        () => makeOptions(
            companyAccounts,
            (item) =>
                `${item?.organization?.name} (org), ${item?.efsAccount?.name} (efs), ${item?.company?.name} (com)`
        ).some(c => c.value === dataById?.companyAccount?.id), [companyAccounts, dataById])

    const newOptionsForCompanies = useMemo(
        () => [
            ...makeOptions(companies, 'name'),
            { label: dataById?.companyName, value: dataById?.companyId }
        ], [companies, dataById]
    )

    const isExistForCompanies = useMemo(
        () => makeOptions(companies, 'name').some(c => c.value === dataById?.companyId), [companies, dataById]
    )

    const watchInputAmounts = () => {
        let retailAm = form.getFieldValue('retailAmount') ?? 0
        let customerDisc = form.getFieldValue('customerDiscount') ?? 0
        let discountedAm = form.getFieldValue('discountedAmount') ?? 0

        if (switchType) {
            form.setFieldValue('retailAmount', discountedAm + customerDisc)
        } else {
            form.setFieldValue('discountedAmount', retailAm - customerDisc)
        }
    }

    useEffect(() => {
        if (!editId) {
            form.setFieldValue('retailAmount', 0)
            form.setFieldValue('customerDiscount', 0)
            form.setFieldValue('discountedAmount', 0)
            form.setFieldValue('ourCommission', 0)
        }
    }, [editId, form])

    useEffect(() => {
        calculateTotalSummary()
    }, [lineItems])

    const handleAdd = () => {
        const newData = {
            id: null,
            key: uuidv4(),
            description: null,
            itemType: 'Others',
            uomType: 'EA',
            quantity: 1,
            retailPrice: 0,
            discountedPrice: 0,
            extPrice: 0,
            isDefault: false
        };
        const newAddedLineItemKeys = [...addedLineItemKeys];
        newAddedLineItemKeys.push(newData.key);
        setAddedLineItemKeys(newAddedLineItemKeys);

        setLineItems([newData, ...lineItems]);
        setTotalLineItems(totalLineItems + 1);

        console.log("----------------------------");
        console.log("updatedLineItemKeys", updatedLineItemKeys)
        console.log("addedLineItemKeys", newAddedLineItemKeys)
        console.log("deletedLineItemIds", deletedLineItemIds)
    };

    const deleteLineItem = (key) => {
        setDeleteLoading(true);
        const deletedLineItem = lineItems.find((item) => item.key === key);

        console.log("deletedLineItem", deletedLineItem)

        const newDeletedLineItemIds = [...deletedLineItemIds];
        let newAddedLineItemKeys = [...addedLineItemKeys];
        let newUpdatedLineItemKeys = [...updatedLineItemKeys];

        if(deletedLineItem.id){
            if (newUpdatedLineItemKeys.findIndex((item) => item === key) !== -1) {
                newUpdatedLineItemKeys = newUpdatedLineItemKeys.filter((item) => item !== key);
                setUpdatedLineItemKeys(newUpdatedLineItemKeys);
            }

            if (newDeletedLineItemIds.findIndex((item) => item === deletedLineItem.id) === -1) {
                newDeletedLineItemIds.push(deletedLineItem.id);
                setDeletedLineItemIds(newDeletedLineItemIds);
            }
        }else{
            if (newAddedLineItemKeys.findIndex((item) => item === key) !== -1) {
                newAddedLineItemKeys = newAddedLineItemKeys.filter((item) => item !== key);
                setAddedLineItemKeys(newAddedLineItemKeys);
            }
        }

        setLineItems(lineItems.filter((item) => item.key !== key));
        setTotalLineItems(totalLineItems - 1);
        setDeleteLoading(false);


        console.log("----------------------------");
        console.log("updatedLineItemKeys", newUpdatedLineItemKeys)
        console.log("addedLineItemKeys", newAddedLineItemKeys)
        console.log("deletedLineItemIds", newDeletedLineItemIds)
    }

    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
          <Form form={form} component={false}>
              <EditableContext.Provider value={form}>
                  <tr {...props} />
              </EditableContext.Provider>
          </Form>
        );
    };

    const EditableCell = (props) => {
        const {
            title,
            editable,
            children,
            dataIndex,
            inputType,
            record,
            handleSave,
            ...restProps
        } = props;
        const inputRef = useRef(null);
        const form = useContext(EditableContext);

        useEffect(() => {
            if(record && dataIndex){
                form.setFieldsValue({
                    [dataIndex]: record[dataIndex],
                });
            }
        }, []);

        const toggleEdit = () => {
            const isDefault = record.isDefault;

            if(dataIndex === 'description' && isDefault)
                return;

            // setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };
        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({
                    ...record,
                    ...values,
                });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };
        let childNode = children;
        if (editable && !(dataIndex === 'description' && record.isDefault)) {
            childNode =  (
              <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                fieldId={`field-${dataIndex}.${record.key}`}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
              >
                  {
                      inputType === 'number' ? (
                        <InputNumber
                          id={`input-${dataIndex}.${record.key}`}
                          ref={inputRef}
                          precision={2}
                          onPressEnter={save}
                          onBlur={save}
                          style={{ width: '100%' }}
                        />
                      ) : (
                        <Input
                          ref={inputRef}
                          id={`input-${dataIndex}.${record.key}`}
                          onPressEnter={save}
                          onBlur={save}
                        />
                      )
                  }
              </Form.Item>
            );

            // childNode = editing ? (
            //   <Form.Item
            //     style={{
            //         margin: 0,
            //     }}
            //     name={dataIndex}
            //     rules={[
            //         {
            //             required: true,
            //             message: `${title} is required.`,
            //         },
            //     ]}
            //   >
            //       {
            //           inputType === 'number' ? (
            //             <InputNumber
            //               ref={inputRef}
            //               precision={2}
            //               onBlur={save}
            //               style={{ width: '100%' }}
            //             />
            //           ) : (
            //             <Input
            //               ref={inputRef}
            //               onBlur={save}
            //             />
            //           )
            //       }
            //   </Form.Item>
            // ) : (
            //   <div
            //     className="w-[100%] h-[100%] editable-cell-value-wrap"
            //     style={{
            //         paddingInlineEnd: 24,
            //     }}
            //     onClick={toggleEdit}
            //   >
            //       {children}
            //   </div>
            // );
        }

        return <td {...restProps}>{childNode}</td>;
    };

    const handleSaveRowCellValue = (row) => {
        if(calculateExtPrice === true){
            row.extPrice = row.quantity * row.discountedPrice;
        }

        // update that row in lineItems
        const newLineItems = lineItems.map((item) =>
          item.key === row.key ? { ...item, ...row } : item
        );
        setLineItems(newLineItems);

        // Обновляем updatedLineItemKeys
        if (!addedLineItemKeys.includes(row.key) && !updatedLineItemKeys.includes(row.key)) {
            setUpdatedLineItemKeys([...updatedLineItemKeys, row.key]);
        }

        console.group('Line Item Update');
        console.log('Updated Line Item Keys:', updatedLineItemKeys);
        console.log('Added Line Item Keys:', addedLineItemKeys);
        console.log('Deleted Line Item IDs:', deletedLineItemIds);
        console.groupEnd();
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = maintenanceInvoiceLineItemColumns(pageNumber, pageSize, deleteLoading, deleteLineItem, calculateExtPrice)
      .map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSaveRowCellValue,
                inputType: col.dataIndex === 'quantity' || col.dataIndex === 'retailPrice' || col.dataIndex === 'discountedPrice' || col.dataIndex === 'extPrice'  ? 'number' : 'text',
            }),
        };
    });

    const onManualInvoiceChange = (value) => {
        if (!value) {
            setOpenWaringOnUncheckManualInvoice(true);
        }else {
            setManualInvoice(true);
        }
    }

    const onCalculateExtPriceChange = (value) => {
        if(value === calculateExtPrice)
            return;

        setCalculateExtPrice(value);

        if(value === true){
            // calculate all items ext price
            const newLineItems = lineItems.map((item) => {
                item.extPrice = item.quantity * item.discountedPrice;
                return item;
            }
            );
            setLineItems(newLineItems);

            const newUpdatedLineItemKeys = [...updatedLineItemKeys];

            lineItems.forEach((item) => {
                if (newUpdatedLineItemKeys.findIndex((key) => key === item.key) === -1 &&
                  addedLineItemKeys.findIndex((key) => key === item.key) === -1) {
                    newUpdatedLineItemKeys.push(item.key);
                }
            });

            setUpdatedLineItemKeys(newUpdatedLineItemKeys);
        }
    }

    class TotalSummaryModel {
        constructor() {
            this.taxes = 0;
            this.invoiceProcessingFee = 0;
            this.fetAmount = 0;
            this.customerDiscount = 0;
            this.totalExcludedTaxes = 0;
            this.totalAmount = 0;
        }
    }
    const calculateTotalSummary = () => {

        const _totalSummary = new TotalSummaryModel();

        let taxes = 0.0;
        let invoiceProcessingFee = 0.0;
        let fetAmount = 0.0;
        let customerDiscount = 0.0;
        let totalExcludedTaxes = 0.0;

        lineItems.forEach((lineItem) => {
            switch (lineItem.itemType) {
                case "Taxes":
                    taxes += lineItem.extPrice;
                    break;
                case "InvoiceProcessingFee":
                    invoiceProcessingFee += lineItem.extPrice;
                    break;
                case "Fet":
                    fetAmount += lineItem.extPrice;
                    break;
                default:
                    totalExcludedTaxes += lineItem.retailPrice * lineItem.quantity;
                    // customerDiscount += (lineItem.retailPrice - lineItem.discountedPrice) * lineItem.quantity;
                    customerDiscount += (lineItem.retailPrice ) * lineItem.quantity - lineItem.extPrice;
                    break;
            }
        });

        _totalSummary.taxes = taxes;
        _totalSummary.invoiceProcessingFee = invoiceProcessingFee;
        _totalSummary.fetAmount = fetAmount;
        _totalSummary.customerDiscount = customerDiscount;
        _totalSummary.totalExcludedTaxes = totalExcludedTaxes;

        _totalSummary.totalAmount = totalExcludedTaxes + taxes + invoiceProcessingFee + fetAmount - customerDiscount;

        setTotalSummary(_totalSummary)
    }

    const getLineItems = async (maintenanceId) => {
        try {
            const response = await http.get(`MaintenanceLineItems/maintenance/${maintenanceId}`)
            if (response?.success) {
                const newLineItems =response?.data?.map((item) => ({
                    ...item,
                    key: uuidv4()
                }))
                setLineItems(newLineItems)

                if(!response?.data || response?.data?.length === 0){
                    await getDefaultLineItems()
                }
                else{
                    setManualInvoice(true)
                }
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        }
    }

    const getDefaultLineItems = async () => {
        try {
            const response = await http.get(`MaintenanceLineItems/default`)
            if (response?.success) {
                const newLineItems =response?.data?.map((item) => ({
                    ...item,
                    key: uuidv4()
                }))
                setLineItems(newLineItems)
                setAddedLineItemKeys(newLineItems.map((item) => item.key));
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.statusText ?? 'Server Error!')
        }
    }

    const handleTableChange = (pagination, filters, sorter) => {
        if (pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
        }

        if (pagination.current !== pageNumber) {
            setPageNumber(pagination.current);
        }
    };

    return (
        <Modal
            open={isOpenModal}
            centered
            width={1000}
            title={`${editId ? "Edit" : "Add"} Maintenance Request`}
            footer={[]}
            closeIcon={null}
        >
            {
                invoiceNumber ? (
                    <Alert
                        className='mb-4'
                        message={`This maintenance request was issued in invoice #${invoiceNumber}. If the values of Date Used, Retail Amount or Customer Discount change, the invoice will be generated again!`}
                        type="warning"
                        showIcon
                    />
                ) : null
            }
            <Form
                name="maintenances-modal"
                form={form}
                layout='vertical'
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
                    <Col span={12}>
                        <Form.Item
                            label="Company"
                            name="companyId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select company!',
                                },
                            ]}
                        >
                            <Select
                                className='w-[100%]'
                                placeholder="Company"
                                options={dataById?.companyId && !isExistForCompanies ? newOptionsForCompanies : makeOptions(companies, 'name')}
                                showSearch
                                allowClear
                                style={editId ? { pointerEvents: "none" } : {}}
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                                value={companyId}
                                onChange={(e) => {
                                    setCompanyId(e)
                                    form.setFieldValue('companyAccountId', null)
                                    form.setFieldValue('card', null)
                                    setCompanyAccountId(null)
                                    setCompanyAccountSearchText("")
                                    setCompanyAccountCardSearchText("")
                                }}
                                onSearch={e => setSearchCompanyText(e)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Company Account"
                            name="companyAccountId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select company account!',
                                },
                            ]}
                        >
                            <Select
                                className='w-[100%]'
                                placeholder="Company Account"
                                options={editId && !isExist ? newOptions :
                                    makeOptions(
                                        companyAccounts,
                                        (item) =>
                                            `${item?.organization?.name} (org), ${item?.efsAccount?.name} (efs)`
                                    )}
                                allowClear
                                disabled={companyId === null}
                                style={editId ? { pointerEvents: "none" } : {}}
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                                value={companyAccountId}
                                onChange={(e) => {
                                    setCompanyAccountId(e)
                                    form.setFieldValue('card', null)
                                    setCompanyAccountCardSearchText("")
                                    setBillingCycle(companyAccounts.find((item) => item.id === e)?.billingCycle)
                                }}
                                onSearch={e => setCompanyAccountSearchText(e)}
                                showSearch
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Date Used"
                            name="dateUsed"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select date used!',
                                },
                            ]}
                        >
                            <DatePicker onChange={onChangeDateUsed} defaultValue={dateUsed ? dayjs(dateUsed, "YYYY-MM-DD") : null} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Billing Date"
                            name="billingDate"
                            help={'Billing Cycle: ' + (billingCycle ?? '-')}
                            validateStatus='success'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select billing date!',
                                },
                            ]}
                        >
                            <DatePicker onChange={onChangeBillingDate} defaultValue={billingDate ? dayjs(billingDate, "YYYY-MM-DD") : null} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Card Info"
                            name="card"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a card!',
                                },
                            ]}
                        >
                            <Select
                                className='w-[100%]'
                                placeholder="Card"
                                options={
                                    companyAccountCards?.map((item) => ({
                                        value: `${item?.cardNumber}/${item?.driverName}/${item?.unitNumber}`,
                                        label: `${item?.cardNumber}, ${item?.driverName}, ${item?.unitNumber}`,
                                    }))
                                }
                                allowClear
                                disabled={companyAccountId === null}
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                                onSearch={e => setCompanyAccountCardSearchText(e)}
                                showSearch
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                        <Switch
                            checkedChildren="Retail"
                            unCheckedChildren="Discounted"
                            className='w-[100%]'
                            onChange={e => setSwitchType(e)}
                            checked={switchType}
                        />
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Retail Amount"
                            name="retailAmount"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input retail amount!',
                                },
                                {
                                    validator: (_, value) => {
                                        if (value >= 0) return Promise.resolve()
                                        else return Promise.reject('The retail amount should be positive!')
                                    }
                                },
                            ]}
                        >
                            <InputNumber precision={2} defaultValue={0} disabled={switchType} onChange={watchInputAmounts} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Customer Discount"
                            name="customerDiscount"
                            dependencies={['retailAmount']}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input customer discount!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const retailAmount = getFieldValue('retailAmount');

                                        if (value == null) {
                                            return Promise.resolve();
                                        }

                                        if (value < 0) {
                                            return Promise.reject(new Error('Customer discount should be positive!'));
                                        }

                                        if (value > retailAmount) {
                                            return Promise.reject(new Error('Customer discount should not exceed the retail amount!'));
                                        }

                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <InputNumber precision={2} defaultValue={0} placeholder='Customer Discount' onChange={watchInputAmounts} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Discounted Amount"
                            name="discountedAmount"
                            dependencies={['retailAmount', 'customerDiscount']}
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const retailAmount = getFieldValue('retailAmount');
                                        const customerDiscount = getFieldValue('customerDiscount') ?? 0;
                                        const discountedAmount = retailAmount - customerDiscount;

                                        if (discountedAmount >= 0) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Discounted amount should be positive!'));
                                    },
                                }),
                            ]}
                        >
                            <InputNumber precision={2} defaultValue={0} placeholder='Discounted Amount' disabled={!switchType} onChange={watchInputAmounts} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Our Commission"
                            name="ourCommission"
                            dependencies={['retailAmount']}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input our commission!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const retailAmount = getFieldValue('retailAmount');

                                        if (value == null) {
                                            return Promise.resolve();
                                        }

                                        if (value < 0) {
                                            return Promise.reject(new Error('Our commission should be positive!'));
                                        }

                                        if (value > retailAmount) {
                                            return Promise.reject(new Error('Our commission should not exceed the retail amount!'));
                                        }

                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <InputNumber defaultValue={0} precision={2} placeholder='Our Commission' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Service type"
                            name="purchasedItem"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input service type!',
                                },
                            ]}
                        >
                            <Input placeholder='Service type' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Location"
                            name="location"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input location!',
                                },
                            ]}
                        >
                            <Input placeholder='Location' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="National Tire Account"
                            name="nationalTireAccount"
                        >
                            <Input placeholder='National Tire Account' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Invoice Number"
                            name="invoiceNumber"
                        >
                            <Input placeholder='Invoice Number' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Maintenance Account"
                            name="maintenanceEfsAccountId"
                        >
                            <Select
                                className='w-[100%]'
                                placeholder="Maintenance Account"
                                options={makeOptions(efsAccounts, 'name')}
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Notes"
                            name="notes"
                        >
                            <Input.TextArea placeholder='Notes' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select Status!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select"
                                defaultValue="Draft"
                                options={[
                                    { value: "Draft", label: "Draft" },
                                    { value: "Completed", label: "Completed" }
                                ]}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item
                          name="files"
                          label="Upload Files"
                          valuePropName="fileList"
                          getValueFromEvent={(e) => e?.fileList}
                        >
                            <Upload {...uploadProps}>
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                        <Form.Item
                          name="manualInvoice"
                          label="Manual Invoice"
                        >
                            <Popconfirm
                              title="Delete manual invoice?"
                              description="Are you sure you want to delete manual invoice?"
                              okText="Yes"
                              open={openWaringOnUncheckManualInvoice}
                              cancelText="No"
                              onConfirm={() => {
                                  setManualInvoice(false);
                                  setOpenWaringOnUncheckManualInvoice(false);
                              }}
                              onCancel={() => {
                                  setManualInvoice(true);
                                  setOpenWaringOnUncheckManualInvoice(false);
                              }}
                            >
                                <Switch
                                        checked={manualInvoice}
                                        onChange={onManualInvoiceChange}
                                />
                            </Popconfirm>
                        </Form.Item>
                    </Col>

                    {
                      manualInvoice && (
                        <>
                        <Col span={5} style={{ display: 'flex', alignItems: 'center' }}>
                            <Form.Item
                              name="calculateExtPrice"
                              label="Calculate Ext. Price"
                            >
                                <Switch
                                  checked={calculateExtPrice}
                                  onChange={onCalculateExtPriceChange}
                                />
                            </Form.Item>
                        </Col>
                            <Col span={9} style={{ display: 'flex', alignItems: 'center' }}>
                                <table className="ml-auto default-table inv-amount-diff-table">
                                    <tr>
                                        <th>TOTAL (EXCL. TAXES)</th>
                                        <td style={{ textAlign: 'end' }}>{totalSummary?.totalExcludedTaxes.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <th>TAXES</th>
                                        <td style={{ textAlign: 'end' }}>{totalSummary?.taxes.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <th>FET</th>
                                        <td style={{ textAlign: 'end' }}>{totalSummary?.fetAmount.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <th>CUSTOMER DISCOUNT</th>
                                        <td style={{ textAlign: 'end' }}>{totalSummary?.customerDiscount.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <th>INVOICE PROCESSING FEE</th>
                                        <td style={{ textAlign: 'end' }}>{totalSummary?.invoiceProcessingFee.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <th style={{ backgroundColor: 'rgba(214,253,253,0.58)' }}>TOTAL</th>
                                        <td style={{ backgroundColor: 'rgba(214,253,253,0.58)', textAlign: 'end' }}
                                            className={'font-bold'}>{totalSummary?.totalAmount.toFixed(2)}</td>
                                    </tr>
                                </table>
                            </Col>
                        </>
                      )
                    }
                </Row>

                {
                  manualInvoice && (
                    <>
                    <Row gutter={[0, 0]}>
                            <Col span={24} className={'mb-0'}>
                                <Form.Item
                                  name="invoiceLineItems"
                                  label="Line Items"
                                  className={'mb-0'}
                                >
                                    <Table
                                      components={components}
                                      columns={columns}
                                      dataSource={lineItems}
                                      size="small"
                                      rowKey={'key'}
                                      // rowClassName={() => 'editable-row'}
                                      onChange={handleTableChange}
                                      scroll={
                                          {
                                              x: 1500,
                                          }
                                      }
                                      footer={() => (
                                        <Flex vertical gap="small" style={{ width: '100%' }}>
                                            <Button type="dashed" color="default" onClick={() => handleAdd()} block>
                                                + Add
                                            </Button>
                                        </Flex>
                                      )}
                                    >
                                    </Table>
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                  )
                }


                <Row>
                    <Col className="ml-auto">
                        <Button className="mr-3" onClick={closeModal} disabled={submitLoading}>Cancel</Button>
                        {
                            editId ? (
                              invoiceNumber ? (
                                <Popconfirm
                                  isLoading={submitLoading}
                                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                  title={'Are you sure to update?'}
                                  onConfirm={() => form.submit()}
                                  okText="Yes"
                                  cancelText="No"
                                  className={'shadow-lg overflow-hidden'}
                                >
                                    <Button htmlType="button" type="primary" loading={submitLoading}>Update</Button>
                                </Popconfirm>
                              ) : (
                                <Button htmlType='submit' type='primary' loading={submitLoading}>Update</Button>
                              )
                            ) : (
                              <Button htmlType='submit' type='primary' loading={submitLoading}>Add</Button>
                            )
                        }
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default MaintenancesModal