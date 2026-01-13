'use client';

import React, { useState } from 'react';

import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';
import Image from 'next/image';
import { useSellerProductFormStore } from '@/providers/SellerProductFormStoreProvider';
import { useQueryString } from '@/hooks/common/useQueryString';
import { ROUTE } from '@/configs/constant/route';
import { useRouter } from 'next/navigation';
import { QUERY } from '@/configs/constant/query';
import { useQueryClient } from '@tanstack/react-query';
import { fileApi } from '@/serivces/file/request';
import { base64ToFile, isBase64Image } from '@/utils/image';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [
      { align: '' },
      { align: 'center' },
      { align: 'right' },
      { align: 'justify' },
    ],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean'],
  ],
};

export const Step3 = ({
  movePrev,
  moveNext,
}: {
  movePrev: () => void;
  moveNext: () => void;
}) => {
  const [productId] = useQueryString<string>('productId', '');

  const { description, mainImage, additionalImages, removeImageUrls, originMainImage, originAdditionalImages, height, weight, S, M, L, setStep3, onSave, onUpdate } =
    useSellerProductFormStore((state) => state);

  const queryClient = useQueryClient();

  const [tempDescription, setTempDescription] = useState(description);
  console.log('tempDescription', tempDescription);
  const onChangeDescription = async (value: string) => {
    let newDescription = value;

    // ReactQuill 로부터 추출한 이미지 태그(src 포함)를 모두 찾는다.
    const images = value.match(/<img src="([^"]+)"/g) ?? [];
    const srcs = images.map((image) => image.replace(/<img src="([^"]+)"/g, '$1')).filter(isBase64Image);

    // 비동기 업로드가 모두 완료된 후에 description 을 업데이트해야 합니다.
    for (const src of srcs) {
      try {
        const file = base64ToFile(src);
        const fileUrl = await fileApi.uploadFile(file);

        newDescription = newDescription.replace(src, fileUrl);
      } catch (err) {
        console.error('이미지 업로드 실패:', err);
      }
    }

    setTempDescription(newDescription);
  };
  const [tempMainImage, setTempMainImage] = useState(mainImage);
  const [tempAdditionalImages, setTempAdditionalImages] = useState(additionalImages);
  const [tempRemoveImageUrls, setTempRemoveImageUrls] = useState(removeImageUrls);
  const [tempHeight, setTempHeight] = useState(height);
  const [tempWeight, setTempWeight] = useState(weight);
  const [tempS, setTempS] = useState(S);
  const [tempM, setTempM] = useState(M);
  const [tempL, setTempL] = useState(L);
  const [tempOriginMainImage, setTempOriginMainImage] = useState(originMainImage);
  const [tempOriginAdditionalImages, setTempOriginAdditionalImages] = useState(
    originAdditionalImages ?? []
  );

  const router = useRouter();

  // PD-006: 이미지 확장자 검증 함수
  const isValidImageFile = (file: File): boolean => {
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validImageTypes.includes(file.type);
  };

  // 대표 이미지 선택
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // PD-006: 이미지 파일만 허용
      if (!isValidImageFile(file)) {
        alert('이미지 파일만 업로드 가능합니다. (JPG, PNG, GIF, WEBP)');
        e.target.value = ''; // 입력 초기화
        return;
      }
      setTempMainImage(file);
    }
  };

  const handleDeleteMainImage = () => {
    setTempMainImage(null);
  };

  // 추가 이미지 선택 (여러 장)
  const handleAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      // PD-006: 이미지 파일만 필터링
      const validImageFiles = newFiles.filter(file => {
        if (!isValidImageFile(file)) {
          alert(`${file.name}은(는) 이미지 파일이 아닙니다. 이미지 파일만 업로드 가능합니다. (JPG, PNG, GIF, WEBP)`);
          return false;
        }
        return true;
      });
      
      if (validImageFiles.length === 0) {
        e.target.value = ''; // 입력 초기화
        return;
      }
      
      setTempAdditionalImages((prev) => {
        const prevArr = prev ?? [];
        // 대표 이미지 제외 최대 9장까지만 허용 (총 10장 제한)
        return prevArr.concat(validImageFiles).slice(0, 9);
      });
    }
  };

  const handleDeleteAdditionalImage = (index: number) => {
    setTempAdditionalImages((prev) => {
      if (!prev) return prev;
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleDeleteOriginMainImage = () => {
    // if (tempOriginMainImage) {
    //   setTempRemoveImageUrls((prev) => [...prev, tempOriginMainImage]);
    // }
    setTempOriginMainImage(null);
  };

  const handleDeleteOriginAdditionalImage = (index: number) => {
    setTempOriginAdditionalImages((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(index, 1);
      if (removed) {
        setTempRemoveImageUrls((prevUrls) => [...prevUrls, removed]);
      }
      return updated;
    });
  };

  const handleSave = () => {
    setStep3({
      description: tempDescription,
      mainImage: tempMainImage,
      additionalImages: tempAdditionalImages,
      removeImageUrls: tempRemoveImageUrls,
      height: tempHeight,
      weight: tempWeight,
      S: tempS,
      M: tempM,
      L: tempL,
    });

    onSave();

    alert('임시 저장되었습니다.');
  };

  const handleComplete = async () => {
    if (!productId) return;
    if (!tempDescription) return alert('상세 설명을 입력해주세요.');
    if (!tempHeight || !tempWeight) return alert('상품 입력 정보를 입력해주세요.');
    if (
      Object.values(tempS).every((value) => value === null) &&
      Object.values(tempM).every((value) => value === null) &&
      Object.values(tempL).every((value) => value === null)
    )
      return alert('사이즈 정보를 입력해주세요.');

    setStep3({
      description: tempDescription,
      mainImage: tempMainImage,
      additionalImages: tempAdditionalImages,
      removeImageUrls: tempRemoveImageUrls,
      height: tempHeight,
      weight: tempWeight,
      S: tempS,
      M: tempM,
      L: tempL,
    });

    try {
      await onUpdate(productId);
      await queryClient.invalidateQueries({ queryKey: [QUERY.PRODUCT_LIST_BY_BRAND] });
      alert('상품 수정이 완료되었습니다.');
      router.replace(ROUTE.SELLER_PRODUCT);
    } catch (e) {
      console.error(e);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleNext = () => {
    if (!tempDescription) return alert('상세 설명을 입력해주세요.');
    if (!productId && !tempMainImage)
      return alert('대표 이미지를 추가해주세요.');
    if (!tempHeight || !tempWeight)
      return alert('상품 입력 정보를 입력해주세요.');
    if (
      Object.values(tempS).every((value) => value === null) &&
      Object.values(tempM).every((value) => value === null) &&
      Object.values(tempL).every((value) => value === null)
    )
      return alert('사이즈 정보를 입력해주세요.');

    setStep3({
      description: tempDescription,
      mainImage: tempMainImage,
      additionalImages: tempAdditionalImages,
      removeImageUrls: tempRemoveImageUrls,
      height: tempHeight,
      weight: tempWeight,
      S: tempS,
      M: tempM,
      L: tempL,
    });

    moveNext();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 mx-auto">
      {/* 3.1 상세 설명 */}
      <div className="mb-8">
        <div className="font-bold text-base text-gray-800 mb-2">
          상세 설명 <span className="text-red-500">*</span>
        </div>
        <div>
          <ReactQuill
            theme="snow"
            value={tempDescription ?? ''}
            onChange={onChangeDescription}
            modules={quillModules}
            style={{ height: '300px' }}
          />
        </div>
      </div>

      <div className="h-5" />

      <div className="text-xs text-gray-600 mt-2">
        도움말: 상세한 특징, 소재, 색상, 세탁방법 등 상세 정보를 입력해주세요.
        입력한 정보 중 일부는 상품 요약 정보로 가공되어 노출될 수도 있습니다.
      </div>

      <div className="h-5" />

      {/* 3.2 대표 이미지 */}
      <div className="mb-8">
        <div className="font-bold text-base text-gray-800 mb-2">
          대표 이미지 <span className="text-red-500">*</span>
        </div>
        <div className="flex gap-4 mb-2 flex-wrap">
          {tempMainImage ? (
            (() => {
              const objectUrl = URL.createObjectURL(tempMainImage);
              return (
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 relative">
                  <Image
                    src={objectUrl}
                    alt="대표 이미지"
                    className="object-cover w-full h-full"
                    width={96}
                    height={96}
                    onLoad={() => URL.revokeObjectURL(objectUrl)}
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 m-1 w-6 h-6 bg-gray-700 bg-opacity-70 text-white rounded-full text-xs flex items-center justify-center hover:bg-gray-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMainImage();
                    }}
                  >
                    &times;
                  </button>
                </div>
              );
            })()
          ) : tempOriginMainImage ? (
            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 relative">
              <Image
                src={tempOriginMainImage}
                alt="대표 이미지"
                className="object-cover w-full h-full"
                width={96}
                height={96}
              />
              <button
                type="button"
                className="absolute top-0 right-0 m-1 w-6 h-6 bg-gray-700 bg-opacity-70 text-white rounded-full text-xs flex items-center justify-center hover:bg-gray-800"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteOriginMainImage();
                }}
              >
                &times;
              </button>
            </div>
          ) : (
            <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer text-gray-600 text-sm">
              <div className="text-center">
                대표 이미지
                <br /> 추가하기
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleMainImageChange}
              />
            </label>
          )}
        </div>
        <div className="text-xs text-gray-600">권장 크기: 800 x 1000 (4:5 비율)</div>
      </div>

      {/* 3.3 추가 이미지 */}
      <div className="mb-8">
        <div className="font-bold text-base text-gray-800 mb-2">
          추가 이미지 (최대 9장)
        </div>
        <div className="flex gap-4 mb-2 flex-wrap">
          {/* 기존(origin) 추가 이미지 */}
          {tempOriginAdditionalImages.map((url, idx) => (
            <div
              key={`origin-add-${idx}`}
              className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 relative"
            >
              <Image
                src={url}
                alt={`추가 이미지 ${idx + 1}`}
                className="object-cover w-full h-full"
                width={96}
                height={96}
              />
              <button
                type="button"
                className="absolute top-0 right-0 m-1 w-6 h-6 bg-gray-700 bg-opacity-70 text-white rounded-full text-xs flex items-center justify-center hover:bg-gray-800"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteOriginAdditionalImage(idx);
                }}
              >
                &times;
              </button>
            </div>
          ))}

          {/* 업로드한 추가 이미지 */}
          {tempAdditionalImages?.map((file, idx) => {
            const objectUrl = URL.createObjectURL(file);
            return (
              <div
                key={`add-file-${idx}`}
                className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 relative"
              >
                <Image
                  src={objectUrl}
                  alt={`추가 이미지 ${idx + 1}`}
                  className="object-cover w-full h-full"
                  width={96}
                  height={96}
                  onLoad={() => URL.revokeObjectURL(objectUrl)}
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 m-1 w-6 h-6 bg-gray-700 bg-opacity-70 text-white rounded-full text-xs flex items-center justify-center hover:bg-gray-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAdditionalImage(idx);
                  }}
                >
                  &times;
                </button>
              </div>
            );
          })}

          {/* 추가 이미지 업로드 버튼 */}
          {(tempOriginAdditionalImages.length + (tempAdditionalImages?.length ?? 0)) < 9 && (
            <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer text-gray-600 text-sm">
              <div className="text-center">
                추가 이미지
                <br /> 추가하기
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleAdditionalImagesChange}
              />
            </label>
          )}
        </div>
        <div className="text-xs text-gray-600">권장 크기: 800 x 1000 (4:5 비율)</div>
      </div>

      {/* 3.4 상품 입력 정보 */}
      <div className="mb-8">
        <div className="font-bold text-base text-gray-800 mb-2">
          상품 입력 정보 <span className="text-red-500">*</span>
        </div>
        <div className="flex gap-4 mb-2">
          <div className="flex flex-col w-1/3">
            <label className="text-xs text-gray-600 mb-1">길이</label>
            <input
              type="number"
              className="border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="cm"
              value={tempHeight ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                setTempHeight(value === '' ? 0 : Math.max(0, Number(value)));
              }}
            />
          </div>
          <div className="flex flex-col w-1/3">
            <label className="text-xs text-gray-600 mb-1">중량</label>
            <input
              type="number"
              className="border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="kg"
              value={tempWeight ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                setTempWeight(value === '' ? 0 : Math.max(0, Number(value)));
              }}
            />
          </div>
          <div className="flex flex-col w-1/3">
            <label className="text-xs text-gray-600 mb-1">착용 사이즈</label>
            <input
              type="text"
              className="border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="예: M"
            />
          </div>
        </div>
      </div>

      {/* 3.5 사이즈 정보 */}
      <div className="mb-8">
        <div className="font-bold text-base text-gray-800 mb-2">
          사이즈 정보 <span className="text-red-500">*</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg bg-gray-50">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-xs">
                <th className="px-3 py-2 border-b border-gray-200">구분</th>
                <th className="px-3 py-2 border-b border-gray-200">S</th>
                <th className="px-3 py-2 border-b border-gray-200">M</th>
                <th className="px-3 py-2 border-b border-gray-200">L</th>
              </tr>
            </thead>
            <tbody>
              {['어깨너비', '가슴둘레', '총장', '소매길이'].map((row, i) => (
                <tr key={row} className="text-gray-700 text-sm">
                  <td className="px-3 py-2 border-b border-gray-200 bg-gray-100 font-medium">
                    {row}
                  </td>
                  {['S', 'M', 'L'].map((col) => (
                    <td
                      key={col}
                      className="px-3 py-2 border-b border-gray-200"
                    >
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="cm"
                        value={
                          col === 'S'
                            ? tempS?.[row as keyof typeof tempS] ?? ''
                            : col === 'M'
                            ? tempM?.[row as keyof typeof tempM] ?? ''
                            : tempL?.[row as keyof typeof tempL] ?? ''
                        }
                        onChange={(e) => {
                          const value = e.target.value;

                          if (col === 'S') {
                            setTempS({
                              ...tempS,
                              [row]: parseInt(value),
                            });
                          } else if (col === 'M') {
                            setTempM({
                              ...tempM,
                              [row]: parseInt(value),
                            });
                          } else {
                            setTempL({
                              ...tempL,
                              [row]: parseInt(value),
                            });
                          }
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 세탁 방법 */}
      <div className="mb-8">
        <div className="font-bold text-base text-gray-800 mb-2">세탁 방법</div>
        <textarea
          className="w-full min-h-[60px] border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="세탁 방법을 입력해주세요."
        />
      </div>

      {/* 사이즈 측정 안내 */}
      <div className="mb-8">
        <div className="font-bold text-base text-gray-800 mb-2">
          사이즈 측정 안내
        </div>
        <textarea
          className="w-full min-h-[60px] border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="사이즈 측정 안내를 입력해주세요."
        />
      </div>

      {/* 하단 버튼 영역 */}
      <div className="flex justify-between items-center mt-8">
        <button
          className="px-6 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200"
          onClick={movePrev}
        >
          이전
        </button>
        <div className="flex gap-2">
          <button
            className="px-6 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-100"
            onClick={handleSave}
          >
            임시 저장
          </button>
          <button
            className="px-6 py-2 rounded-md bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800"
            onClick={handleNext}
          >
            다음
          </button>
          {productId && (
            <button
              type="button"
              className="px-6 py-2 rounded-md bg-gray-700 text-white text-sm font-semibold hover:bg-gray-600"
              onClick={handleComplete}
            >
              완료
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
