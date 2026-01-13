import { AccountList } from "@/components/admin-setting/AccountList";
import { AccountTab } from "@/components/admin-setting/AccountTab";
import { Suspense } from "react";

export default function AdminSetting() {
  return (
    <div className="p-8 bg-grey-98 min-h-screen">
      {/* 상단 제목 및 설명 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azure-11 mb-1">설정</h1>
        <p className="text-sm text-grey-46">
          계정 관리를 비롯한 다양한 설정을 할 수 있습니다.
        </p>
      </div>

      {/* 탭 & 검색 */}
      <Suspense>
        <AccountTab />

        <AccountList />
      </Suspense>
    </div>
  );
}
