import { createStore } from 'zustand/vanilla';

import { ColorSeason } from '@/serivces/color-analysis/type';
import { BodyType } from '@/serivces/user/type';
import { STORAGE } from '@/configs/constant/storage';

interface Product {
  id: string;
  imageUrl: string;
  recommendedColorSeason: ColorSeason[];
  recommendedBodyType: BodyType;
  brand: string;
  name: string;
  price: number;
}

export interface ProductForCart extends Product {
  size: string;
  quantity: number;
}

export type ProductState = {
  cartProducts: ProductForCart[];
};

export type ProductActions = {
  init: () => void;
  addToCart: (product: Product, size: string, quantity: number) => void;
};

export type ProductStore = ProductState & ProductActions;

export const defaultInitState: ProductState = {
  cartProducts: [],
};

export const createProductStore = (
  initState: ProductState = defaultInitState
) => {
  return createStore<ProductStore>()((set, get) => ({
    ...initState,
    init: () => {
      const cartProducts = sessionStorage.getItem(STORAGE.CART_PRODUCTS);
      if (cartProducts) {
        set((state) => ({
          cartProducts: JSON.parse(cartProducts),
        }));
      }
    },
    addToCart: (product: Product, size: string, quantity: number) => {
      const cartProducts = get().cartProducts;

      const existingProduct = cartProducts.find(
        (p) => p.id === product.id && p.size === size
      );

      if (existingProduct) {
        const newCartProducts = cartProducts
          .map((p) =>
            p.id === product.id && p.size === size
              ? { ...p, quantity: p.quantity + quantity }
              : p
          )
          .filter((p) => p.quantity > 0);

        set((state) => ({
          cartProducts: newCartProducts,
        }));
        sessionStorage.setItem(
          STORAGE.CART_PRODUCTS,
          JSON.stringify(newCartProducts)
        );
      } else {
        const newCartProducts = [
          ...cartProducts,
          { ...product, size, quantity },
        ].filter((p) => p.quantity > 0);

        set((state) => ({
          cartProducts: newCartProducts,
        }));
        sessionStorage.setItem(
          STORAGE.CART_PRODUCTS,
          JSON.stringify(newCartProducts)
        );
      }
    },
  }));
};
