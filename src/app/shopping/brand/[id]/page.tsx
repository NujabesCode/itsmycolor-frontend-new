'use client';

import React from "react";
import { BrandDetailView } from "@/components/shopping-brand/BrandDetailView";
import { useParams } from "next/navigation";

export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export default function ShoppingBrandDetail() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="min-h-screen bg-white">
      <BrandDetailView brandId={id} />
    </div>
  );
} 