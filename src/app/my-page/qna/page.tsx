'use client';

import { useEffect, useState } from 'react';
import {
  IoHelpCircle,
  IoAdd,
  IoChevronDown,
  IoChevronUp,
  IoTime,
  IoCheckmarkCircle,
  IoAlertCircle,
  IoSearch,
  IoFilter,
  IoChatbubbleEllipses,
} from 'react-icons/io5';
import { QnaModal } from '@/components/my-page-qna/QnaModal';
import { QnaFormModal } from '@/components/my-page-qna/QnaFormModal';
import { useGetQnaListByUser } from '@/serivces/qna/query';
import { QnaType } from '@/serivces/qna/type';
import { QnaStatus, Qna } from '@/serivces/admin/type';
import { formatDate } from '@/utils/date';
import { useQueryString } from '@/hooks/common/useQueryString';
import { useDebounce } from '@/hooks/common/useDebounce';
import { Pagination } from '@/components/common/Pagination';

const QNA_STATUS_MAP = {
  [QnaStatus.WAITING]: {
    label: '답변 대기',
    icon: IoTime,
    color: 'text-yellow-600 bg-yellow-50',
  },
  [QnaStatus.ANSWERED]: {
    label: '답변 완료',
    icon: IoCheckmarkCircle,
    color: 'text-green-600 bg-green-50',
  },
};

const QNA_TYPE_MAP = {
  [QnaType.PRODUCT]: { label: '상품 문의', color: 'bg-blue-100 text-blue-700' },
  [QnaType.DELIVERY]: {
    label: '배송 문의',
    color: 'bg-purple-100 text-purple-700',
  },
  [QnaType.EXCHANGE]: { label: '교환/환불', color: 'bg-red-100 text-red-700' },
  [QnaType.SIZE]: {
    label: '사이즈 문의',
    color: 'bg-indigo-100 text-indigo-700',
  },
  [QnaType.BODY]: { label: '체형 문의', color: 'bg-green-100 text-green-700' },
  [QnaType.COLOR]: { label: '컬러 문의', color: 'bg-pink-100 text-pink-700' },
};

const QNA_CATEGORIES = [
  {
    type: 'order',
    title: '주문/배송',
    icon: '🛒',
    faqs: [
      {
        q: '주문 취소는 어떻게 하나요?',
        a: '주문 상태가 "배송준비중" 이전이라면 마이페이지 > 주문내역에서 취소가 가능합니다.',
      },
      {
        q: '배송 기간은 얼마나 걸리나요?',
        a: '일반적으로 결제 완료 후 2-3일 이내에 배송됩니다. 제주/도서산간 지역은 추가 1-2일이 소요될 수 있습니다.',
      },
      {
        q: '배송지 변경이 가능한가요?',
        a: '배송 출발 전까지 고객센터로 연락주시면 변경 가능합니다.',
      },
    ],
  },
  {
    type: 'product',
    title: '상품',
    icon: '👔',
    faqs: [
      {
        q: '사이즈가 맞지 않으면 어떻게 하나요?',
        a: '상품 수령 후 7일 이내에 교환/반품 신청이 가능합니다.',
      },
      {
        q: '실제 색상이 다른 것 같아요',
        a: '모니터 환경에 따라 색상 차이가 있을 수 있습니다. 퍼스널컬러 분석 결과를 참고해주세요.',
      },
      {
        q: '재입고 예정이 있나요?',
        a: '품절 상품의 재입고 알림 신청을 하시면 입고 시 알려드립니다.',
      },
    ],
  },
  {
    type: 'return',
    title: '반품/교환',
    icon: '↩️',
    faqs: [
      {
        q: '반품 절차가 어떻게 되나요?',
        a: '마이페이지 > 주문내역에서 반품신청을 하신 후, 택배사에서 수거해갑니다.',
      },
      {
        q: '반품 배송비는 누가 부담하나요?',
        a: '단순 변심은 고객님 부담, 불량/오배송은 판매자 부담입니다.',
      },
      {
        q: '교환은 몇 번까지 가능한가요?',
        a: '상품당 1회까지 무료 교환이 가능합니다.',
      },
    ],
  },
  {
    type: 'membership',
    title: '회원/포인트',
    icon: '👤',
    faqs: [
      {
        q: '포인트는 어떻게 사용하나요?',
        a: '결제 시 포인트 사용란에 사용하실 포인트를 입력하시면 됩니다.',
      },
      {
        q: '포인트 유효기간이 있나요?',
        a: '적립일로부터 1년간 유효하며, 소멸 30일 전 알림을 드립니다.',
      },
      {
        q: '회원 등급 혜택은 무엇인가요?',
        a: '등급별로 추가 적립률과 쿠폰 혜택이 제공됩니다.',
      },
    ],
  },
];

