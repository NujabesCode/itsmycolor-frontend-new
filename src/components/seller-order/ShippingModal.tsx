"use client";

import { QUERY } from "@/configs/constant/query";
import { orderApi } from "@/serivces/order/request";
import { OrderStatus } from "@/serivces/order/type";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// 추가: 선택 가능한 택배사 목록
const COURIER_OPTIONS = [
  "CJ대한통운",
  "동원로엑스(구.동부익스프레스)",
  "로젠택배",
  "스피디익스프레스",
  "한진택배(한진익스프레스통합)",
  "우체국택배",
  "롯데택배(구.현대택배)",
  "천일택배",
  "경동택배",
  "일양로지스",
  "대신택배",
  "CU편의점택배",
  "CVSNET편의점택배",
  "합동택배",
  "건영택배",
  "농협택배",
  "한의사랑택배",
  "한서택배",
  "홈픽택배",
  "굿투럭",
  "우리한방택배",
  "대림통운",
];

interface ShippingModalProps {
  orderIds: string[];
  onClose: () => void;
}

export const ShippingModal = ({ orderIds, onClose }: ShippingModalProps) => {
  const queryClient = useQueryClient();
  const [shippingInfos, setShippingInfos] = useState(
    orderIds.map(() => ({ courier: "", trackingNumber: "" }))
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    index: number,
    field: "courier" | "trackingNumber",
    value: string,
  ) => {
    setShippingInfos((prev) =>
      prev.map((info, idx) =>
        idx === index ? { ...info, [field]: value } : info,
      ),
    );
  };

  const handleSave = async () => {
    // OM-023: 송장번호 미입력 검증
    const hasEmptyField = shippingInfos.some(
      (info) => !info.courier.trim() || !info.trackingNumber.trim(),
    );

    if (hasEmptyField) {
      alert("모든 주문의 택배사와 송장 번호를 입력해주세요.");
      return;
    }

    // OM-024: 동일 송장번호 중복 검증 (같은 모달 내에서)
    const trackingNumbers = shippingInfos.map(info => info.trackingNumber.trim());
    const duplicates = trackingNumbers.filter((num, idx) => trackingNumbers.indexOf(num) !== idx);
    if (duplicates.length > 0) {
      alert("동일한 송장번호가 중복 입력되었습니다. 각 주문마다 고유한 송장번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const promises = orderIds.map((id, idx) =>
        orderApi.patchOrderStatus(
          id,
          OrderStatus.DELIVERING,
          shippingInfos[idx].courier.trim(),
          shippingInfos[idx].trackingNumber.trim(),
        ),
      );

      await Promise.all(promises);
      await queryClient.invalidateQueries({
        queryKey: [QUERY.ORDER_LIST_BY_BRAND],
      });
      alert("발송 정보가 저장되었습니다.");
      onClose();
    } catch (err: any) {
      console.error(err);
      // OM-023, OM-024: 백엔드 에러 메시지 표시
      const errorMessage = err?.response?.data?.message || err?.message || "발송 정보 저장에 실패했습니다.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[560px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[var(--color-grey-91)] p-4">
          <h3 className="text-lg font-semibold">발송 정보 입력</h3>
          <button
            onClick={onClose}
            className="text-[var(--color-grey-47)] hover:text-[var(--color-grey-20)]"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {orderIds.length > 1 ? (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-1">주문번호</th>
                  <th className="border px-2 py-1">택배사</th>
                  <th className="border px-2 py-1">송장 번호</th>
                </tr>
              </thead>
              <tbody>
                {orderIds.map((id, idx) => (
                  <tr key={id}>
                    <td className="border px-2 py-1 text-center">{id}</td>
                    <td className="border px-2 py-1">
                      <select
                        value={shippingInfos[idx].courier}
                        onChange={(e) => handleChange(idx, "courier", e.target.value)}
                        className="w-full border border-[var(--color-grey-91)] rounded p-1 text-sm"
                      >
                        <option value="">택배사 선택</option>
                        {COURIER_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="text"
                        value={shippingInfos[idx].trackingNumber}
                        onChange={(e) =>
                          handleChange(idx, "trackingNumber", e.target.value)
                        }
                        className="w-full border border-[var(--color-grey-91)] rounded p-1 text-sm"
                        placeholder="1234567890"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <>
              <div>
                <label className="block mb-1 text-sm font-medium">택배사</label>
                <select
                  value={shippingInfos[0].courier}
                  onChange={(e) => handleChange(0, "courier", e.target.value)}
                  className="w-full border border-[var(--color-grey-91)] rounded p-2 text-sm"
                >
                  <option value="">택배사 선택</option>
                  {COURIER_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">송장 번호</label>
                <input
                  type="text"
                  value={shippingInfos[0].trackingNumber}
                  onChange={(e) =>
                    handleChange(0, "trackingNumber", e.target.value)
                  }
                  className="w-full border border-[var(--color-grey-91)] rounded p-2 text-sm"
                  placeholder="1234567890"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-[var(--color-grey-91)] p-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[var(--color-grey-91)] rounded hover:bg-[var(--color-grey-96)] text-sm"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-[var(--color-azure-48)] text-white rounded text-sm disabled:opacity-50"
          >
            {isLoading ? "처리중..." : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}; 