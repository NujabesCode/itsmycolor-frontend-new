"use client";

import { Step1 } from "@/components/seller-product-form/Step1";
import { Step2 } from "@/components/seller-product-form/Step2";
import { Step3 } from "@/components/seller-product-form/Step3";
import { Step4 } from "@/components/seller-product-form/Step4";
import { Step5 } from "@/components/seller-product-form/Step5";
import { StepNavigator } from "@/components/seller-product-form/StepNavigator";
import { STORAGE } from "@/configs/constant/storage";
import React, { useEffect, useState } from "react";
import { useSellerProductFormStore } from "@/providers/SellerProductFormStoreProvider";
import { useQueryString } from "@/hooks/common/useQueryString";

export default function SellerProductForm() {
  const [productId] = useQueryString<string>("productId", "");

  const [step, setStep] = useState(1);

  const onLoad = useSellerProductFormStore((state) => state.onLoad);
  const onEditLoad = useSellerProductFormStore((state) => state.onEditLoad);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [step]);

  useEffect(() => {
    const state = localStorage.getItem(STORAGE.SELLER_PRODUCT_FORM);

    if (state) {
      const confirm = window.confirm("임시저장한 내용을 불러올까요?");

      if (confirm) {
        onLoad();
      } else {
        localStorage.removeItem(STORAGE.SELLER_PRODUCT_FORM);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      if (productId) {
        await onEditLoad(productId);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-medium text-gray-900">
          {productId ? "상품 수정" : "상품 등록"}
        </h1>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <StepNavigator step={step} setStep={setStep} isEdit={!!productId} />

          <div className="mt-8">
            {step === 1 && <Step1 moveNext={() => setStep(2)} />}
            {step === 2 && (
              <Step2 movePrev={() => setStep(1)} moveNext={() => setStep(3)} />
            )}
            {step === 3 && (
              <Step3 movePrev={() => setStep(2)} moveNext={() => setStep(4)} />
            )}
            {step === 4 && (
              <Step4 movePrev={() => setStep(3)} moveNext={() => setStep(5)} />
            )}
            {step === 5 && <Step5 movePrev={() => setStep(4)} />}
          </div>
        </div>
      </div>
    </div>
  );
}
