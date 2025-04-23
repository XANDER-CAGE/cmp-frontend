import styled from '@emotion/styled';
import { Calendar } from 'antd';

export const StyledCalendar = styled(Calendar)`
  .events {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .events .ant-badge-status {
    width: 100%;
    overflow: hidden;
    font-size: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .notes-month {
    font-size: 28px;
    text-align: center;
  }

  .notes-month section {
    font-size: 28px;
  }

  .ant-picker-calendar-header {
    .ant-radio-button-wrapper {
      display: none;
    }
  }

  .ant-picker-calendar-date-content {
    height: 50px !important;
  }

  .ant-picker-calendar-date-today {
    border: 1px solid var(--main-color) !important;
    background: #fff9eb;
  }
`;
