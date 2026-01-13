export const ROUTE = {
  // main
  MAIN: "/",

  BENEFIT: "/benefit",

  // buyer
  TYPETEST: "/type-test",
  COLOR_TEST: "/color-test",
  COMMUNITY: "/community",
  CONSULTING: "/consulting",

  SHOPPING: "/shopping",
  SHOPPING_PRODUCT_DETAIL: (id: string, tabIndex: number = 0) =>
    `/shopping/product/${id}${tabIndex > 0 ? `?tabIndex=${tabIndex}` : ""}`,
  SHOPPING_ORDER_MAIN: "/shopping/order",
  SHOPPING_ORDER: (data: { productId: string; size: string; quantity: number }): string =>
    `/shopping/order?${Object.entries(data)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")}`,
  SHOPPING_BRAND_DETAIL: (brandId: string) => `/shopping/brand/${brandId}`,

  MYPAGE: "/my-page",
  MYPAGE_ONBOARD: "/my-page/on-board",
  MYPAGE_TYPE: (isOpen: boolean = false) => `/my-page/type${isOpen ? "?isOpen=true" : ""}`,
  MYPAGE_PROFILE: "/my-page/profile",
  MYPAGE_ORDER: "/my-page/order",
  MYPAGE_QNA: "/my-page/qna",
  MYPAGE_SELLER_APPLY: "/my-page/seller-apply",
  MYPAGE_LIKED_PRODUCT: "/my-page/liked-product",
  MYPAGE_CART_PRODUCT: "/my-page/cart-product",

  SIGNUP: "/sign-up",
  SIGNIN: "/sign-in",

  PAYMENT_MAIN: "/payment",
  PAYMENT_SUCCESS: "/payment/success",
  PAYMENT_FAIL: "/payment/fail",

  // seller
  APPLY_NEW: "/apply-new",

  SELLER_SIGNUP: "/seller/sign-up",
  SELLER_SIGNIN: "/seller/sign-in",

  SELLER_MAIN: "/seller",

  SELLER_PRODUCT: "/seller/product",
  SELLER_PRODUCT_FORM: (productId?: string) => `/seller/product/form${productId ? `?productId=${productId}` : ""}`,
  SELLER_ORDER: "/seller/order",
  SELLER_CS: "/seller/cs",
  SELLER_RETURN: "/seller/return",
  SELLER_SETTLEMENT: "/seller/settlement",
  SELLER_BRAND_SETTING: "/seller/brand-setting",

  // admin
  ADMIN_SIGNIN: "/admin/sign-in",
  ADMIN_SIGNUP: "/admin/sign-up",
  
  ADMIN_MAIN: "/admin",

  ADMIN_BRAND: "/admin/brand",
  ADMIN_PRODUCT: "/admin/product",
  ADMIN_CUSTOMER: "/admin/customer",
  ADMIN_ANALYSIS: "/admin/analysis",
  ADMIN_SETTING: "/admin/setting",
  ADMIN_SETTLEMENT: "/admin/settlement",
  ADMIN_COMMISSION: "/admin/commission",
  ADMIN_TAX: "/admin/tax",
  ADMIN_ORDER: "/admin/order",
  ADMIN_BANNER: "/admin/banner",
};
