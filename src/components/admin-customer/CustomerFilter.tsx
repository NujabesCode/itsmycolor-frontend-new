'use client';

import { useDebounce } from '@/hooks/common/useDebounce';
import { useQueryString } from '@/hooks/common/useQueryString';
import { ColorSeason } from '@/serivces/color-analysis/type';
import { BodyType } from '@/serivces/user/type';
import { CustomerType } from '@/serivces/admin/type';
import { useEffect, useState } from 'react';

export const CustomerFilter = () => {
  const [customerType, setCustomerType] = useQueryString<string>(
    'customerType',
    ''
  );
  const [bodyType, setBodyType] = useQueryString<string>('bodyType', '');
  const [colorSeason, setColorSeason] = useQueryString<string>(
    'colorSeason',
    ''
  );

  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(tempSearchTerm, 500);
  const [, setSearchTerm] = useQueryString<string>('searchTerm', '');

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      {/* 고객 타입 탭 */}
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-t-md text-sm font-semibold border-b-2 transition-all duration-150
            ${
              customerType === ''
                ? 'border-blue-40 bg-white text-blue-40'
                : 'border-transparent bg-grey-96 text-grey-47 hover:bg-white'
            }
          `}
          onClick={() => setCustomerType('')}
        >
          전체
        </button>

        {Object.values(CustomerType).map((type) => (
          <button
            key={'customerType' + type}
            className={`px-4 py-2 rounded-t-md text-sm font-semibold border-b-2 transition-all duration-150 ${
              customerType === type
                ? 'border-blue-40 bg-white text-blue-40'
                : 'border-transparent bg-grey-96 text-grey-47 hover:bg-white'
            }`}
            onClick={() => setCustomerType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* 필터 및 검색 */}
      <div className="flex gap-2 items-center">
        <select
          className="px-3 py-2 border border-grey-91 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-40"
          value={bodyType}
          onChange={(e) => setBodyType(e.target.value as BodyType | '')}
        >
          <option value="">체형 타입</option>
          {Object.values(BodyType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          className="px-3 py-2 border border-grey-91 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-40"
          value={colorSeason}
          onChange={(e) => setColorSeason(e.target.value as ColorSeason | '')}
        >
          <option value="">퍼스널 컬러</option>
          {Object.values(ColorSeason).map((season) => (
            <option key={season} value={season}>
              {season}
            </option>
          ))}
        </select>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            className="w-full px-4 py-2 border border-grey-91 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-40"
            placeholder="고객명, 연락처, 이메일로 검색..."
            value={tempSearchTerm}
            onChange={(e) => setTempSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
