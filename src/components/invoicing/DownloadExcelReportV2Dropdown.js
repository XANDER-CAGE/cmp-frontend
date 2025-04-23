import { useState } from 'react';
import { Dropdown, Tooltip } from 'antd';
import { FaFileExcel } from 'react-icons/fa';

const DownloadExcelReportV2Dropdown = (
  { invoice, downloadInvoice }) => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <Dropdown menu={{
      items: [
        {
          label: 'As Excel',
          key: 'excel',
        },
        {
          label: 'As PDF',
          key: 'pdf',
        },
      ],
      onClick: (e) => {
        if (e.key === 'excel') {
          setOpenMenu(false);
          downloadInvoice(invoice, 'EXCEL');
        }
        if (e.key === 'pdf') {
          setOpenMenu(false);
          downloadInvoice(invoice, 'EXCEL_AS_PDF');
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
      <Tooltip title={'Excel'}>
        <div className="icon">
          <FaFileExcel />
        </div>
      </Tooltip>
    </Dropdown>
  );
};

export default DownloadExcelReportV2Dropdown;