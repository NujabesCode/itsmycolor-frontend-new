import { Order } from "@/serivces/order/type";
import { reviewApi } from "@/serivces/review/request";
import { formatDate } from "@/utils/date";
import Image from "next/image";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export const ReviewFormModal = ({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [sizeOption, setSizeOption] = useState("적당해요");
  const [colorOption, setColorOption] = useState("어두워요");
  const [thicknessOption, setThicknessOption] = useState("얇아요");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const [isLoading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setImages([...images, ...fileArray].slice(0, 5)); // 최대 5개 이미지로 제한
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (content.length < 10)
      return alert("리뷰 내용은 10자 이상이어야 합니다.");

    try {
      setLoading(true);

      await reviewApi.createReview({
        productId: order.orderItems[0].productId,
        orderId: order.id,
        orderItemId: order.orderItems[0].id,
        content,
        rating,
        sizeReview: sizeOption,
        colorReview: colorOption,
        thicknessReview: thicknessOption,
        images,
      });

      alert("리뷰 등록을 완료했습니다.");
      onClose();
    } catch (e) {
      alert("리뷰 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">리뷰 작성하기</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* 상품 정보 */}
          <div className="flex items-center mb-6 bg-gray-50 p-3 rounded-md">
            <div className="w-16 h-16 bg-gray-200 rounded-md mr-3 flex-shrink-0 relative">
              {order.orderItems[0].productImageUrl && (
                <Image
                  src={order.orderItems[0].productImageUrl}
                  alt={order.orderItems[0].productName}
                  fill
                />
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {order.orderItems[0].productName}
              </h3>
              <p className="text-sm text-gray-500">
                {order.orderItems[0].size} 사이즈 • 주문일자:{" "}
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          {/* 별점 */}
          <div className="mb-6">
            <p className="font-medium text-gray-900 mb-2">별점</p>
            <div className="flex">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index} className="cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                      className="hidden"
                    />
                    <FaStar
                      size={28}
                      className="mr-1"
                      color={
                        ratingValue <= (hover || rating) ? "#FFD700" : "#e4e5e9"
                      }
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* 옵션 평가 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* 사이즈 */}
            <div>
              <p className="font-medium text-gray-900 mb-2">사이즈</p>
              <div className="flex flex-col space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="size"
                    checked={sizeOption === "작아요"}
                    onChange={() => setSizeOption("작아요")}
                    className="form-radio h-4 w-4 text-black"
                  />
                  <span className="ml-2 text-sm">작아요</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="size"
                    checked={sizeOption === "적당해요"}
                    onChange={() => setSizeOption("적당해요")}
                    className="form-radio h-4 w-4 text-black"
                  />
                  <span className="ml-2 text-sm">적당해요</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="size"
                    checked={sizeOption === "커요"}
                    onChange={() => setSizeOption("커요")}
                    className="form-radio h-4 w-4 text-black"
                  />
                  <span className="ml-2 text-sm">커요</span>
                </label>
              </div>
            </div>

            {/* 색상 */}
            <div>
              <p className="font-medium text-gray-900 mb-2">색상</p>
              <div className="flex flex-col space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="color"
                    checked={colorOption === "어두워요"}
                    onChange={() => setColorOption("어두워요")}
                    className="form-radio h-4 w-4 text-black"
                  />
                  <span className="ml-2 text-sm">어두워요</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="color"
                    checked={colorOption === "적당해요"}
                    onChange={() => setColorOption("적당해요")}
                    className="form-radio h-4 w-4 text-black"
                  />
                  <span className="ml-2 text-sm">적당해요</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="color"
                    checked={colorOption === "밝아요"}
                    onChange={() => setColorOption("밝아요")}
                    className="form-radio h-4 w-4 text-black"
                  />
                  <span className="ml-2 text-sm">밝아요</span>
                </label>
              </div>
            </div>

            {/* 두께감 */}
            <div>
              <p className="font-medium text-gray-900 mb-2">두께감</p>
              <div className="flex flex-col space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="thickness"
                    checked={thicknessOption === "얇아요"}
                    onChange={() => setThicknessOption("얇아요")}
                    className="form-radio h-4 w-4 text-black"
                  />
                  <span className="ml-2 text-sm">얇아요</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="thickness"
                    checked={thicknessOption === "적당해요"}
                    onChange={() => setThicknessOption("적당해요")}
                    className="form-radio h-4 w-4 text-black"
                  />
                  <span className="ml-2 text-sm">적당해요</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="thickness"
                    checked={thicknessOption === "두꺼워요"}
                    onChange={() => setThicknessOption("두꺼워요")}
                    className="form-radio h-4 w-4 text-black"
                  />
                  <span className="ml-2 text-sm">두꺼워요</span>
                </label>
              </div>
            </div>
          </div>

          {/* 리뷰 내용 */}
          <div className="mb-6">
            <p className="font-medium text-gray-900 mb-2">리뷰 내용</p>
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black min-h-[120px]"
              placeholder="상품에 대한 평가를 자유롭게 작성해주세요. (10자 이상)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>

          {/* 사진 첨부 */}
          <div className="mb-6">
            <p className="font-medium text-gray-900 mb-2">사진 첨부</p>
            <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
              {images.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`업로드 이미지 ${index + 1}`}
                        className="w-full h-16 object-cover rounded-md"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="cursor-pointer text-gray-500 hover:text-black transition-colors flex flex-col items-center">
                <svg
                  className="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
                <span className="text-sm">
                  사진을 드래그하거나 클릭하여 업로드하세요 (최대 5장, 5MB/장)
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={images.length >= 5}
                />
              </label>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end p-5 border-t border-gray-200 gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
            disabled={isLoading}
          >
            리뷰 등록하기
          </button>
        </div>
      </div>
    </div>
  );
};
