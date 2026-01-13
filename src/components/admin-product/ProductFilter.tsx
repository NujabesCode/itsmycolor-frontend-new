'use client';

import { useDebounce } from '@/hooks/common/useDebounce';
import { useQueryString } from '@/hooks/common/useQueryString';
import { BodyType } from '@/serivces/user/type';
import { useEffect, useState } from 'react';

export const ProductFilter = () => {
  const [sort, setSort] = useQueryString<string>('sort', 'latest');
  const [bodyType, setBodyType] = useQueryString<string>('bodyType', '');

  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(tempSearchTerm, 500);
  const [, setSearchTerm] = useQueryString<string>('search', '');

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-t-md text-sm font-semibold border-b-2 transition-all duration-150
            ${
              bodyType === ''
                ? 'border-blue-40 bg-white text-blue-40'
                : 'border-transparent bg-grey-96 text-grey-47 hover:bg-white'
            }
          `}
          onClick={() => setBodyType('')}
        >
          체형 전체
        </button>

        {Object.values(BodyType).map((item) => (
          <button
            key={'bodyType' + item}
            className={`px-4 py-2 rounded-t-md text-sm font-semibold border-b-2 transition-all duration-150 ${
              bodyType === item
                ? 'border-blue-40 bg-white text-blue-40'
                : 'border-transparent bg-grey-96 text-grey-47 hover:bg-white'
            }`}
            onClick={() => setBodyType(item)}
          >
            {item}
          </button>
        ))}

        <select
          className="px-4 py-2 rounded-t-md text-sm font-semibold border-b-2 border-transparent bg-grey-96 text-grey-47 hover:bg-white focus:outline-none focus:border-blue-40 focus:bg-white focus:text-blue-40"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="latest">최신순</option>
          <option value="old">오래된순</option>
        </select>
      </div>

      <div className="relative w-full md:w-72">
        <input
          type="text"
          className="w-full px-4 py-2 border border-grey-91 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-40"
          placeholder="브랜드명으로 검색..."
          value={tempSearchTerm}
          onChange={(e) => setTempSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};
