"use client";

import { useQueryString } from "@/hooks/common/useQueryString";
import { useGetCustomerList } from "@/serivces/admin/query";
import { formatDate } from "@/utils/date";
import { Pagination } from "../common/Pagination";
import { Customer } from "@/serivces/admin/type";
import { useState } from "react";
import { CustomerDetailModal } from "./CustomerDetail";

export const CustomerList = () => {
  const { data: customersData } = useGetCustomerList();

  const customerList = customersData?.customers;
  const lastPage = customersData?.lastPage;

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  return (
    <>
      <div className='bg-white rounded-lg shadow-sm overflow-x-auto'>
        <table className='min-w-full text-sm'>
          <thead>
            <tr className='bg-grey-96 text-grey-33'>
              <th className='px-4 py-3 font-semibold text-left'>고객명</th>
              <th className='px-4 py-3 font-semibold text-left'>연락처</th>
              <th className='px-4 py-3 font-semibold text-left'>최근 방문일</th>
              <th className='px-4 py-3 font-semibold text-left'>체형 타입</th>
              <th className='px-4 py-3 font-semibold text-left'>퍼스널 컬러</th>
              <th className='px-4 py-3 font-semibold text-left'>누적 구매액</th>
              <th className='px-4 py-3 font-semibold text-left'>관리</th>
            </tr>
          </thead>

          <tbody>
            {customerList?.map((customer) => (
              <tr
                key={"customer" + customer.id}
                className='border-t border-grey-91'
              >
                <td className='px-4 py-3'>
                  {customer.name}
                  {customer.isVip && (
                    <span className='ml-2 inline-block px-2 py-1 text-xs rounded bg-orange-90 text-orange-20 font-semibold'>
                      VIP
                    </span>
                  )}
                </td>
                <td className='px-4 py-3'>{customer.phone}</td>
                <td className='px-4 py-3'>
                  {customer.lastVisitDate && formatDate(customer.lastVisitDate)}
                </td>
                <td className='px-4 py-3'>{customer.bodyType}</td>
                <td className='px-4 py-3'>{customer.colorSeason}</td>
                <td className='px-4 py-3'>
                  {customer.purchaseInfo?.totalAmount
                    ? `₩${customer.purchaseInfo?.totalAmount.toLocaleString()}`
                    : "₩0"}
                </td>
                <td className='px-4 py-3'>
                  <button
                    className='text-blue-40 hover:underline'
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    상세보기
                  </button>
                </td>
              </tr>
            ))}

            {customerList && customerList?.length === 0 && (
              <tr>
                <td colSpan={7} className='px-4 py-3 text-center text-grey-47'>
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {selectedCustomer && (
          <CustomerDetailModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
          />
        )}
      </div>

      {lastPage ? <Pagination lastPage={lastPage} /> : null}
    </>
  );
};
