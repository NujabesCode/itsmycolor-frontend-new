export const StepNavigator = ({ step, setStep, isEdit }: { step: number; setStep: (step: number) => void; isEdit: boolean }) => {
  const steps = [
    { number: 1, label: '상품 기본정보' },
    { number: 2, label: '판매정보' },
    { number: 3, label: '상세 설명' },
    { number: 4, label: '체형 분석 정보' },
    { number: 5, label: '배송 정보' },
  ];

  return (
    <div className="flex gap-8">
      {steps.map((s) => (
        <div
          key={s.number}
          className={`transition-colors select-none ${
            isEdit
              ? step === s.number
                ? 'px-4 py-2 rounded-md bg-gray-900 text-white cursor-pointer'
                : 'px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
              : step === s.number
              ? 'pb-2 text-gray-900 font-semibold border-b-2 border-gray-900'
              : 'pb-2 text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => {
            if (isEdit) {
              setStep(s.number);
            }
          }}
        >
          {s.number}. {s.label} {isEdit && '편집'}
        </div>
      ))}
    </div>
  );
};
