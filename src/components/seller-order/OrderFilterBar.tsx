"use client";

import { useQueryString } from "@/hooks/common/useQueryString";
import { OrderStatus } from "@/serivces/order/type";
import { useState } from "react";
import { IoSearch, IoDownloadOutline } from "react-icons/io5";
import { useGetUser } from "@/serivces/user/query";
import { orderApi } from "@/serivces/order/request";

export const OrderFilterBar = () => {
  const [, , { data: brand }] = useGetUser();
  const [search, setSearch] = useQueryString<string>('search', '');
  const [tempSearch, setTempSearch] = useState(search);
  const [startDate, setStartDate] = useQueryString<string>('startDate', '');
  const [endDate, setEndDate] = useQueryString<string>('endDate', '');
  const [sortBy, setSortBy] = useQueryString<string>('sortBy', 'createdAt');
  const [sortOrder, setSortOrder] = useQueryString<'ASC' | 'DESC'>('sortOrder', 'DESC');

  // OM-002: 주문번호 검색
  const handleSearch = () => {
    setSearch(tempSearch);
  };

  // OM-009: 엑셀 다운로드
  const handleExcelDownload = async () => {
    try {
      const result = await orderApi.getOrderListByBrand(brand?.id ?? '', {
        search: search || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || undefined,
      });

      // CSV 형식으로 변환
      const headers = ['주문번호', '주문일시', '고객명', '연락처', '상품명', '수량', '결제금액', '상태'];
      const rows = result.orders.map((order: any) => [
        order.id,
        order.createdAt,
        order.recipientName,
        order.recipientPhone,
        order.orderItems[0]?.productName || '',
        order.orderItems[0]?.quantity || 0,
        order.totalAmount,
        order.status,
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row: any[]) => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `주문목록_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('엑셀 다운로드 실패:', error);
      alert('엑셀 다운로드에 실패했습니다.');
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* OM-002: 주문번호 검색 */}
        <div className="flex-1 relative">
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="주문번호로 검색"
            value={tempSearch}
            onChange={(e) => setTempSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* OM-004: 날짜 필터 */}
        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="self-center text-gray-500">~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* OM-008: 정렬 */}
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt">주문일시</option>
            <option value="id">주문번호</option>
            <option value="totalAmount">결제금액</option>
            <option value="status">상태</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {sortOrder === 'ASC' ? '↑' : '↓'}
          </button>
        </div>

        {/* 검색 버튼 */}
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          검색
        </button>

        {/* 필터 초기화 버튼 */}
        {(search || startDate || endDate) && (
          <button
            onClick={() => {
              setSearch('');
              setTempSearch('');
              setStartDate('');
              setEndDate('');
            }}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            초기화
          </button>
        )}

        {/* OM-009: 엑셀 다운로드 */}
        <button
          onClick={handleExcelDownload}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <IoDownloadOutline size={18} />
          엑셀 다운로드
        </button>
      </div>
    </div>
  );
};

