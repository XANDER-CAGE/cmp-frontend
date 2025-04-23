import { Button, Modal, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import http from '../utils/axiosInterceptors';
import BasicTab from '../pages/company/tabs/basicTab';
import BankAccountsTab from '../pages/company/tabs/bankAccountsTab';
import BankCardsTab from '../pages/company/tabs/bankCardsTab';
import AccountsTab from '../pages/company/tabs/accountsTab';
import AccountCardsTab from '../pages/company/tabs/accountCardsTab';
import InvoicesTab from '../pages/company/tabs/invoicesTab';
import { GrClose } from 'react-icons/gr';

const CompanyDetailsModal = (props) => {
  const { isOpenModal, setIsOpenModal, companyId } = props;

  const [companyInfo, setCompanyInfo] = useState({});
  const [tabType, setTabType] = useState('basic');

  const tabItems = [
    {
      key: 'basic',
      label: 'Basic',
    },
    {
      key: 'bankAccounts',
      label: <span
        className={companyInfo?.bankAccountsCount ? '' : 'text-[red]'}>Bank Accounts ({companyInfo?.bankAccountsCount})</span>,
    },
    {
      key: 'bankCards',
      label: <span
        className={companyInfo?.bankCardsCount ? '' : 'text-[red]'}>Bank Cards ({companyInfo?.bankCardsCount})</span>,
    },
    {
      key: 'accounts',
      label: <span
        className={companyInfo?.companyAccountsCount ? '' : 'text-[red]'}>Accounts ({companyInfo?.companyAccountsCount})</span>,
    },
    {
      key: 'accountCards',
      label: <span
        className={companyInfo?.companyAccountCardsCount ? '' : 'text-[red]'}>Account Cards ({companyInfo?.companyAccountCardsCount})</span>,
    },
    {
      key: 'invoices',
      label: <span
        className={companyInfo?.invoicesCount ? '' : 'text-[red]'}>Invoices ({companyInfo?.invoicesCount})</span>,
    },
  ];

  const getCompanyInfo = async () => {
    try {
      const response = await http.get(`Companies/${companyId}`);
      setCompanyInfo(response?.data);
      console.log(response?.data);
      console.log(isOpenModal)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCompanyInfo();

    // eslint-disable-next-line
  }, [companyId]);

  const switchTabs = (key) => {
    switch (key) {
      case 'basic':
        return <BasicTab openedCompanyId={companyId} />;
      case 'bankAccounts':
        return <BankAccountsTab openedCompanyId={companyId}/>;
      case 'bankCards':
        return <BankCardsTab openedCompanyId={companyId}/>;
      case 'accounts':
        return <AccountsTab openedCompanyId={companyId}/>;
      case 'accountCards':
        return <AccountCardsTab openedCompanyId={companyId}/>;
      case 'invoices':
        return <InvoicesTab companyId={companyId} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      open={isOpenModal}
      onCancel={() => setIsOpenModal(false)}
      width={1600}
      closeIcon={null}
      destroyOnClose={true}
      maskClosable={true}
      footer={[]}
      centered>
      <div>
        <div className="box mb-2 flex items-center justify-between"> {/* Добавлен justify-between */}
          <h1 className="m-0 text-[18px] font-bold">{companyInfo.name}</h1>
          <Button
            type="text"
            icon={<GrClose />}
            onClick={() => setIsOpenModal(false)}
            style={{ fontSize: '16px', color: '#000' }}
          />
        </div>
        <div className="box">
          <Tabs
            items={tabItems}
            onChange={(e) => setTabType(e)}
            defaultActiveKey={tabType}
            className="mb-5"
          />

          {switchTabs(tabType)}
        </div>
      </div>
    </Modal>
  );
};

export default CompanyDetailsModal;