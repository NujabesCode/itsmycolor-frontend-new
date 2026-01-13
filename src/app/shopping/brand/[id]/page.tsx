import React, { Suspense } from "react";
import { BrandDetailView } from "@/components/shopping-brand/BrandDetailView";

export default async function ShoppingBrandDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">브랜드 정보를 불러오는 중...</div>}>
        <BrandDetailView brandId={id} />
      </Suspense>
    </div>
  );
} 