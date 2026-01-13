"use client";

import { formatDate } from "@/utils/date";
import { Pagination } from "../common/Pagination";
import { useGetReviewListByProduct } from "@/serivces/review/query";

const Star = ({ filled }: { filled: boolean }) => (
  <svg
    className={`w-4 h-4 ${
      filled ? "text-yellow-400" : "text-gray-300"
    }`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
  </svg>
);

export const ReviewView = ({ productId }: { productId: string }) => {
  const { data: reviewsData } = useGetReviewListByProduct(productId);

  const reviewList = reviewsData?.reviews;
  const lastPage = reviewsData?.lastPage;

  return (
    <div>
      {/* 상단 평점 요약 */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-2xl font-medium text-gray-900">4.9</div>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} filled={true} />
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-600">
            총 {reviewList?.length || 0}개의 리뷰
          </div>
        </div>
      </div>

      {/* 리뷰 리스트 */}
      <div className="space-y-6">
        {reviewList?.map((review, idx) => (
          <div
            key={idx}
            className="pb-6 border-b border-gray-200 last:border-0"
          >
            {/* 리뷰 헤더 */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-medium text-gray-900">{review.user.name}</span>
                  <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} filled={i < review.rating} />
                  ))}
                </div>
              </div>
            </div>

            {/* 리뷰 내용 */}
            <div className="mt-3">
              <p className="text-sm text-gray-700 leading-relaxed">{review.content}</p>
            </div>

            {/* 리뷰 이미지 */}
            {review.imageUrls && review.imageUrls.length > 0 && (
              <div className="mt-3">
                <div className="flex gap-2 flex-wrap">
                  {review.imageUrls.map((photo, i) => (
                    <div
                      key={i}
                      className="w-20 h-20 rounded border border-gray-200 overflow-hidden"
                    >
                      <img
                        src={photo}
                        alt={`리뷰 이미지 ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* 빈 상태 */}
        {reviewList && reviewList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">아직 작성된 리뷰가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {lastPage && lastPage > 1 && (
        <div className="mt-8">
          <Pagination lastPage={lastPage} />
        </div>
      )}
    </div>
  );
};
