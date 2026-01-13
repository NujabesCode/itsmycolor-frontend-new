import { IoSparkles } from 'react-icons/io5';
import Image from 'next/image';

interface Props {
  onStart: () => void;
}

export default function Intro({ onStart }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 p-4 text-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-xl w-full">
        {/* 로고 이미지 */}
        <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 relative">
          <Image
            src="/image/itsmycolor-logo.png"
            alt="It&apos;s my color Logo"
            fill
            className="object-contain animate-bounce"
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-purple-600 mb-6">
          퍼스널 컬러 테스트
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          몇 가지 질문에 답하면 당신의 퍼스널 컬러를 알아볼 수 있어요!
        </p>
        {/* 테스트 안내 */}
        <div className="bg-gradient-to-r from-rose-50 to-purple-50 rounded-2xl p-6 mb-8">
          <ul className="text-left text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>총 12개의 질문에 답해주세요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>각 질문마다 가장 적합한 답변을 선택해주세요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>약 3-5분 정도 소요됩니다</span>
            </li>
          </ul>
        </div>
        <button
          onClick={onStart}
          className="bg-gradient-to-r from-rose-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 mx-auto hover:shadow-xl hover:scale-105 transition-all"
        >
          <IoSparkles />
          테스트 시작하기
        </button>
      </div>
    </div>
  );
} 