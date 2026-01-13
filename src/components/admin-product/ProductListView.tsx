'use client';

import { useGetProductList } from '@/serivces/admin/query';
import { Pagination } from '../common/Pagination';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ProductListItem } from '@/serivces/product/type';
import { ProductEditModal } from './ProductEditModal';
import { useQueryString } from '@/hooks/common/useQueryString';

export const ProductListView = () => {
  const [modalId, setModalId] = useQueryString<string>('modalId', '');
  const [selectedProduct, setSelectedProduct] =
    useState<ProductListItem | null>(null);

  const { data: productData } = useGetProductList();

  const productList = productData?.products;
  const lastPage = productData?.lastPage;

  useEffect(() => {
    if (modalId && productList) {
      setSelectedProduct(
        productList.find((product) => product.id === modalId) || null
      );
    } else {
      setSelectedProduct(null);
    }
  }, [productList, modalId]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-grey-96 text-grey-33">
              <th className="px-4 py-3 font-semibold text-left">상품 이미지</th>
              <th className="px-4 py-3 font-semibold text-left">상품명</th>
              <th className="px-4 py-3 font-semibold text-left">판매가</th>
              <th className="px-4 py-3 font-semibold text-left">체형 분류</th>
              <th className="px-4 py-3 font-semibold text-left">판매 상태</th>
              <th className="px-4 py-3 font-semibold text-left">관리</th>
            </tr>
          </thead>

          <tbody>
            {productList?.map((item) => (
              <tr key={'product' + item.id} className="border-t border-grey-91">
                <td className="px-4 py-3">
                  <div className="w-16 h-16 relative">
                    <Image
                      src={item.imageUrl}
                      alt="상품 이미지"
                      fill
                      className="object-cover rounded-md"
                      sizes="64px"
                    />
                  </div>
                </td>
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">
                  {item.price.toLocaleString()}원 ({item.usdPrice.toLocaleString()}$)
                </td>
                <td className="px-4 py-3">{item.recommendedBodyType ?? '-'}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded ${
                      item.isAvailable
                        ? 'bg-spring-green-90 text-spring-green-20'
                        : 'bg-grey-91 text-grey-47'
                    } font-semibold`}
                  >
                    {item.isAvailable ? '판매 중' : '승인 대기'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    className="text-blue-40 hover:underline"
                    onClick={() => setModalId(item.id)}
                  >
                    편집
                  </button>
                </td>
              </tr>
            ))}

            {productList?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-grey-47">
                  등록된 상품이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {selectedProduct && (
          <ProductEditModal
            product={selectedProduct}
            onClose={() => {
              setModalId('');
              setSelectedProduct(null);
            }}
          />
        )}
      </div>

      {lastPage ? <Pagination lastPage={lastPage} /> : null}
    </>
  );
};
