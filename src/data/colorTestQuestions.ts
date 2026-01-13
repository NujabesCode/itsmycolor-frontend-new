export type Gender = 0 | 1 | null;

export interface Option {
  answer: string;
  icon: string; // emoji or icon representing the answer
}

export interface Question {
  question: string;
  options: Option[];
}

// 성별 질문 (0: 남성, 1: 여성)
export const GENDER_QUESTION: Question = {
  question: '성별을 선택해주세요',
  options: [
    { answer: '남성', icon: '👨' },
    { answer: '여성', icon: '👩' },
  ],
};

// 공통 질문 (성별에 무관)
const COMMON_QUESTIONS_BEFORE_GENDER: Question[] = [
  {
    question: '햇볕을 받으면 내 피부는?',
    options: [
      { answer: '잘 타고 건강해 보이는 갈색이 된다', icon: '🌞' },
      { answer: '금방 붉어지고 따가워진다', icon: '🔥' },
      { answer: '은근히 타지만 칙칙해 보인다', icon: '🌤️' },
      { answer: '거의 안 타고 하얗거나 붉어진다', icon: '❄️' },
    ],
  },
  {
    question: '맨얼굴일 때 내 피부는?',
    options: [
      { answer: '살구빛, 노란기 도는 밝은 톤', icon: '🍑' },
      { answer: '핑크빛, 투명한 피부', icon: '🌸' },
      { answer: '베이지/올리브 계열, 고른 피부톤', icon: '🏝️' },
      { answer: '붉은기 도는 피부', icon: '🌹' },
    ],
  },
  {
    question: '내가 자주 듣는 인상은?',
    options: [
      { answer: '귀엽고 발랄해 보여', icon: '😊' },
      { answer: '부드럽고 단아해 보여', icon: '🙂' },
      { answer: '안정적이고 지적이야', icon: '🧐' },
      { answer: '시크하고 세련됐어', icon: '😎' },
    ],
  },
  {
    question: '자연 머리카락 색은?',
    options: [
      { answer: '밝은 갈색에 붉은기 살짝', icon: '🍂' },
      { answer: '잿빛 갈색 혹은 중간톤', icon: '🪶' },
      { answer: '어두운 갈색, 붉은기 있음', icon: '🌰' },
      { answer: '짙고 윤기 나는 흑갈색', icon: '⚫' },
    ],
  },
  {
    question: '눈동자 색은?',
    options: [
      { answer: '밝은 황갈색', icon: '🟠' },
      { answer: '연한 회갈색', icon: '🟤' },
      { answer: '짙은 고동색', icon: '🟫' },
      { answer: '선명한 검정색 또는 붉은기 있는 갈색', icon: '⚫' },
    ],
  },
];

// 성별에 따른 6번 질문
const FEMALE_Q6: Question = {
  question: '잘 어울리는 립 컬러는?',
  options: [
    { answer: '코랄, 피치, 살구', icon: '🍑' },
    { answer: '로즈, 라벤더, 핑크', icon: '🌸' },
    { answer: '브릭, 테라코타, 카키', icon: '🧡' },
    { answer: '버건디, 레드, 와인', icon: '❤️' },
  ],
};

const MALE_Q6: Question = {
  question: '당신에게 생기를 더해주는 셔츠 색은?',
  options: [
    { answer: '살구, 베이지, 라이트옐로우', icon: '🟠' },
    { answer: '라벤더, 소라, 인디핑크', icon: '💜' },
    { answer: '카멜, 브라운, 카키', icon: '🟤' },
    { answer: '네이비, 블랙, 와인', icon: '⚫' },
  ],
};

const COMMON_QUESTIONS_AFTER_GENDER: Question[] = [
  {
    question: '어울리는 옷 색 계열은?',
    options: [
      { answer: '밝고 화사한 따뜻한 색 (코랄, 크림 옐로우 등)', icon: '🧡' },
      { answer: '파스텔톤, 연보라, 소라 등 부드러운 색', icon: '💜' },
      { answer: '카멜, 카키, 버건디 등 그윽한 색', icon: '🟤' },
      { answer: '선명한 원색, 블랙 & 쿨레드', icon: '🖤' },
    ],
  },
  {
    question: '액세서리 선택은?',
    options: [
      { answer: '옐로우골드가 더 잘 어울려', icon: '🏅' },
      { answer: '실버/화이트골드가 더 잘 어울려', icon: '🥈' },
      { answer: '로즈골드나 앤틱한 브론즈', icon: '🥉' },
      { answer: '시크한 광택 실버', icon: '💍' },
    ],
  },
];

