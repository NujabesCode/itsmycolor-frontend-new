import { Product } from "@/serivces/product/type";

export const ShipView = ({ product }: { product: Product }) => {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl p-8">
      <h2 className="text-2xl font-light tracking-wide text-grey-10 mb-8">
        배송/교환/반품/AS 안내
      </h2>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-grey-10 mb-3">📦 배송안내</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-grey-40">
          <li>상품 특성과 배송지에 따라 배송 기간 및 방법이 상이할 수 있습니다.</li>
          <li>동일 브랜드 주문 내에서도 분리 배송될 수 있습니다.</li>
          <li>제주/도서산간 지역은 출고, 반품, 교환시 추가 배송비가 부과될 수 있습니다.</li>
          <li>상품의 배송비는 공급업체의 정책에 따라 다르오며 공휴일 및 휴일은 배송이 불가합니다.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-grey-10 mb-3">🔁 교환/반품 안내</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-grey-40">
          <li>교환 및 반품 신청은 수령 후 7일 이내, [마이페이지 &gt; 주문내역]에서 신청 가능합니다.</li>
          <li>단순 변심(사이즈, 컬러 등 포함)에 의한 교환/반품은 왕복 택배비가 고객 부담입니다.</li>
          <li>제품 및 포장 상태가 훼손되지 않은 경우에만 처리 가능하며, 지정된 반송 주소로 보내주셔야 합니다.</li>
          <li>반품 주소: {product.refundInfo?.address ?? '입력되지 않음'}</li>
          <li>교환/반품 진행 시 반드시 고객센터 사전 접수 후 진행 부탁드립니다.</li>
          <li>고객님의 단순 변심으로 인한 반품 시, 초기 배송비가 무료였더라도 왕복 배송비는 고객님 부담입니다.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-grey-10 mb-3">🚫 교환/반품이 불가능한 경우</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-grey-40">
          <li>상품 수령 후 7일이 경과한 경우</li>
          <li>사용 또는 세탁한 흔적이 있는 경우</li>
          <li>고객 부주의로 인한 제품 훼손 또는 오염된 경우</li>
          <li>상품 TAG, 라벨, 패키지가 훼손되었거나 분실된 경우</li>
          <li>화이트/니트/레깅스 등 착용 흔적이 남을 수 있는 제품</li>
          <li>주문 제작 상품 및 세일/이벤트 제품</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-grey-10 mb-3">🛠 A/S 안내</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-grey-40">
          <li>A/S 가능 여부 및 기준은 브랜드 및 제품에 따라 상이하며, 고객센터로 문의주시기 바랍니다.</li>
          <li>품질 보증 기준은 관련 법령 및 소비자분쟁해결기준에 따릅니다.</li>
        </ul>
      </section>
    </div>
  );
};
