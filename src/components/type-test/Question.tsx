import Image from "next/image";

interface QuestionProps {
  i: number;
  question: string;
  options: { answer: string; image?: string }[];
  answers: { [key: number]: number };
  handleAnswer: (index: number, answer: number) => void;
}

export const Question = ({
  i,
  question,
  options,
  answers,
  handleAnswer,
}: QuestionProps) => {
  return (
    <div className="w-full mx-auto bg-white rounded-2xl p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 relative border border-grey-90/10">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] relative">
          <Image
            src="/type-test/judi.png"
            alt="judi"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <span className="text-xs md:text-sm text-grey-40 font-medium">
            Question {i + 1}/12
          </span>
          <h3 className="font-semibold text-grey-20 text-base md:text-lg">
            {question}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {options.map((option, j) => (
          <button
            key={`option/${i}/${j}`}
            className={`cursor-pointer rounded-xl p-4 transition-all duration-300 flex flex-col h-full border
              ${
                answers[i] === j
                  ? "bg-grey-20 text-white shadow-lg transform scale-102 border-grey-40"
                  : "bg-grey-95 hover:bg-grey-90 hover:transform hover:scale-102 text-grey-20 border-grey-90"
              }`}
            onClick={() => handleAnswer(i, j)}
          >
            <div className="font-medium text-sm md:text-base flex items-center gap-3 mb-2">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 text-sm">
                {["A", "B", "C"][j]}
              </span>
              {option.answer}
            </div>
            {option.image && (
              <div className="mt-auto w-full h-24 relative rounded-lg overflow-hidden">
                <Image
                  src={option.image}
                  alt={option.answer}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
