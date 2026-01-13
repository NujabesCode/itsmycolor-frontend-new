import { Product } from "@/serivces/product/type";

interface SizeInfo {
  S?: string;
  M?: string;
  L?: string;
  [key: string]: string | undefined;
}

// 사이즈 정렬 순서 정의
const SIZE_ORDER: Record<string, number> = {
  XXS: 0,
  XS: 1,
  S: 2,
  M: 3,
  L: 4,
  XL: 5,
  XXL: 6,
  XXXL: 7,
  FREE: 8,
};

export const ProductInfoView = ({ product }: { product: Product }) => {
  // 사이즈 정보 파싱
  const parseSizeInfo = (sizeInfo: SizeInfo) => {
    const result: Record<string, Record<string, number | null>> = {};

    Object.entries(sizeInfo).forEach(([size, infoStr]) => {
      if (infoStr) {
        try {
          result[size] = JSON.parse(infoStr);
        } catch (e) {
          console.error(`사이즈 정보 파싱 오류: ${size}`, e);
        }
      }
    });

    return result;
  };

  const sizeInfo = product.sizeInfo
    ? parseSizeInfo(product.sizeInfo as unknown as SizeInfo)
    : {};
  // 사이즈 키를 S, M, L 순으로 정렬
  const sizeKeys = Object.keys(sizeInfo).sort((a, b) => {
    const orderA = SIZE_ORDER[a] !== undefined ? SIZE_ORDER[a] : 999;
    const orderB = SIZE_ORDER[b] !== undefined ? SIZE_ORDER[b] : 999;
    return orderA - orderB;
  });

  // 모든 사이즈 정보에서 사용 가능한 측정 항목들을 수집
  const measurementTypes = new Set<string>();
  Object.values(sizeInfo).forEach((info) => {
    Object.keys(info).forEach((type) => measurementTypes.add(type));
  });
  const measurementArray = Array.from(measurementTypes);

  return (
    <div className="space-y-8">
      {/* 제품 상세 설명 섹션 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">제품 상세 설명</h3>
        <div className="border-t border-gray-200 pt-4">
          <div
            className="text-sm text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      </div>

      {/* 사이즈 정보 섹션 */}
      {sizeKeys.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">사이즈 가이드</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-[400px] w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 text-left text-gray-700 font-medium border-b border-gray-200">
                      사이즈
                    </th>
                    {measurementArray.map((type) => (
                      <th
                        key={type}
                        className="py-3 px-4 text-center text-gray-700 font-medium border-b border-gray-200"
                      >
                        {type}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {sizeKeys.map((size, sizeIndex) => (
                    <tr
                      key={size}
                      className={sizeIndex !== sizeKeys.length - 1 ? "border-b border-gray-200" : ""}
                    >
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        {size}
                      </td>
                      {measurementArray.map((type) => (
                        <td
                          key={`${size}-${type}`}
                          className="py-3 px-4 text-center text-gray-700"
                        >
                          {sizeInfo[size][type] !== null ? sizeInfo[size][type] : "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            * 사이즈 측정 위치에 따라 1~2cm 정도의 오차가 있을 수 있습니다.
          </p>
        </div>
      )}

      {/* 추천 정보 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">추천 대상</h4>
        <p className="text-sm text-gray-600">
          이 제품은 {product.recommendedColorSeason.length > 0 ? product.recommendedColorSeason.join(', ') : '모든 계절'} 퍼스널 컬러와
          {' '}{product.recommendedBodyType} 체형을 가진 분들에게 추천됩니다.
        </p>
      </div>
    </div>
  );
};
