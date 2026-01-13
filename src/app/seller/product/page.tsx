'use client';

import { Pagination } from '@/components/common/Pagination';
import { ROUTE } from '@/configs/constant/route';
import { useGetProductListByBrand, useDeleteProduct } from '@/serivces/product/query';
import { useGetUser } from '@/serivces/user/query';
import { formatDate } from '@/utils/date';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { IoAdd, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';

export default function SellerProduct() {
  const [, , { data: brand }] = useGetUser();
  const { data: productsData } = useGetProductListByBrand(brand?.id ?? '');

  const productList = productsData?.products;
  const lastPage = productsData?.lastPage;

  const total = productsData?.total;

  const { mutate: deleteProduct } = useDeleteProduct();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-medium text-gray-900">상품 관리</h1>
            <p className="text-sm text-gray-500 mt-1">
              등록된 상품 {total || 0}개
            </p>
          </div>
          <Link
            href={ROUTE.SELLER_PRODUCT_FORM()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-900 text-sm rounded hover:bg-gray-50 transition-colors"
          >
            <IoAdd className="text-lg" />
            상품 등록
          </Link>
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상품 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    판매가
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    등록일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    재고
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productList?.map((item, idx) => (
                  <tr key={'product' + idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 relative flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt="상품 이미지"
                              fill
                              className="object-cover rounded-lg"
                              unoptimized
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">이미지 없음</div>';
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
                              이미지 없음
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">{item.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {item.price.toLocaleString()}원 (
                      {item.usdPrice.toLocaleString()}$)
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {item.stockQuantity.toLocaleString()}개
                    </td>
                    <td className="px-6 py-4">
                      {item.isAvailable ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          판매중
                        </span>
                      ) : item.rejectionReason ? (
                        // PD-011: 반려 사유가 있는 경우 반려 상태 표시 및 툴팁
                        <div className="relative group">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 cursor-help">
                            반려됨
                          </span>
                          <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <div className="font-semibold mb-1">반려 사유:</div>
                            <div className="text-gray-200">{item.rejectionReason}</div>
                            <div className="absolute bottom-0 left-4 transform translate-y-full">
                              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          승인 대기
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={ROUTE.SELLER_PRODUCT_FORM(item.id)}
                        className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <IoCreateOutline className="text-lg" />
                        <span className="text-sm">수정</span>
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('상품을 삭제하시겠습니까?')) {
                            deleteProduct(item.id);
                          }
                        }}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors ml-3"
                      >
                        <IoTrashOutline className="text-lg" />
                        <span className="text-sm">삭제</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 빈 상태 */}
          {(!productList || productList.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">등록된 상품이 없습니다.</p>
              <Link
                href={ROUTE.SELLER_PRODUCT_FORM()}
                className="inline-flex items-center gap-2 text-sm text-gray-900 font-medium hover:underline"
              >
                <IoAdd />첫 상품 등록하기
              </Link>
            </div>
          )}
        </div>
      </div>

      {lastPage ? <Pagination lastPage={lastPage} /> : null}
    </div>
  );
}