// ---------- 세부 톤 분류용 ----------
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

const SPRING_SUB_QUESTIONS: Question[] = [
  {
    question: '어떤 색이 더 잘 어울리나요?',
    options: [
      { answer: '부드러운 파스텔 컬러 (연노랑, 베이비핑크, 민트 등)', icon: '🌸' },
      { answer: '생기 있고 쨍한 색감 (코랄, 선명한 오렌지, 비비드 옐로우 등)', icon: '🌼' },
    ],
  },
  {
    question: '강한 색을 입으면 얼굴이?',
    options: [
      { answer: '색이 튀고 얼굴이 가려진다', icon: '😶' },
      { answer: '또렷하고 생기가 돈다', icon: '😊' },
    ],
  },
  {
    question: '본인의 분위기는?',
    options: [
      { answer: '부드럽고 밝은 인상', icon: '🙂' },
      { answer: '활기차고 통통 튀는 느낌', icon: '😁' },
    ],
  },
];

const SUMMER_SUB_QUESTIONS: Question[] = [
  {
    question: '어떤 컬러가 더 잘 어울리나요?',
    options: [
      { answer: '맑고 투명한 파스텔 계열 (소라, 라벤더, 인디핑크 등)', icon: '💧' },
      { answer: '톤 다운된 뿌연 컬러 (그레이시 핑크, 모브, 연그레이 등)', icon: '🌫️' },
    ],
  },
  {
    question: '흰 셔츠보다 어울리는 색은?',
    options: [
      { answer: '밝은 블루, 연보라', icon: '🩵' },
      { answer: '연베이지, 라이트그레이', icon: '🤍' },
    ],
  },
  {
    question: '본인의 인상은?',
    options: [
      { answer: '맑고 깨끗한 인상', icon: '😇' },
      { answer: '차분하고 은은한 인상', icon: '😌' },
    ],
  },
];

const AUTUMN_SUB_QUESTIONS: Question[] = [
  {
    question: '어떤 컬러가 더 잘 어울리나요?',
    options: [
      { answer: '밝고 소프트한 가을색 (모카, 라이트브라운, 올리브)', icon: '🍂' },
      { answer: '깊고 무게감 있는 컬러 (카멜, 초콜릿, 버건디)', icon: '🍁' },
    ],
  },
  {
    question: '진한 컬러를 입으면?',
    options: [
      { answer: '칙칙하거나 나이 들어보인다', icon: '🙁' },
      { answer: '세련되고 고급스러워 보인다', icon: '💃' },
    ],
  },
  {
    question: '전체적인 인상은?',
    options: [
      { answer: '내추럴하고 따뜻함', icon: '😊' },
      { answer: '무게감 있고 성숙함', icon: '😎' },
    ],
  },
];

const WINTER_SUB_QUESTIONS: Question[] = [
  {
    question: '어떤 색이 더 잘 어울리나요?',
    options: [
      { answer: '쨍하고 선명한 원색 (레드, 블루, 푸시아)', icon: '❄️' },
      { answer: '차분한 딥톤 (와인, 차콜, 네이비)', icon: '🌌' },
    ],
  },
  {
    question: '블랙 앤 화이트의 대비는?',
    options: [
      { answer: '생기 있고 세련돼 보인다', icon: '🖤' },
      { answer: '너무 세 보이거나 날카로워 보인다', icon: '⚔️' },
    ],
  },
  {
    question: '내 이미지에 가까운 것은?',
    options: [
      { answer: '또렷하고 존재감 있는 인상', icon: '🌟' },
      { answer: '무게감 있고 차분한 인상', icon: '🌙' },
    ],
  },
];

export const getSubQuestions = (season: Season): Question[] => {
  switch (season) {
    case 'spring':
      return SPRING_SUB_QUESTIONS;
    case 'summer':
      return SUMMER_SUB_QUESTIONS;
    case 'autumn':
      return AUTUMN_SUB_QUESTIONS;
    case 'winter':
      return WINTER_SUB_QUESTIONS;
    default:
      return [];
  }
};

export const getQuestions = (gender: Gender): Question[] => {
  const genderSpecific = gender === 1 ? FEMALE_Q6 : MALE_Q6; // 기본은 남성 기준
  return [
    GENDER_QUESTION,
    ...COMMON_QUESTIONS_BEFORE_GENDER,
    genderSpecific,
    ...COMMON_QUESTIONS_AFTER_GENDER,
  ];
}; 