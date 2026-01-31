import React, { Suspense } from "react";
import { BrandDetailView } from "@/components/shopping-brand/BrandDetailView";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    // 빌드 시점에 상품 목록에서 브랜드 ID를 추출
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://43.201.54.58:3000";
    const response = await fetch(`${apiUrl}/products?limit=1000`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      const products = data.products || [];
      
      // 브랜드 ID 추출 (중복 제거)
      const brandIds = new Set<string>();
      products.forEach((product: any) => {
        if (product.brandInfo?.id) {
          brandIds.add(product.brandInfo.id);
        } else if (product.brandId) {
          brandIds.add(product.brandId);
        }
      });
      
      const brandIdArray = Array.from(brandIds);
      console.log(`생성할 브랜드 페이지 수: ${brandIdArray.length}`);
      return brandIdArray.map((id) => ({ id }));
    }
  } catch (error) {
    console.error('브랜드 목록을 가져오는 중 오류:', error);
  }
  
  // 오류 발생 시 더미 ID 반환
  return [{ id: "dummy" }];
}

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