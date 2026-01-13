"use client";

import { useDebounce } from "@/hooks/common/useDebounce";
import { useQueryString } from "@/hooks/common/useQueryString";
import { UserRole } from "@/serivces/user/type";
import { useEffect, useState } from "react";

export const AccountTab = () => {
  const [role, setRole] = useQueryString<string>("role", "");

  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(tempSearchTerm, 500);
  const [, setSearchTerm] = useQueryString<string>("searchTerm", "");

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
              role === ""
                ? "border-blue-40 bg-white text-blue-40"
                : "border-transparent bg-grey-96 text-grey-47 hover:bg-white"
            }
          `}
          onClick={() => setRole("")}
        >
          전체
        </button>

        {Object.values(UserRole).map((item) => (
          <button
            key={"role" + item}
            className={`px-4 py-2 rounded-t-md text-sm font-semibold border-b-2 transition-all duration-150 ${
              role === item
                ? "border-blue-40 bg-white text-blue-40"
                : "border-transparent bg-grey-96 text-grey-47 hover:bg-white"
            }`}
            onClick={() => setRole(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="relative w-full md:w-72">
        <input
          type="text"
          className="w-full px-4 py-2 border border-grey-91 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-40"
          placeholder="이름, 이메일, 역할로 검색..."
          value={tempSearchTerm}
          onChange={(e) => setTempSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};
