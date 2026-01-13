"use client";

import { useQueryString } from "@/hooks/common/useQueryString";

const tabs = [
  { id: 0, label: "상품정보" },
  { id: 1, label: "리뷰" },
  { id: 2, label: "Q&A" },
  { id: 3, label: "배송/교환/반품" },
];

export const ProductDetailTab = () => {
  const [, setPage] = useQueryString<number>("page", 1);
  const [tabIndex, setTabIndex] = useQueryString<number>("tabIndex", 0);

  const moveIndex = (index: number) => {
    const prevParam = setPage(1);
    setTabIndex(index, prevParam);
  };

  return (
    <div className="border-b border-gray-200">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = tabIndex === tab.id;
          
          return (
            <button
              key={tab.id}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
              onClick={() => moveIndex(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
