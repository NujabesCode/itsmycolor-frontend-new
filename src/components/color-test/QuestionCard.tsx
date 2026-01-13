import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { Question } from '@/data/colorTestQuestions';

interface Props {
  question: Question;
  currentIndex: number;
  total: number;
  selectedOption?: number;
  onSelect: (optionIdx: number) => void;
  onPrev: () => void;
  onNext: () => void;
  canNext: boolean;
}

export default function QuestionCard({
  question,
  currentIndex,
  total,
  selectedOption,
  onSelect,
  onPrev,
  onNext,
  canNext,
}: Props) {
  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <div>
      {/* 진행 바 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2 text-sm font-medium text-gray-600">
          <span>
            {currentIndex + 1} / {total}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 질문 카드 */}
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Q{currentIndex + 1}
          </h2>
          <p className="text-lg md:text-xl text-gray-700 whitespace-pre-line">
            {question.question}
          </p>
        </div>

        {/* 보기 */}
        <div className="space-y-4">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                selectedOption === idx
                  ? 'border-rose-500 bg-rose-50'
                  : 'border-gray-200 hover:border-rose-300 hover:bg-rose-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="text-base md:text-lg font-medium text-gray-700">
                    {opt.answer}
                  </span>
                </div>
                {selectedOption === idx && (
                  <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* 네비게이션 */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              currentIndex === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <IoChevronBack /> 이전
          </button>

          {currentIndex < total - 1 && (
            <button
              onClick={onNext}
              disabled={!canNext}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                !canNext
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              다음 <IoChevronForward />
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 