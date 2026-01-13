'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Result } from '@/components/type-test/Result';
import { useGetUser } from '@/serivces/user/query';
import { BodyType } from '@/serivces/user/type';
import { colorAnalysisApi } from '@/serivces/color-analysis/request';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY } from '@/configs/constant/query';
import { IoSparkles, IoChevronBack, IoChevronForward } from 'react-icons/io5';

const QUESTIONS = [
  {
    question: '나의 전체적인 인상을 체크해줘',
    options: [
      { answer: '두께감 있고 육감적이다', icon: '💪' },
      { answer: '두껍지 않고 평면적이다', icon: '✨' },
      { answer: '몸의 골격이 눈에 띈다', icon: '🦴' },
    ],
  },
  {
    question: '손의 특징은?',
    options: [
      { answer: '신장에 비해 작은 사이즈', icon: '🤏' },
      { answer: '신장과 밸런스가 맞는 사이즈', icon: '✋' },
      { answer: '신장에 비해 큰 사이즈', icon: '🖐️' },
    ],
  },
  {
    question: '손가락 관절의 크기는?',
    options: [
      { answer: '작다', icon: '·' },
      { answer: '보통', icon: '•' },
      { answer: '크다', icon: '●' },
    ],
  },
  {
    question: '손목의 특징은?',
    options: [
      { answer: '가늘고 둥근형', icon: '⭕' },
      { answer: '너비가 있고 둥글 납작한 형', icon: '⬭' },
      { answer: '손목뼈가 확실하게 나와있음', icon: '💀' },
    ],
  },
  {
    question: '손바닥과 손등의 특징은?',
    options: [
      { answer: '두께감이 있는 편', icon: '🍖' },
      { answer: '두께가 얇은 편', icon: '🍃' },
      { answer: '두께감 보다는 손등의 힘줄이 눈에 띔', icon: '🦾' },
    ],
  },
  {
    question: '목의 특징은?',
    options: [
      { answer: '조금 짧은 편', icon: '🦆' },
      { answer: '조금 긴 편', icon: '🦒' },
      { answer: '관절이 눈에 띔', icon: '🦴' },
    ],
  },
  {
    question: '쇄골의 특징은?',
    options: [
      { answer: '그다지 눈에 띄지 않음', icon: '☁️' },
      { answer: '가냘프게 살짝 나와있음', icon: '〰️' },
      { answer: '크고 확실하게 나와 있음', icon: '⚡' },
    ],
  },
  {
    question: '무릎펴(슬개골)의 특징은?',
    options: [
      { answer: '작고 눈에 띄지 않는다', icon: '·' },
      { answer: '크지도 작지도 않다', icon: '•' },
      { answer: '크다', icon: '●' },
    ],
  },
  {
    question: '피부 질감의 특징은?',
    options: [
      { answer: '탄력있는 질감', icon: '🎾' },
      { answer: '푹신하고 부드러운 질감', icon: '☁️' },
      { answer: '약간 두껍고 드라이한 질감', icon: '🏜️' },
    ],
  },
  {
    question: '신발 사이즈는?',
    options: [
      { answer: '신장에 비해 작은 사이즈', icon: '👠' },
      { answer: '신장과 밸런스가 맞는 사이즈', icon: '👟' },
      { answer: '신장에 비해 큰 사이즈', icon: '🥾' },
    ],
  },
  {
    question: '본인의 성별은 무엇인가요?',
    options: [
      {
        answer: '여성',
        icon: '👩',
      },
      {
        answer: '남성',
        icon: '👨',
      },
    ],
  },
];

export default function TypeTest() {
  const queryClient = useQueryClient();
  const [{ data: user }, { data: colorAnalysis }] = useGetUser();

  const [isLoading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [result, setResult] = useState<BodyType | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  const handleAnswer = (index: number, answer: number) => {
    setAnswers((prev) => ({ ...prev, [index]: answer }));

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 300);
    } else {
      onShowResult();
    }
  };

  const onShowResult = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setLoading(false);

    const values = Object.values(answers).slice(0, 10);
    const straightCount = values.filter((v) => v === 0).length;
    const waveCount = values.filter((v) => v === 1).length;
    const naturalCount = values.filter((v) => v === 2).length;

    const tempResult =
      straightCount > waveCount && straightCount > naturalCount
        ? BodyType.STRAIGHT
        : waveCount > straightCount && waveCount > naturalCount
        ? BodyType.WAVE
        : BodyType.NATURAL;

    setResult(tempResult);

    await new Promise((resolve) => setTimeout(resolve, 300));
    const resultElement = document.getElementById('type-test-result');
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: 'smooth' });
    }

    try {
      if (user && colorAnalysis) {
        await colorAnalysisApi.updateColorAnalysis(
          colorAnalysis.id,
          undefined,
          undefined,
          tempResult,
          undefined
        );
        await queryClient.invalidateQueries({
          queryKey: [QUERY.COLOR_ANALYSIS],
        });
      }
    } catch (error) {}
  };

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 relative">
            <Image
              src="/image/itsmycolor-logo.png"
              alt="Judi"
              fill
              className="object-contain animate-bounce"
            />
          </div>

          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            체형 진단 테스트
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            몇 가지 질문에 답해주시면 여러분의 체형 유형을 알려 드릴게요! 😊
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-3">테스트 안내</h3>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>총 11개의 질문에 답해주세요</span>
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
            onClick={() => setShowIntro(false)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <IoSparkles />
            테스트 시작하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              {currentQuestionIndex + 1} / {QUESTIONS.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Q{currentQuestionIndex + 1}
            </h2>
            <p className="text-lg md:text-xl text-gray-700">
              {currentQuestion.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(currentQuestionIndex, index)}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                  answers[currentQuestionIndex] === index
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{option.icon}</span>
                    <span className="text-base md:text-lg font-medium text-gray-700">
                      {option.answer}
                    </span>
                  </div>
                  {answers[currentQuestionIndex] === index && (
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
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

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentQuestionIndex === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <IoChevronBack />
              이전
            </button>

            {currentQuestionIndex < QUESTIONS.length - 1 && (
              <button
                onClick={() => {
                  if (answers[currentQuestionIndex] !== undefined) {
                    setCurrentQuestionIndex((prev) => prev + 1);
                  }
                }}
                disabled={answers[currentQuestionIndex] === undefined}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  answers[currentQuestionIndex] === undefined
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                다음
                <IoChevronForward />
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin" />
              <p className="text-lg font-medium text-gray-700">
                체형을 분석하고 있습니다...
              </p>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-12" id="type-test-result">
            <Result type={result} genderIndex={answers[10]} />
          </div>
        )}
      </div>
    </div>
  );
}
