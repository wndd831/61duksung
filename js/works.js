/* =========================================================
   작품 · 디자이너 정보 (여기만 고치면 목록과 상세페이지가 같이 바뀜)

   ▸ DESIGNERS: 디자이너 한 명당 한 줄
       id      : 아무 영문 id (작품에서 이 id로 연결)
       name    : 이름          nameEn : 영문 이름
       email / phone : 없으면 빈칸('')
       photo   : 프로필 사진 경로 (없으면 회색 칸)
   ▸ WORKS: 작품 하나당 한 줄
       category : 'comm'(커뮤니케이션) / 'story'(스토리텔링일러스트) / 'video'(영상콘텐츠)
       title / titleEn : 작품명 / 영문 작품명 (titleEn 없으면 빈칸('') → 안 보임)
       desc / descEn : 줄바꿈 있는 긴 글은 작은따옴표 대신 ` ` (숫자 1 왼쪽 키)로 감싸면 엔터 그대로 써도 됨
       designer : 위 DESIGNERS의 id  → 같은 id 작품이 2개면 상세페이지에 '다른 프로젝트'로 뜸
       thumb    : 썸네일 이미지 경로 (없으면 회색 칸)
       images   : 상세페이지 이미지 경로들 (없으면 회색 칸 3개)
   ========================================================= */

const DESIGNERS = [
  { id: '김나겸', name: '김나겸', nameEn: 'Kim Nagyeom', email: 'nagyeom9704@gmail.com', phone: '010-9754-2282', photo: 'images/profile/kim-nagyeom.jpg' },
  { id: '김영혜', name: '김영혜', nameEn: 'Kim Younghye', email: 'ggoget@naver.com', phone: '@haley_illust', photo: 'images/profile/kim-younghye.jpg' },
  { id: '이한비', name: '이한비', nameEn: 'Lee Hanbi', email: 'rum0070d@gmail.com', phone: 'behance.net/rum0070d', photo: 'images/profile/lee-hanbi.jpg' },
  { id: '이미경', name: '이미경', nameEn: 'Lee Mi Kyoung', email: 'imk0279@gmail.com', phone: 'Insta @or___i_', photo: 'images/profile/lee-mikyong.jpg' },
   
];

const WORKS = [
  { id: '회피니스', category: 'comm',  designer: '김나겸', title: '회피니스', titleEn: 'H回PPINESS', desc: `‘회피니스(H回ppiness)’는 회피성향 현대인의 일상 복귀를
돕는 행동·정서 교정 웰니스 브랜드입니다. 언어유희 그래픽을 적용한 일상 소품으로 회피 메커니즘의 직관적 이해와 자기수용을 돕습니다. 경고성 메시지와 의도적 불편함을 담은 시각적 장치를 반복 노출하여, 이용자가 회피 상황을 자각하고 스스로 본래 자리로 돌아오도록 유도합니다.`, descEn: `H ppiness is an emotional wellness brand helping avoidant individuals return to routine. Featuring wordplay graphics on daily items, it promotes self-acceptance and a clear grasp of avoidance mechanisms. By repeating visual devices with warnings and intentional discomfort, it encourages users to acknowledge triggers and voluntarily return.`, thumb: 'images/works/kim-nagyeom-thumb.jpg', images: [] },
  { id: '꼬마 마녀 릴리의 용기', category: 'story',  designer: '김영혜', title: '꼬마 마녀 릴리의 용기', titleEn: 'The Courage of Little Witch Lily', desc: '「꼬마 마녀 릴리의 용기」는 겁이 많은 꼬마 마녀 릴리가 마을의 마법을 되찾기 위해 무지개 골짜기로 떠나는 여정을 담은 동화 책이다. 거센 바람과 어두운 동굴 속 두려움을 마주한 릴리는 끝내 한 걸음씩 앞으로 나아가며 작은 성장을 이룬다. 이 작품 은 용기란 두려움이 없는 것이 아니라, 두려움 속에서도 스스로 를 믿고 나아가는 마음임을 따뜻하게 전하고자 하였다.', descEn: 'The Courage of Little Witch Lily follows Lily, a timid little witch who sets out for Rainbow Valley to bring magic back to her village. Facing fierce winds and a dark cave ahead, Lily keeps moving forward, one small step at a time. The story gently shows that courage is not the absence of fear, but trusting yourself enough to move ahead despite it.', thumb: '', images: [] },
  { id: '인플룹', category: 'comm',  designer: '이한비', title: '인플룹',titleEn: '인플룹', desc: '‘인플룹’은 인플루언서 생태계의 정보 부족과 네트워크의 한계를 해결하기 위한 비즈니스 커뮤니티 플랫폼입니다. 채널 인증을 기반으로 신뢰할 수 있는 정보를 공유하고, 네트워킹부터 브랜드 캠페인, 전문가 정보까지 한곳에서 탐색할 수 있습니다. 비슷한 경험과 고민을 가진 동료와 연결되고, 서로의 정보와 기회를 공유하며 함께 성장할 수 있는 공간을 제공합니다.', descEn: '‘infloop’ is a business community platform built to address the information and networking challenges faced by influencers. Verified channels create a trusted space to exchange insights, connect with peers, and discover brand campaigns and expert resources. Infloup helps influencers communicate, find new opportunities, and grow together.', thumb: '', images: [] },
  { id: '하늘을 날고싶은 오리, 리오', category: 'story',  designer: '이미경', title: '하늘을 날고싶은 오리, 리오', titleEn: 'Rio, Until I Touch the Sky', desc: '하늘을 날고 싶은 작은 오리, 리오의 꿈과 도전을 담은 동화책이다. 여러 번의 시행착오와 실패 속에서도 포기하지 않고 자신만의 방법을 찾아가는 리오의 모습을 통해, 서툴더라도 꿈을 향해 나아가는 과정의 소중함을 이야기한다.', descEn: 'This picture book tells the story of little Rio, a duck who dreams of flying and takes on a challenge. Through Rio’s perseverance in finding her own path despite countless trials and failures, the story conveys the value of pursuing one’s dreams, even on a difficult road.', thumb: '', images: [] },
  { id: 'w5', category: 'comm',  designer: 'd3', title: '작품명 5', desc: '작품설명작품설명작품설명', descEn: 'English description', thumb: '', images: [] },
  { id: 'w6', category: 'comm',  designer: 'd2', title: '작품명 6', desc: '작품설명작품설명작품설명', descEn: 'English description', thumb: '', images: [] },
  { id: 'w7', category: 'story', designer: 'd1', title: '작품명 7', desc: '작품설명작품설명작품설명', descEn: 'English description', thumb: '', images: [] },
  { id: 'w8', category: 'video', designer: 'd3', title: '작품명 8', desc: '작품설명작품설명작품설명', descEn: 'English description', thumb: '', images: [] },
];

const CATEGORY_NAMES = {
  comm: '커뮤니케이션디자인',
  story: '스토리텔링일러스트디자인',
  video: '영상콘텐츠디자인',
};
