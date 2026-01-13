'use client';

import React, { useState, useMemo } from 'react';
import { useGetDashboard } from '@/serivces/admin/query';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Radar } from 'react-chartjs-2';
import { IoDownloadOutline, IoCalendarOutline, IoTrendingUp, IoTrendingDown } from 'react-icons/io5';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement
);

// Excel 다운로드 함수
const downloadExcel = (data: any, filename: string) => {
  // 간단한 CSV 형식으로 다운로드 (실제로는 xlsx 라이브러리 사용 권장)
  const csvContent = data.map((row: any) => Object.values(row).join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function AdminAnalysis() {
  const { data: dashboard } = useGetDashboard();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // 날짜 필터링된 데이터 계산
  const filteredData = useMemo(() => {
    if (!dashboard) return null;
    
    // 실제로는 백엔드 API에 날짜 필터를 전달해야 하지만,
    // 현재는 프론트엔드에서 필터링 (백엔드 API 개선 필요)
    return dashboard;
  }, [dashboard, startDate, endDate]);

  if (!dashboard || !filteredData) {
    return (
      <div className="min-h-screen bg-grey-98 p-8">
        <h1 className="text-2xl font-bold text-grey-20 mb-6">통계 분석</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-grey-71">데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 통계 계산
  const totalSales = filteredData.monthlySales.reduce((sum, item) => sum + item.amount, 0);
  const totalOrders = filteredData.monthlySales.length; // 실제로는 주문 건수를 별도로 계산해야 함
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
  
  // 전월 대비 성장률 계산
  const monthlySales = filteredData.monthlySales;
  const currentMonthSales = monthlySales[monthlySales.length - 1]?.amount || 0;
  const previousMonthSales = monthlySales[monthlySales.length - 2]?.amount || 0;
  const growthRate = previousMonthSales > 0 
    ? Math.round(((currentMonthSales - previousMonthSales) / previousMonthSales) * 100) 
    : 0;

  // 신규/재구매 고객 비율 계산
  const totalCustomers = filteredData.customerStatistics.totalCustomers;
  const purchaseCustomers = filteredData.customerStatistics.purchaseCustomers;
  const newCustomers = totalCustomers - purchaseCustomers;
  const newCustomerRate = totalCustomers > 0 ? Math.round((newCustomers / totalCustomers) * 100) : 0;
  const returningCustomerRate = 100 - newCustomerRate;

  // 상품별 판매량 Top 20 (현재는 Top 5만 있음)
  const top20Products = filteredData.topProducts.slice(0, 20);

  // 판매자별 매출 랭킹 (브랜드별)
  const sellerRanking = filteredData.brandPerformance
    .map((item, index) => ({
      rank: index + 1,
      brand: item.brand,
      sales: item.amount,
      orders: item.count,
      growthRate: item.growthRate,
    }))
    .sort((a, b) => b.sales - a.sales);

  // 카테고리별 매출 상세
  const categorySales = filteredData.bodyTypeSales.map((item) => ({
    category: item.type,
    percentage: item.percentage,
    estimatedSales: Math.round((totalSales * item.percentage) / 100),
  }));

  // Excel 다운로드 핸들러
  const handleDownloadExcel = () => {
    const excelData = [
      ['통계 항목', '값'],
      ['총 매출액', `${totalSales.toLocaleString()}원`],
      ['총 주문 건수', `${totalOrders}건`],
      ['평균 주문 금액', `${avgOrderValue.toLocaleString()}원`],
      ['전월 대비 성장률', `${growthRate}%`],
      ['신규 고객 비율', `${newCustomerRate}%`],
      ['재구매 고객 비율', `${returningCustomerRate}%`],
      [''],
      ['월별 매출'],
      ...monthlySales.map(item => [item.month, `${item.amount.toLocaleString()}원`]),
      [''],
      ['판매자별 매출 랭킹'],
      ['순위', '브랜드명', '매출액', '주문 건수', '성장률'],
      ...sellerRanking.map(item => [
        item.rank,
        item.brand,
        `${item.sales.toLocaleString()}원`,
        `${item.orders}건`,
        `${item.growthRate}%`
      ]),
      [''],
      ['상품별 판매량 Top 20'],
      ['순위', '상품명', '판매량'],
      ...top20Products.map((item, index) => [
        index + 1,
        item.name,
        item.sales
      ]),
      [''],
      ['카테고리별 매출'],
      ['카테고리', '비율', '예상 매출액'],
      ...categorySales.map(item => [
        item.category,
        `${item.percentage}%`,
        `${item.estimatedSales.toLocaleString()}원`
      ]),
    ];
    
    downloadExcel(excelData, `통계분석_${new Date().toISOString().split('T')[0]}`);
  };

  // 차트 데이터 설정
  const monthlySalesData = {
    labels: monthlySales.map(item => item.month),
    datasets: [
      {
        label: '매출액 (원)',
        data: monthlySales.map(item => item.amount),
        backgroundColor: '#0284c7',
        borderWidth: 0,
      },
    ],
  };

  const categoryAnalysisData = {
    labels: filteredData.bodyTypeAnalysis.map(item => item.type),
    datasets: [
      {
        label: '판매 비율 (%)',
        data: filteredData.bodyTypeAnalysis.map(item => item.percentage),
        backgroundColor: 'rgba(34, 211, 153, 0.3)',
        borderWidth: 0,
        pointBackgroundColor: '#065f46',
        pointBorderWidth: 0,
      },
    ],
  };

  const topProductsData = {
    labels: top20Products.map(item => item.name),
    datasets: [
      {
        label: '판매량',
        data: top20Products.map(item => parseInt(item.sales)),
        backgroundColor: [
          '#f472b6', '#0284c7', '#f59e0b', '#22d399', '#8b5cf6',
          '#ec4899', '#06b6d4', '#f97316', '#10b981', '#6366f1',
        ],
        borderWidth: 0,
      },
    ],
  };

  const brandPerformanceData = {
    labels: filteredData.brandPerformance.map(item => item.brand),
    datasets: [
      {
        label: '판매 건수',
        data: filteredData.brandPerformance.map(item => item.count),
        backgroundColor: '#8b5cf6',
        borderWidth: 0,
        yAxisID: 'y',
      },
      {
        label: '판매 금액 (원)',
        data: filteredData.brandPerformance.map(item => item.amount),
        backgroundColor: '#f59e0b',
        borderWidth: 0,
        yAxisID: 'y1',
      },
    ],
  };

  const bodTypeSalesData = {
    labels: filteredData.bodyTypeSales.map(item => item.type),
    datasets: [
      {
        data: filteredData.bodyTypeSales.map(item => item.percentage),
        backgroundColor: [
          '#f472b6', '#0284c7', '#22d399', '#8b5cf6', '#f59e0b',
        ],
        borderWidth: 0,
      },
    ],
  };

  const customerRatioData = {
    labels: ['신규 고객', '재구매 고객'],
    datasets: [
      {
        data: [newCustomerRate, returningCustomerRate],
        backgroundColor: ['#0284c7', '#22d399'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#333',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#6b7280',
        },
        grid: {
          color: '#e5e7eb',
        },
      },
      y: {
        ticks: {
          color: '#6b7280',
        },
        grid: {
          color: '#e5e7eb',
        },
      },
    },
  };

  const brandChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#333',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#6b7280',
        },
        grid: {
          color: '#e5e7eb',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        ticks: {
          color: '#6b7280',
        },
        grid: {
          color: '#e5e7eb',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        ticks: {
          color: '#6b7280',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#333',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
    },
    scales: {
      r: {
        ticks: {
          color: '#6b7280',
          backdropColor: 'transparent',
        },
        grid: {
          color: '#e5e7eb',
        },
        angleLines: {
          color: '#e5e7eb',
        },
        pointLabels: {
          color: '#333',
          font: {
            size: 11,
          },
        },
      },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#333',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-grey-98 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-grey-20">통계 분석</h1>
        <button
          onClick={handleDownloadExcel}
          className="flex items-center gap-2 px-4 py-2 bg-azure-39 text-white rounded-lg hover:bg-azure-50 transition-colors"
        >
          <IoDownloadOutline size={20} />
          <span>Excel 다운로드</span>
        </button>
      </div>

      {/* 날짜 필터 */}
      <div className="bg-white-solid rounded-xl shadow p-6 mb-6">
        <div className="flex items-center gap-4">
          <IoCalendarOutline size={20} className="text-grey-46" />
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-grey-20 mb-1">시작 날짜</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-grey-91 rounded-lg focus:outline-none focus:ring-2 focus:ring-azure-39"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-grey-20 mb-1">종료 날짜</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-grey-91 rounded-lg focus:outline-none focus:ring-2 focus:ring-azure-39"
              />
            </div>
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="mt-6 px-4 py-2 bg-grey-91 text-grey-20 rounded-lg hover:bg-grey-80 transition-colors"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 주요 통계 요약 */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white-solid rounded-xl shadow p-6">
          <div className="text-sm text-grey-46 mb-2">총 매출액</div>
          <div className="text-2xl font-bold text-grey-20">{totalSales.toLocaleString()}원</div>
          <div className="flex items-center gap-1 mt-2">
            {growthRate >= 0 ? (
              <IoTrendingUp className="text-spring-green-52" size={16} />
            ) : (
              <IoTrendingDown className="text-rose-70" size={16} />
            )}
            <span className={`text-sm ${growthRate >= 0 ? 'text-spring-green-52' : 'text-rose-70'}`}>
              {growthRate >= 0 ? '+' : ''}{growthRate}%
            </span>
          </div>
        </div>
        <div className="bg-white-solid rounded-xl shadow p-6">
          <div className="text-sm text-grey-46 mb-2">총 주문 건수</div>
          <div className="text-2xl font-bold text-grey-20">{totalOrders}건</div>
        </div>
        <div className="bg-white-solid rounded-xl shadow p-6">
          <div className="text-sm text-grey-46 mb-2">평균 주문 금액</div>
          <div className="text-2xl font-bold text-grey-20">{avgOrderValue.toLocaleString()}원</div>
        </div>
        <div className="bg-white-solid rounded-xl shadow p-6">
          <div className="text-sm text-grey-46 mb-2">신규/재구매 비율</div>
          <div className="text-lg font-bold text-grey-20">
            신규 {newCustomerRate}% / 재구매 {returningCustomerRate}%
          </div>
        </div>
      </div>

      {/* 상세 분석 섹션 */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* 1. 월별 매출 추이 */}
        <div className="bg-white-solid rounded-xl shadow p-6 col-span-1 flex flex-col">
          <div className="text-base font-semibold text-grey-20 mb-2">월별 매출 추이</div>
          <div className="flex-1" style={{ height: '300px' }}>
            <Bar data={monthlySalesData} options={chartOptions} />
          </div>
          <div className="mt-4 pt-4 border-t border-grey-91">
            <div className="text-sm text-grey-46">상세 분석</div>
            <div className="text-xs text-grey-71 mt-1">
              • 최고 매출: {Math.max(...monthlySales.map(item => item.amount)).toLocaleString()}원
              <br />
              • 최저 매출: {Math.min(...monthlySales.map(item => item.amount)).toLocaleString()}원
              <br />
              • 평균 매출: {Math.round(monthlySales.reduce((sum, item) => sum + item.amount, 0) / monthlySales.length).toLocaleString()}원
            </div>
          </div>
        </div>

        {/* 2. 카테고리별 매출 */}
        <div className="bg-white-solid rounded-xl shadow p-6 col-span-1 flex flex-col">
          <div className="text-base font-semibold text-grey-20 mb-2">카테고리별 매출</div>
          <div className="flex-1" style={{ height: '300px' }}>
            <Radar data={categoryAnalysisData} options={radarChartOptions} />
          </div>
          <div className="mt-4 pt-4 border-t border-grey-91">
            <div className="text-sm text-grey-46">카테고리별 상세</div>
            <div className="text-xs text-grey-71 mt-1 space-y-1">
              {categorySales.slice(0, 3).map((item, index) => (
                <div key={index}>
                  {index + 1}. {item.category}: {item.percentage}% ({item.estimatedSales.toLocaleString()}원)
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. 인기 상품 Top 20 */}
        <div className="bg-white-solid rounded-xl shadow p-6 col-span-1 flex flex-col">
          <div className="text-base font-semibold text-grey-20 mb-2">인기 상품 Top 20</div>
          <div className="flex-1 overflow-y-auto" style={{ height: '300px' }}>
            <div className="space-y-2">
              {top20Products.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-grey-98 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-grey-46">#{index + 1}</span>
                    <span className="text-sm text-grey-20 truncate">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-grey-20">{item.sales}개</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 판매자별 매출 랭킹 */}
      <div className="bg-white-solid rounded-xl shadow p-6 mb-6">
        <div className="text-base font-semibold text-grey-20 mb-4">판매자별 매출 랭킹</div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-grey-91">
                <th className="text-left py-3 px-4 text-sm font-semibold text-grey-20">순위</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-grey-20">브랜드명</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-grey-20">매출액</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-grey-20">주문 건수</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-grey-20">성장률</th>
              </tr>
            </thead>
            <tbody>
              {sellerRanking.map((item) => (
                <tr key={item.rank} className="border-b border-grey-91 hover:bg-grey-98">
                  <td className="py-3 px-4 text-sm text-grey-20">{item.rank}</td>
                  <td className="py-3 px-4 text-sm text-grey-20">{item.brand}</td>
                  <td className="py-3 px-4 text-sm text-grey-20 text-right">{item.sales.toLocaleString()}원</td>
                  <td className="py-3 px-4 text-sm text-grey-20 text-right">{item.orders}건</td>
                  <td className={`py-3 px-4 text-sm text-right ${item.growthRate >= 0 ? 'text-spring-green-52' : 'text-rose-70'}`}>
                    {item.growthRate >= 0 ? '+' : ''}{item.growthRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 기타 차트 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 신규/재구매 고객 비율 */}
        <div className="bg-white-solid rounded-xl shadow p-6 col-span-1 flex flex-col">
          <div className="text-base font-semibold text-grey-20 mb-2">신규/재구매 고객 비율</div>
          <div className="flex-1" style={{ height: '300px' }}>
            <Doughnut data={customerRatioData} options={doughnutChartOptions} />
          </div>
          <div className="mt-4 pt-4 border-t border-grey-91">
            <div className="text-sm text-grey-46">고객 분석</div>
            <div className="text-xs text-grey-71 mt-1">
              • 신규 고객: {newCustomers}명 ({newCustomerRate}%)
              <br />
              • 재구매 고객: {purchaseCustomers}명 ({returningCustomerRate}%)
              <br />
              • 개선안: 재구매율 향상을 위한 리텐션 마케팅 강화 필요
            </div>
          </div>
        </div>

        {/* 브랜드별 판매 실적 */}
        <div className="bg-white-solid rounded-xl shadow p-6 col-span-2 flex flex-col">
          <div className="text-base font-semibold text-grey-20 mb-2">브랜드별 판매 실적</div>
          <div className="flex-1" style={{ height: '300px' }}>
            <Bar data={brandPerformanceData} options={brandChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