export default function MyPageQna() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [selectedQna, setSelectedQna] = useState<Qna | null>(null);
  const [isQnaFormModalOpen, setIsQnaFormModalOpen] = useState(false);

  const [type, setType] = useQueryString<string>('type', '');
  const [status, setStatus] = useQueryString<string>('status', '');

  const [tempSearch, setTempSearch] = useState('');
  const debouncedTempSearch = useDebounce(tempSearch, 500);
  const [, setSearch] = useQueryString<string>('search', '');
  useEffect(() => {
    if (debouncedTempSearch) {
      setSearch(debouncedTempSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTempSearch]);

  const { data: qnasData } = useGetQnaListByUser();

  const qnaList = qnasData?.qnas;
  const lastPage = qnasData?.lastPage;

  const handleFaqClick = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-4">문의 내역</h1>
          <p className="text-indigo-100">궁금하신 점을 해결해드립니다.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <IoHelpCircle className="text-indigo-600" />
            자주 묻는 질문
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {QNA_CATEGORIES.map((category) => (
              <button
                key={category.type}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.type ? null : category.type
                  )
                }
                className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                  selectedCategory === category.type
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-indigo-300'
                }`}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {category.faqs.length}개 질문
                </p>
              </button>
            ))}
          </div>

          {selectedCategory && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h3 className="font-semibold text-lg mb-4">
                {QNA_CATEGORIES.find((c) => c.type === selectedCategory)?.title}{' '}
                관련 FAQ
              </h3>
              <div className="space-y-3">
                {QNA_CATEGORIES.find(
                  (c) => c.type === selectedCategory
                )?.faqs.map((faq, index) => {
                  const faqId = `${selectedCategory}-${index}`;
                  return (
                    <div
                      key={faqId}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => handleFaqClick(faqId)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-left font-medium text-gray-900">
                          {faq.q}
                        </span>
                        {expandedFaq === faqId ? (
                          <IoChevronUp className="text-gray-400 flex-shrink-0" />
                        ) : (
                          <IoChevronDown className="text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {expandedFaq === faqId && (
                        <div className="px-4 py-3 bg-gray-50 border-t">
                          <p className="text-gray-700">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* My QnA Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <IoChatbubbleEllipses className="text-indigo-600" />
              나의 문의 내역
            </h2>
            <button
              onClick={() => setIsQnaFormModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              <IoAdd size={20} />새 문의하기
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Type Filter */}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <IoFilter size={16} />
                  문의 유형
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setType('')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      type === ''
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    전체
                  </button>
                  {Object.entries(QNA_TYPE_MAP).map(([itemType, config]) => (
                    <button
                      key={itemType}
                      onClick={() => setType(itemType as QnaType)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        itemType === type
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  답변 상태
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setStatus('')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      status === ''
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    전체
                  </button>
                  {Object.entries(QNA_STATUS_MAP).map(
                    ([itemStatus, config]) => (
                      <button
                        key={itemStatus}
                        onClick={() => setStatus(itemStatus as QnaStatus)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          itemStatus === status
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {config.label}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative mt-4">
              <IoSearch
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="제목 또는 내용으로 검색"
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* QnA List */}
          {qnaList && qnaList.length > 0 ? (
            <div className="space-y-4">
              {qnaList.map((qna: Qna) => {
                const StatusIcon = QNA_STATUS_MAP[qna.status].icon;
                const statusConfig = QNA_STATUS_MAP[qna.status];
                const typeConfig = QNA_TYPE_MAP[qna.type];

                return (
                  <div
                    key={qna.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedQna(qna)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}
                          >
                            {typeConfig.label}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                          >
                            <StatusIcon size={14} />
                            {statusConfig.label}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(qna.createdAt)}
                        </span>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-2">
                        {qna.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2 mb-3">
                        {qna.content}
                      </p>

                      {qna.answer && (
                        <div className="bg-pink-50 rounded-lg p-4 mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <IoCheckmarkCircle
                              className="text-pink-600"
                              size={18}
                            />
                            <span className="font-medium text-pink-900">
                              답변
                            </span>
                          </div>
                          <p className="text-gray-700 line-clamp-2">
                            {qna.answer}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            답변일: {formatDate(qna.answeredAt!)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-16 text-center">
              <IoChatbubbleEllipses
                className="mx-auto text-gray-300 mb-4"
                size={64}
              />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                문의 내역이 없습니다
              </h3>
              <p className="text-gray-500 mb-6">
                궁금하신 점이 있으시면 문의해주세요.
              </p>
              <button
                onClick={() => setIsQnaFormModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                <IoAdd size={20} />새 문의하기
              </button>
            </div>
          )}
        </div>
      </div>

      {lastPage ? <Pagination lastPage={lastPage} /> : null}

      {/* QnA Modal */}
      {selectedQna && (
        <QnaModal qna={selectedQna} onClose={() => setSelectedQna(null)} />
      )}

      {/* QnA Form Modal */}
      <QnaFormModal
        isOpen={isQnaFormModalOpen}
        onClose={() => setIsQnaFormModalOpen(false)}
      />
    </div>
  );
}
