import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Card, Spin, Typography, Empty, Space, Badge } from 'antd';
import axios from 'axios';
import Chart from "react-apexcharts";
import { reFormat } from '../../utils';
import { 
  LineChartOutlined, 
  ReloadOutlined, 
  InfoCircleOutlined 
} from '@ant-design/icons';
import { ThemeContext } from '../../App';

const { Title, Text } = Typography;

const Dashboard = (props) => {
  const { filters, dashboardTitle, url } = props;
  const { theme: isDarkMode } = useContext(ThemeContext);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Create data series for the chart
  const series = useMemo(() => [
    {
      name: 'Value',
      data: data?.map((item) => item?.Value?.toFixed()) || []
    }
  ], [data]);

  // Chart configuration options
  const options = useMemo(() => {
    return {
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        fontFamily: "'Roboto', sans-serif",
        background: 'transparent',
      },
      colors: [isDarkMode ? '#6366f1' : '#4f46e5'],
      plotOptions: {
        line: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 3,
        curve: 'smooth',
        colors: [isDarkMode ? '#6366f1' : '#4f46e5']
      },
      grid: {
        row: {
          colors: isDarkMode 
            ? ['#1f2937', '#111827'] 
            : ['#ffffff', '#f9fafb']
        },
        borderColor: isDarkMode ? '#374151' : '#e5e7eb'
      },
      xaxis: {
        labels: {
          rotate: -45,
          style: {
            colors: isDarkMode ? '#e5e7eb' : '#111827',
            fontSize: '12px'
          }
        },
        categories: data?.map((item) => item?.Key) || [],
        tickPlacement: 'on',
        axisBorder: {
          show: true,
          color: isDarkMode ? '#374151' : '#e5e7eb'
        },
        axisTicks: {
          show: true,
          color: isDarkMode ? '#374151' : '#e5e7eb'
        },
        title: {
          text: 'Period',
          style: {
            color: isDarkMode ? '#e5e7eb' : '#111827'
          }
        }
      },
      yaxis: {
        labels: {
          formatter: val => reFormat(val),
          style: {
            colors: isDarkMode ? '#e5e7eb' : '#111827'
          }
        },
        title: {
          text: 'Value',
          style: {
            color: isDarkMode ? '#e5e7eb' : '#111827'
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return reFormat(val);
          }
        },
        theme: isDarkMode ? 'dark' : 'light'
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: {
          colors: isDarkMode ? '#e5e7eb' : '#111827'
        }
      },
      title: {
        text: dashboardTitle,
        align: 'left',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          color: isDarkMode ? '#e5e7eb' : '#111827'
        }
      },
      markers: {
        size: 5,
        colors: isDarkMode ? '#6366f1' : '#4f46e5',
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7,
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: isDarkMode ? 'dark' : 'light',
          type: 'vertical',
          shadeIntensity: 0.1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 100]
        }
      }
    };
  }, [data, dashboardTitle, isDarkMode]);

  // Fetch dashboard data
  const getDashboardInfo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(url, filters);
      setData(response?.data || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.log(error);
      setError("Failed to load data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reload data on filters change
  useEffect(() => {
    getDashboardInfo();
    // eslint-disable-next-line
  }, [filters]);

  return (
    <Card 
      className="dashboard-card shadow-md rounded-lg"
      bodyStyle={{ padding: '16px' }}
      title={
        <div className="flex justify-between items-center">
          <Space align="center">
            <LineChartOutlined className="text-lg" />
            <Title level={4} style={{ margin: 0 }}>{dashboardTitle}</Title>
          </Space>
          <Space>
            {lastUpdated && (
              <Badge 
                status="processing" 
                text={
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Updated: {lastUpdated.toLocaleTimeString()}
                  </Text>
                } 
              />
            )}
            <Button 
              type="text" 
              icon={<ReloadOutlined />} 
              onClick={getDashboardInfo} 
              loading={isLoading}
              title="Refresh data"
            />
          </Space>
        </div>
      }
    >
      <div className="dashboard-content" style={{ height: '500px' }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spin size="large" tip="Loading data..." />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical" align="center">
                  <Text type="danger">{error}</Text>
                  <Button 
                    type="primary" 
                    icon={<ReloadOutlined />} 
                    onClick={getDashboardInfo}
                  >
                    Try Again
                  </Button>
                </Space>
              }
            />
          </div>
        ) : data?.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Empty
              description={
                <Text type="secondary">No data available for the selected filters</Text>
              }
            />
          </div>
        ) : (
          <Chart
            options={options}
            series={series}
            type="line"
            height="100%"
            width="100%"
          />
        )}
      </div>
    </Card>
  );
};

export default Dashboard;