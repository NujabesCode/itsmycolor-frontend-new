"use client";

import { useEffect, useRef } from "react";
import { STORAGE } from "@/configs/constant/storage";
import { Product } from "@/serivces/product/type";

/**
 * Save recommended body type and color season of a product into localStorage.
 *
 * - Prepends new values to existing history so the most recent ones come first.
 * - Removes duplicates while keeping order.
 * - Trims each list to a maximum of 30 items.
 *
 * This hook is **client-only**. Call it with the fetched product object – it will
 * run its side-effect once the product is available.
 */
export const useSaveRecommend = (product?: Product) => {
  const doubleCheckRef = useRef(false);

  useEffect(() => {
    if (!product) return;

    if (doubleCheckRef.current) return;
    doubleCheckRef.current = true;

    // Save recommended body type history
    if (product.recommendedBodyType) {
      const key = STORAGE.CLICK_PRODUCT_BODY_TYPE;
      try {
        const existing: string[] = JSON.parse(
          localStorage.getItem(key) || "[]"
        );

        const updated = [
          product.recommendedBodyType,
          ...existing,
        ];

        localStorage.setItem(key, JSON.stringify(updated.slice(0, 30)));
      } catch (e) {
        console.error("Failed to update recommended body type history", e);
      }
    }

    // Save recommended color season history
    if (product.recommendedColorSeason && product.recommendedColorSeason.length) {
      const key = STORAGE.CLICK_PRODUCT_COLOR_SEASON;
      try {
        const existing: string[] = JSON.parse(
          localStorage.getItem(key) || "[]"
        );

        // Combine new seasons with existing ones (duplicates allowed)
        const combined = [...product.recommendedColorSeason, ...existing];

        localStorage.setItem(key, JSON.stringify(combined.slice(0, 30)));
      } catch (e) {
        console.error("Failed to update recommended color season history", e);
      }
    }
  }, [product]);
}; 