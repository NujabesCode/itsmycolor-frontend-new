import { ShoppingProductDetailClient } from '@/components/shopping-product-detail/ShoppingProductDetailClient';

// 정적 export를 위해 generateStaticParams 필요 (더미 ID만 반환)
// 실제 상품 ID는 클라이언트 사이드에서 URL에서 읽어서 동적으로 렌더링
export function generateStaticParams() {
  return [{ id: 'dummy' }];
}

export default function ShoppingProductDetail() {
  // 서버 컴포넌트이지만 클라이언트에서 동적으로 렌더링하기 위해
  // 클라이언트 컴포넌트를 사용
  return <ShoppingProductDetailClient />;
}
