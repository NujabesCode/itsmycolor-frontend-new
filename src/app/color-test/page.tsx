'use client';

import { useState } from 'react';
import Intro from '@/components/color-test/Intro';
import QuestionCard from '@/components/color-test/QuestionCard';
import ResultCard from '@/components/color-test/ResultCard';
import SubIntro from '@/components/color-test/SubIntro';
import {
  getQuestions,
  getSubQuestions,
  Question,
  Season,
} from '@/data/colorTestQuestions';
import { ColorSeason } from '@/serivces/color-analysis/type';

export default function ColorTest() {
  // 단계: intro -> main -> guide -> sub -> result
  const [stage, setStage] = useState<'intro' | 'main' | 'guide' | 'sub' | 'result'>('intro');

  // 공통 상태
  const [gender, setGender] = useState<0 | 1 | null>(null); // 0: 남성, 1: 여성
  const [season, setSeason] = useState<Season | null>(null);

  // 메인 질문 관련 상태
  const mainQuestions: Question[] = getQuestions(gender);
  const [mainIdx, setMainIdx] = useState(0);
  const [answersMain, setAnswersMain] = useState<{ [key: number]: number }>({});

  // 서브 질문 관련 상태
  const subQuestions: Question[] = season ? getSubQuestions(season) : [];
  const [subIdx, setSubIdx] = useState(0);
  const [answersSub, setAnswersSub] = useState<{ [key: number]: number }>({});

  // 최종 결과
  const [finalResult, setFinalResult] = useState<ColorSeason | null>(null);

  /* ----------------- 메인 단계 로직 ----------------- */
  const handleMainAnswer = (idx: number, optionIdx: number) => {
    if (idx === 0) {
      // 성별 저장 (첫 질문은 성별)
      setGender(optionIdx as 0 | 1);
    }
    setAnswersMain((prev) => ({ ...prev, [idx]: optionIdx }));

    if (idx < mainQuestions.length - 1) {
      // 잠깐의 애니메이션 효과를 위해 약간 지연
      setTimeout(() => setMainIdx((prev) => prev + 1), 300);
    } else {
      // 메인 질문 완료 -> 시즌 계산 후 가이드 단계로 이동
      const determinedSeason = determineSeason({
        ...answersMain,
        [idx]: optionIdx,
      });
      setSeason(determinedSeason);
      setStage('guide');
    }
  };

  const determineSeason = (answers: { [key: number]: number }): Season => {
    // 메인 질문 중 COMMON_QUESTIONS_BEFORE_GENDER(5개)는 인덱스 1~5
    const count = [0, 0, 0, 0];
    for (let i = 1; i <= 5; i += 1) {
      const ans = answers[i];
      if (ans !== undefined) count[ans] += 1;
    }
    const max = Math.max(...count);
    const idx = count.indexOf(max);
    switch (idx) {
      case 0:
        return 'spring';
      case 1:
        return 'summer';
      case 2:
        return 'autumn';
      default:
        return 'winter';
    }
  };

  /* ----------------- 서브 단계 로직 ----------------- */
  const handleSubAnswer = (idx: number, optionIdx: number) => {
    setAnswersSub((prev) => ({ ...prev, [idx]: optionIdx }));

    if (idx < subQuestions.length - 1) {
      setTimeout(() => setSubIdx((prev) => prev + 1), 300);
    } else {
      // 서브 질문 완료 -> 결과 단계
      const result = determineDetailTone(optionIdx, {
        ...answersSub,
        [idx]: optionIdx,
      });
      setFinalResult(result);
      setStage('result');
    }
  };

  /* ----------------- 세부 톤 결정 ----------------- */
  const determineDetailTone = (
    lastOptionIdx: number,
    answers: { [key: number]: number },
  ): ColorSeason => {
    // answers 객체는 서브 질문 인덱스 기준 (0,1,2). 값은 0(A) 또는 1(B)
    const counts = [0, 0];
    Object.values(answers).forEach((v) => {
      if (v === 0 || v === 1) counts[v] += 1;
    });

    // A/B 중 더 많은 쪽. 동률이면 마지막 답변 기준
    const subIdx: 0 | 1 = counts[0] === counts[1] ? (lastOptionIdx as 0 | 1) : (counts[0] > counts[1] ? 0 : 1);

    switch (season) {
      case 'spring':
        return subIdx === 0 ? ColorSeason.SPRING_LIGHT : ColorSeason.SPRING_BRIGHT;
      case 'summer':
        return subIdx === 0 ? ColorSeason.SUMMER_LIGHT : ColorSeason.SUMMER_MUTE;
      case 'autumn':
        return subIdx === 0 ? ColorSeason.AUTUMN_MUTE : ColorSeason.AUTUMN_DEEP;
      case 'winter':
      default:
        return subIdx === 0 ? ColorSeason.WINTER_BRIGHT : ColorSeason.WINTER_DARK;
    }
  };

  /* ----------------- 네비게이션 ----------------- */
  const goPrev = () => {
    if (stage === 'main') {
      setMainIdx((prev) => Math.max(0, prev - 1));
    } else if (stage === 'sub') {
      setSubIdx((prev) => Math.max(0, prev - 1));
    }
  };

  const goNext = () => {
    if (stage === 'main') {
      if (answersMain[mainIdx] !== undefined) {
        setMainIdx((prev) => prev + 1);
      }
    } else if (stage === 'sub') {
      if (answersSub[subIdx] !== undefined) {
        setSubIdx((prev) => prev + 1);
      }
    }
  };

  /* ----------------- 렌더링 ----------------- */
  if (stage === 'intro') {
    return <Intro onStart={() => setStage('main')} />;
  }

  if (stage === 'guide' && season) {
    return <SubIntro onContinue={() => setStage('sub')} />;
  }

  if (stage === 'result') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        {finalResult && <ResultCard result={finalResult} gender={gender} />}
      </div>
    );
  }

  // 공통 레이아웃 (main / sub 질문 카드)
  const currentQuestions = stage === 'main' ? mainQuestions : subQuestions;
  const currentIndex = stage === 'main' ? mainIdx : subIdx;
  const selectedOption = stage === 'main' ? answersMain[currentIndex] : answersSub[currentIndex];
  const canNext = selectedOption !== undefined;
  const onSelect = stage === 'main' ? handleMainAnswer : handleSubAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <QuestionCard
          question={currentQuestions[currentIndex]}
          currentIndex={currentIndex}
          total={currentQuestions.length}
          selectedOption={selectedOption}
          onSelect={(optIdx) => onSelect(currentIndex, optIdx)}
          onPrev={goPrev}
          onNext={goNext}
          canNext={canNext}
        />
      </div>
    </div>
  );
}