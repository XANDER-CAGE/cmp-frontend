import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../../utils/axiosInterceptors';
import { 
  Card, 
  Tabs, 
  Typography, 
  Button, 
  Breadcrumb, 
  Badge, 
  Tag, 
  Space,
  Skeleton,
  Avatar,
  Tooltip
} from 'antd';
import { 
  ArrowLeftOutlined, 
  BankOutlined,
  EditOutlined,
  CreditCardOutlined,
  TeamOutlined,
  ContactsOutlined,
  MailOutlined,
  PhoneOutlined,
  LinkOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import BasicTab from './tabs/basicTab';
import BankAccountsTab from './tabs/bankAccountsTab';
import BankCardsTab from './tabs/bankCardsTab';
import AccountsTab from './tabs/accountsTab';
import AccountCardsTab from './tabs/accountCardsTab';
import InvoicesTab from './tabs/invoicesTab';

const { Title, Text } = Typography;

const Company = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [companyInfo, setCompanyInfo] = useState({});
  const [tabType, setTabType] = useState("basic");
  const [isLoading, setIsLoading] = useState(true);

  // Get company information from API
  const getCompanyInfo = async () => {
    setIsLoading(true);
    try {
      const response = await http.get(`Companies/${companyId}`);
      setCompanyInfo(response?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCompanyInfo();
    // eslint-disable-next-line
  }, [companyId]);

  // Handle tab switch
  const switchTabs = (key) => {
    switch (key) {
      case 'basic':
        return <BasicTab getInvoiceInfo={getCompanyInfo} />;
      case 'bankAccounts':
        return <BankAccountsTab openedCompanyId={companyId} />;
      case 'bankCards':
        return <BankCardsTab openedCompanyId={companyId} />;
      case 'accounts':
        return <AccountsTab openedCompanyId={companyId} />;
      case 'accountCards':
        return <AccountCardsTab openedCompanyId={companyId} />;
      case 'invoices':
        return <InvoicesTab companyId={companyId} />;
      default:
        return null;
    }
  };

  // Create tab items for Ant Design Tabs component
  const tabItems = [
    {
      key: 'basic',
      label: (
        <span className="tab-label">
          <TeamOutlined />
          <span className="tab-text">Basic Info</span>
        </span>
      ),
    },
    {
      key: 'bankAccounts',
      label: (
        <span className="tab-label">
          <Badge status={companyInfo?.bankAccountsCount ? "success" : "error"} />
          <BankOutlined />
          <span className="tab-text">Bank Accounts ({companyInfo?.bankAccountsCount || 0})</span>
        </span>
      ),
    },
    {
      key: 'bankCards',
      label: (
        <span className="tab-label">
          <Badge status={companyInfo?.bankCardsCount ? "success" : "error"} />
          <CreditCardOutlined />
          <span className="tab-text">Bank Cards ({companyInfo?.bankCardsCount || 0})</span>
        </span>
      ),
    },
    {
      key: 'accounts',
      label: (
        <span className="tab-label">
          <Badge status={companyInfo?.companyAccountsCount ? "success" : "error"} />
          <ContactsOutlined />
          <span className="tab-text">Accounts ({companyInfo?.companyAccountsCount || 0})</span>
        </span>
      ),
    },
    {
      key: 'accountCards',
      label: (
        <span className="tab-label">
          <Badge status={companyInfo?.companyAccountCardsCount ? "success" : "error"} />
          <CreditCardOutlined />
          <span className="tab-text">Account Cards ({companyInfo?.companyAccountCardsCount || 0})</span>
        </span>
      ),
    },
    {
      key: 'invoices',
      label: (
        <span className="tab-label">
          <Badge status={companyInfo?.invoicesCount ? "success" : "error"} />
          <FileTextOutlined />
          <span className="tab-text">Invoices ({companyInfo?.invoicesCount || 0})</span>
        </span>
      ),
    },
  ];

  // Get a color for the status tag
  const getStatusColor = (status) => {
    if (!status) return 'default';
    return status === 'Active' ? 'success' : 'error';
  };

  return (
    <div className="company-page">
      {/* Breadcrumb and company overview card */}
      <Card 
        className="mb-6 shadow-sm"
        bodyStyle={{ padding: '16px 24px' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              icon={<ArrowLeftOutlined />} 
              type="text" 
              onClick={() => navigate(-1)}
              className="mr-4"
            />
            <Breadcrumb items={[
              { title: <a href="/companies">Companies</a> },
              { title: companyInfo.name || 'Company Details' }
            ]} />
          </div>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => setTabType("basic")}
          >
            Edit
          </Button>
        </div>
      </Card>

      {/* Company details card */}
      <Card 
        className="mb-6 shadow-sm company-info-card"
        loading={isLoading}
        bodyStyle={{ padding: isLoading ? "24px" : "0" }}
      >
        {!isLoading && (
          <>
            <div className="company-header p-6 border-b border-gray-200">
              <div className="flex items-start">
                <Avatar 
                  icon={<BankOutlined />} 
                  size={64} 
                  className="mr-6 flex-shrink-0"
                  style={{ 
                    backgroundColor: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <Title level={3} style={{ margin: 0, marginBottom: '8px' }}>
                        {companyInfo.name}
                      </Title>
                      {companyInfo.organization && (
                        <Text type="secondary" className="block mb-2">
                          <TeamOutlined className="mr-1" /> {companyInfo.organization.name}
                        </Text>
                      )}
                    </div>
                    <Space>
                      <Tag color={getStatusColor(companyInfo.companyStatus)}>
                        {companyInfo.companyStatus || 'No Status'}
                      </Tag>
                      {companyInfo.isTrusted !== undefined && (
                        <Tag 
                          icon={companyInfo.isTrusted ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                          color={companyInfo.isTrusted ? 'success' : 'error'}
                        >
                          {companyInfo.isTrusted ? 'Trusted' : 'Not Trusted'}
                        </Tag>
                      )}
                    </Space>
                  </div>
                </div>
              </div>
            </div>

            <div className="company-details-grid p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Company Details Section */}
              {companyInfo.creditScore && (
                <div className="detail-item">
                  <Text type="secondary" className="detail-label">Credit Score</Text>
                  <Text strong className="detail-value">{companyInfo.creditScore}</Text>
                </div>
              )}
              
              {companyInfo.address && (
                <div className="detail-item">
                  <Text type="secondary" className="detail-label">Address</Text>
                  <Text className="detail-value">{companyInfo.address}</Text>
                </div>
              )}
              
              {companyInfo.website && (
                <div className="detail-item">
                  <Text type="secondary" className="detail-label">Website</Text>
                  <Text className="detail-value">
                    <LinkOutlined className="mr-1" />
                    <a href={companyInfo.website.startsWith('http') ? companyInfo.website : `https://${companyInfo.website}`} 
                       target="_blank" 
                       rel="noopener noreferrer">
                      {companyInfo.website}
                    </a>
                  </Text>
                </div>
              )}
              
              {/* Contact Information Section */}
              {companyInfo.emails && companyInfo.emails.length > 0 && (
                <div className="detail-item">
                  <Text type="secondary" className="detail-label">Email</Text>
                  <div>
                    {companyInfo.emails.map((email, index) => (
                      <Text key={index} className="detail-value block">
                        <MailOutlined className="mr-1" />
                        <a href={`mailto:${email}`}>{email}</a>
                      </Text>
                    ))}
                  </div>
                </div>
              )}
              
              {companyInfo.phoneNumbers && companyInfo.phoneNumbers.length > 0 && (
                <div className="detail-item">
                  <Text type="secondary" className="detail-label">Phone</Text>
                  <div>
                    {companyInfo.phoneNumbers.map((phone, index) => (
                      <Text key={index} className="detail-value block">
                        <PhoneOutlined className="mr-1" />
                        <a href={`tel:${phone}`}>{phone}</a>
                      </Text>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Owner Information Section */}
              {companyInfo.ownerNames && companyInfo.ownerNames.length > 0 && (
                <div className="detail-item">
                  <Text type="secondary" className="detail-label">Owners</Text>
                  <div>
                    {companyInfo.ownerNames.map((owner, index) => (
                      <Text key={index} className="detail-value block">
                        <TeamOutlined className="mr-1" />{owner}
                      </Text>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Agent Information */}
              {companyInfo.agent && (
                <div className="detail-item">
                  <Text type="secondary" className="detail-label">Agent</Text>
                  <Text className="detail-value">
                    <ContactsOutlined className="mr-1" />{companyInfo.agent.name}
                  </Text>
                </div>
              )}
            </div>
          </>
        )}
        
        {isLoading && <Skeleton active paragraph={{ rows: 4 }} />}
      </Card>

      {/* Tabs Card for company data sections */}
      <Card className="shadow-sm tabs-card">
        <Tabs
          type="card"
          activeKey={tabType}
          onChange={(key) => setTabType(key)}
          items={tabItems}
          className="company-tabs"
        />
        <div className="p-4">
          {switchTabs(tabType)}
        </div>
      </Card>

      {/* Add custom styling */}
      <style jsx>{`
        .company-info-card .ant-card-body {
          padding: 0;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }
        
        .detail-label {
          margin-bottom: 4px;
        }
        
        .tab-label {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .company-tabs .ant-tabs-nav {
          margin-bottom: 0;
        }
        
        .ant-tabs-tab-btn {
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default Company;