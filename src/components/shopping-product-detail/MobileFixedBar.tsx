'use client';

import { useLikeProduct } from '@/hooks/product/useLikeProduct';
import { useGetProduct } from '@/serivces/product/query';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';

export const MobileFixedBar = ({ id }: { id: string }) => {
  const { data: product } = useGetProduct(id);

  const { isLiked, handleLikeProduct, user } = useLikeProduct(id);
  
  // 하트 색상 결정 로직
  const getHeartIcon = () => {
    // 로그인하지 않은 경우: 검정색 아웃라인 하트 (테두리만)
    if (!user) {
      return <IoHeartOutline className="w-5 h-5 text-black" />;
    }
    
    // 로그인한 경우
    if (isLiked) {
      // 찜 목록에 있는 경우: 검정색 채워진 하트
      return <IoHeart className="w-5 h-5 text-black" />;
    } else {
      // 찜 목록에 없는 경우: 회색 아웃라인 하트
      return <IoHeartOutline className="w-5 h-5 text-gray-400" />;
    }
  };

  const onBuy = () => {
    const quantitySelector = document.getElementById('quantity-selector');
    if (quantitySelector) {
      quantitySelector.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
      <div className="flex items-center gap-3">
        <button
          className="p-3 border border-gray-300 rounded-lg"
          onClick={handleLikeProduct}
        >
          {getHeartIcon()}
        </button>
        <button
          className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-medium"
          onClick={onBuy}
        >
          구매하기
        </button>
      </div>
    </div>
  );
};
