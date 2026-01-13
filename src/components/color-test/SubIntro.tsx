import Image from 'next/image';
import { IoChevronForward } from 'react-icons/io5';

interface Props {
  onContinue: () => void;
}

export default function SubIntro({ onContinue }: Props) {
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
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-purple-600 mb-6">
          세부톤을 위한 질문 더 해볼게요!
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed whitespace-pre-line">
          지금부터 추가 질문 3가지를 통해 당신의 세부 퍼스널 톤을 알아볼게요.
        </p>
        <button
          onClick={onContinue}
          className="bg-gradient-to-r from-rose-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 mx-auto hover:shadow-xl hover:scale-105 transition-all"
        >
          계속하기 <IoChevronForward />
        </button>
      </div>
    </div>
  );
} 