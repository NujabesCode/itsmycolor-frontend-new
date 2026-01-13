import Image from 'next/image';

const CONTENTS_DATA = [
  {
    image: '/main/new-content1.png',
    title: '무료 체형 분석',
    description: ['전문가가 제공해준 질문 리스트를 통해서 태생적으로', '타고난 나의 체형 유형을 알아가기!'],
  },
  {
    image: '/main/new-content2.png',
    title: '무료 퍼스널 컬러 분석',
    description: ['얼굴 사진 한장 만으로 나의 타고난 피부 색깔을 알고,', '가장 잘 어울리는 스타일을 추천 받기!'],
  },
  {
    image: '/main/new-content3.png',
    title: '체형 맞춤 의류 추천 매칭',
    description: ['체형 분석을 통해 알게 된 나의 체형에 가장 어울리는', '스타일과 의류 상품까지 추천 받기!'],
  },
  {
    image: '/main/new-content4.png',
    title: '무료 시착 체험',
    description: ['아직도 반품 하시나요?', '얼굴 사진 한 장으로 나에게 어울리는 스타일인지 확인!'],
  },
  {
    image: '/main/new-content5.png',
    title: '오프라인 컨설팅',
    description: [
      '무료 분석보다 Deep하게 나를 알고 싶으신 분들 주목!',
      '경력 10년차 전문가가 나에 대한 분석 서비스도 있어요!',
    ],
  },
];

export const ContentView = () => {
  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 lg:mb-16">
          <h2 className="text-3xl lg:text-5xl font-light tracking-tight text-gray-900 mb-4 lg:mb-6">
            나를 알아가는 시간
          </h2>
          <p className="text-base lg:text-lg text-gray-600 font-light max-w-3xl mx-auto">
            잇츠마이컬러는 나만의 스타일을 발견하는 경험을 제공합니다.
            <br />
            바쁘고 어지러운 현실 속에서 무엇보다 중요한 것은
            <br />
            자신만의 고유 매력을 알고 자신감을 갖는 것.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          {CONTENTS_DATA.map((content, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={content.image}
                  alt={content.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-medium text-gray-900 mb-2 lg:mb-4">{content.title}</h3>
                <div className="space-y-1 lg:space-y-2">
                  {content.description.map((line, idx) => (
                    <p key={idx} className="text-gray-600 text-xs lg:text-sm leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
