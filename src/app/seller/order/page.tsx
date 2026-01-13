"use client";

import { Pagination } from "@/components/common/Pagination";
import { OrderManageModal } from "@/components/seller-order/OrderManageModal";
import { OrderListView } from "@/components/seller-order/OrderListView";
import { OrderFilterBar } from "@/components/seller-order/OrderFilterBar";
import { useGetOrderListByBrand } from "@/serivces/order/query";
import { Order } from "@/serivces/order/type";
import { useGetUser } from "@/serivces/user/query";
import { useState } from "react";
import { OrderSubHeader } from "@/components/seller-order/OrderSubHeader";

export default function SellerOrder() {
  const [, , { data: brand }] = useGetUser();
  const { data: ordersData } = useGetOrderListByBrand(brand?.id ?? "");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const orderList = ordersData?.orders;
  const lastPage = ordersData?.lastPage;
  const total = ordersData?.total;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-white px-6 pt-4 pb-2">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-medium text-gray-900">주문 관리</h1>
            <p className="text-sm text-gray-500 mt-1">
              전체 주문 {total || 0}건
            </p>
          </div>
        </div>
      </div>

      {/* 서브 헤더 */}
      <OrderSubHeader />

      {/* 필터 바 (OM-002, OM-004, OM-005, OM-008, OM-009) */}
      <OrderFilterBar />

      {/* 주문 목록 */}
      <OrderListView orders={orderList} onSelectOrder={setSelectedOrder} />

      {lastPage ? <Pagination lastPage={lastPage} /> : null}

      {selectedOrder && (
        <OrderManageModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
