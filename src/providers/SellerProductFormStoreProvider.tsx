"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type SellerProductFormStore,
  createSellerProductFormStore,
} from "@/stores/seller-product-form-store";

export type SellerProductFormStoreApi = ReturnType<
  typeof createSellerProductFormStore
>;

export const SellerProductFormStoreContext = createContext<
  SellerProductFormStoreApi | undefined
>(undefined);

export interface SellerProductFormStoreProviderProps {
  children: ReactNode;
}

export const SellerProductFormStoreProvider = ({
  children,
}: SellerProductFormStoreProviderProps) => {
  const storeRef = useRef<SellerProductFormStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createSellerProductFormStore();
  }

  return (
    <SellerProductFormStoreContext.Provider value={storeRef.current}>
      {children}
    </SellerProductFormStoreContext.Provider>
  );
};

export const useSellerProductFormStore = <T,>(
  selector: (store: SellerProductFormStore) => T
): T => {
  const sellerProductFormStoreContext = useContext(
    SellerProductFormStoreContext
  );

  if (!sellerProductFormStoreContext) {
    throw new Error(
      `useSellerProductFormStore must be used within SellerProductFormStoreProvider`
    );
  }

  return useStore(sellerProductFormStoreContext, selector);
};
