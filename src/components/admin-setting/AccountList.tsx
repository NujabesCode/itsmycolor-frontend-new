"use client";

import { useGetAccountList } from "@/serivces/admin/query";
import { Account } from "@/serivces/admin/type";
import { useState } from "react";
import { AccountEditModal } from "./AccountEditModal";
import { Pagination } from "../common/Pagination";

export const AccountList = () => {
  const { data: accountsData } = useGetAccountList();

  const accountList = accountsData?.accounts;
  const lastPage = accountsData?.lastPage;

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-grey-96 text-grey-33">
              <th className="px-4 py-3 font-semibold text-left">이름</th>
              <th className="px-4 py-3 font-semibold text-left">이메일</th>
              <th className="px-4 py-3 font-semibold text-left">역할</th>
              <th className="px-4 py-3 font-semibold text-left">
                마지막 로그인
              </th>
              <th className="px-4 py-3 font-semibold text-left">상태</th>
              <th className="px-4 py-3 font-semibold text-left">관리</th>
            </tr>
          </thead>

          <tbody>
            {accountList?.map((account) => (
              <tr
                key={"account" + account.id}
                className="border-t border-grey-91"
              >
                <td className="px-4 py-3">{account.name}</td>
                <td className="px-4 py-3">{account.email}</td>
                <td className="px-4 py-3">{account.role}</td>
                <td className="px-4 py-3">{account.createdAt}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded ${
                      account.isActive
                        ? "bg-spring-green-90 text-spring-green-20"
                        : "bg-grey-91 text-grey-47"
                    } font-semibold`}
                  >
                    {account.isActive ? "활성" : "비활성"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    className="text-blue-40 hover:underline"
                    onClick={() => setSelectedAccount(account)}
                  >
                    편집
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedAccount && (
          <AccountEditModal
            account={selectedAccount}
            onClose={() => setSelectedAccount(null)}
          />
        )}
      </div>

      {lastPage ? <Pagination lastPage={lastPage} /> : null}
    </>
  );
};
