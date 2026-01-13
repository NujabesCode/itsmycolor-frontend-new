'use client';

import { useGetBrandList } from '@/serivces/admin/query';
import { Brand, BrandStatus } from '@/serivces/brand/type';
import { useState } from 'react';
import { adminApi } from '@/serivces/admin/request';
import { BrandManageModal } from './BrandManageModal';
import { BrandConnectUrlModal } from './BrandConnectUrlModal';
import { formatDate } from '@/utils/date';

export const BrandList = () => {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [connectUrl, setConnectUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  // SM-002: 검색 기능
  const [searchTerm, setSearchTerm] = useState('');

  const generateConnectUrl = async (brandId: string) => {
    setIsGenerating(true);
    try {
      const res = await adminApi.postBrandConnectUrl(brandId);
      const url = (res.data?.connectUrl ?? res.data) as string;
      setConnectUrl(url);
    } catch (error) {
      alert('가입 URL 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const { data: approvedBrandList } = useGetBrandList(BrandStatus.APPROVED);
  const { data: pendingBrandList } = useGetBrandList(BrandStatus.PENDING);

  // SM-002: 검색 필터링
  const filteredApprovedList = approvedBrandList?.filter((brand) =>
    !searchTerm ||
    brand.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.representativeName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredPendingList = pendingBrandList?.filter((brand) =>
    !searchTerm ||
    brand.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.representativeName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <>
      {/* SM-002: 검색 기능 */}
      <section className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-grey-33">
              판매자 관리
            </h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="사업자명/브랜드명/대표자명으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm w-64"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 입점 브랜드 현황 */}
      <section className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-grey-33 mb-4">
            입점 브랜드 현황
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-grey-96 text-grey-33">
                  <th className="px-4 py-3 font-semibold text-left">
                    브랜드명
                  </th>
                  <th className="px-4 py-3 font-semibold text-left">입점자</th>
                  <th className="px-4 py-3 font-semibold text-left">
                    입점일시
                  </th>
                  <th className="px-4 py-3 font-semibold text-left">상품수</th>
                  {/* <th className="px-4 py-3 font-semibold text-left">
                    총 결제액
                  </th>
                  <th className="px-4 py-3 font-semibold text-left">
                    채널 특성
                  </th>
                  <th className="px-4 py-3 font-semibold text-left">
                    채형 특화
                  </th> */}
                  <th className="px-4 py-3 font-semibold text-left">
                    가입 url
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredApprovedList.map((brand) => (
                  <tr key={brand.id} className="border-t border-grey-91">
                    <td className="px-4 py-3">{brand.name}</td>
                    <td className="px-4 py-3">{brand.representativeName}</td>
                    <td className="px-4 py-3">{formatDate(brand.createdAt)}</td>
                    <td className="px-4 py-3">{brand.products.length}</td>
                    {/* <td className="px-4 py-3">-</td>
                    <td className="px-4 py-3">-</td>
                    <td className="px-4 py-3">-</td> */}
                    <td className="px-4 py-3">
                      <button
                        className="text-blue-40 hover:underline disabled:text-grey-60"
                        onClick={() => generateConnectUrl(brand.id)}
                        disabled={isGenerating}
                      >
                        {isGenerating ? '생성 중...' : '생성하기'}
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredApprovedList.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-grey-47"
                    >
                      입점 브랜드가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 입점 신청 현황 */}
      <section className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-grey-33 mb-4">
            입점 신청 현황
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-grey-96 text-grey-33">
                  <th className="px-4 py-3 font-semibold text-left">회사명</th>
                  <th className="px-4 py-3 font-semibold text-left">
                    브랜드명
                  </th>
                  <th className="px-4 py-3 font-semibold text-left">신청일</th>
                  <th className="px-4 py-3 font-semibold text-left">
                    심사 상태
                  </th>
                  <th className="px-4 py-3 font-semibold text-left">관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredPendingList.map((brand) => (
                  <tr key={brand.id} className="border-t border-grey-91">
                    <td className="px-4 py-3">{brand?.companyName}</td>
                    <td className="px-4 py-3">{brand?.name}</td>
                    <td className="px-4 py-3">{formatDate(brand.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 text-xs rounded bg-yellow-90 text-yellow-20 font-semibold">
                        심사대기
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="text-blue-40 hover:underline"
                        onClick={() => setSelectedBrand(brand)}
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredPendingList.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-grey-47"
                    >
                      신청 대기 브랜드가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {selectedBrand && (
        <BrandManageModal
          brand={selectedBrand}
          onClose={() => setSelectedBrand(null)}
        />
      )}
      {connectUrl && (
        <BrandConnectUrlModal url={connectUrl} onClose={() => setConnectUrl(null)} />
      )}
    </>
  );
};
