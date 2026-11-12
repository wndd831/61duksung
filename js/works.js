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
  { id: '이미경', name: '이미경', nameEn: 'Lee Mi Kyoung', email: 'imk0279@gmail.com', phone: 'Insta @or___i_', photo: 'images/profile/lee-mikyung.jpg' },
  { id: '김수아', name: '김수아', nameEn: 'Kim Sua', email: 'suakim.design@gmail.com' },
  { id: '차서연', name: '차서연', nameEn: 'Cha Seoyeon', email: 'cktjdus03@naver.com', phone: '010-3141-8608', photo: 'images/profile/cha-seoyeon.jpg' },
];

const WORKS = [
  { id: '회피니스', category: 'comm',  designer: '김나겸', title: '회피니스', titleEn: 'H回PPINESS', desc: `‘회피니스(H回ppiness)’는 회피성향 현대인의 일상 복귀를 돕는 행동·정서 교정 웰니스 브랜드입니다. 언어유희 그래픽을 적용한 일상 소품으로 회피 메커니즘의 직관적 이해와 자기수용을 돕습니다. 경고성 메시지와 의도적 불편함을 담은 시각적 장치를 반복 노출하여, 이용자가 회피 상황을 자각하고 스스로 본래 자리로 돌아오도록 유도합니다.`, descEn: `H ppiness is an emotional wellness brand helping avoidant individuals return to routine. Featuring wordplay graphics on daily items, it promotes self-acceptance and a clear grasp of avoidance mechanisms. By repeating visual devices with warnings and intentional discomfort, it encourages users to acknowledge triggers and voluntarily return.`, thumb: 'images/works/kim-nagyeom-thumb.jpg', images: ['images/works/kim-nagyeom-1.jpg', 'images/works/kim-nagyeom-2.jpg', 'images/works/kim-nagyeom-3.jpg',] },
  { id: '꼬마 마녀 릴리의 용기', category: 'story',  designer: '김영혜', title: '꼬마 마녀 릴리의 용기', titleEn: 'The Courage of Little Witch Lily', desc: '「꼬마 마녀 릴리의 용기」는 겁이 많은 꼬마 마녀 릴리가 마을의 마법을 되찾기 위해 무지개 골짜기로 떠나는 여정을 담은 동화 책이다. 거센 바람과 어두운 동굴 속 두려움을 마주한 릴리는 끝내 한 걸음씩 앞으로 나아가며 작은 성장을 이룬다. 이 작품 은 용기란 두려움이 없는 것이 아니라, 두려움 속에서도 스스로 를 믿고 나아가는 마음임을 따뜻하게 전하고자 하였다.', descEn: 'The Courage of Little Witch Lily follows Lily, a timid little witch who sets out for Rainbow Valley to bring magic back to her village. Facing fierce winds and a dark cave ahead, Lily keeps moving forward, one small step at a time. The story gently shows that courage is not the absence of fear, but trusting yourself enough to move ahead despite it.', thumb: 'images/works/kim-younghye-thumb.jpg', images: ['images/works/kim-younghye-1.jpg'] },
  { id: '인플룹', category: 'comm',  designer: '이한비', title: '인플룹',titleEn: 'infloop', desc: '‘인플룹’은 인플루언서 생태계의 정보 부족과 네트워크의 한계를 해결하기 위한 비즈니스 커뮤니티 플랫폼입니다. 채널 인증을 기반으로 신뢰할 수 있는 정보를 공유하고, 네트워킹부터 브랜드 캠페인, 전문가 정보까지 한곳에서 탐색할 수 있습니다. 비슷한 경험과 고민을 가진 동료와 연결되고, 서로의 정보와 기회를 공유하며 함께 성장할 수 있는 공간을 제공합니다.', descEn: '‘infloop’ is a business community platform built to address the information and networking challenges faced by influencers. Verified channels create a trusted space to exchange insights, connect with peers, and discover brand campaigns and expert resources. Infloup helps influencers communicate, find new opportunities, and grow together.', thumb: 'images/works/lee-hanbi-thumb.jpg', images: ['images/works/lee-hanbi-1.jpg', 'images/works/lee-hanbi-2.jpg', 'images/works/lee-hanbi-3.jpg'] },
  { id: '하늘을 날고싶은 오리, 리오', category: 'story',  designer: '이미경', title: '하늘을 날고싶은 오리, 리오', titleEn: 'Rio, Until I Touch the Sky', desc: '하늘을 날고 싶은 작은 오리, 리오의 꿈과 도전을 담은 동화책이다. 여러 번의 시행착오와 실패 속에서도 포기하지 않고 자신만의 방법을 찾아가는 리오의 모습을 통해, 서툴더라도 꿈을 향해 나아가는 과정의 소중함을 이야기한다.', descEn: 'This picture book tells the story of little Rio, a duck who dreams of flying and takes on a challenge. Through Rio’s perseverance in finding her own path despite countless trials and failures, the story conveys the value of pursuing one’s dreams, even on a difficult road.', thumb: 'images/works/lee-mikyoung-thumb.png', images: ['images/works/lee-mikyoung-1.jpg'] },
  { id: '한;코 니팅클럽', category: 'comm',  designer: '김수아', title: '한;코 니팅클럽', titleEn: 'HAN;CO Knitting Club', desc: '뜨개질의 한 코가 모여 큰 가치를 만든다는 의미의 ‘한;코 니팅 클럽’은 수공예의 사회적 가치에서 영감을 받은 브랜딩 프로젝트다. 편물의 특성에 기반한 그래픽 시스템을 디자인해 뜨개질의 느림의 미학과 연대, 연결, 소통의 가치를 현대적인 시각 언어로 풀어냈으며, 이를 활용한 뜨개 키트와 니팅 클럽 회원 컨셉의 굿즈로 브랜드를 확장했다.', descEn: 'Han;ko Knitting Club, reflecting how single stitches gather to create great value, is a branding project inspired by the social value of handcraft. Through a graphic system based on knitted fabric, it translates the values of slowness, solidarity, and connection into a modern visual language. This identity expands into the brand through knitting kits and club-themed goods.', thumb: 'images/works/kim-sua-thumb.jpg', images: ['images/works/kim-sua-1.jpg','images/works/kim-sua-2.jpg'] },
  { id: 'ETHER', category: 'comm',  designer: '차서연', title: 'ETHER', titleEn: '이와이 슌지 감독전', desc: '《이와이 슌지 감독전 : ETHER》는 이와이 슌지 감독의 주요 작품 6편으로 구성된 특별 상영 기획전이다. 흔히 ‘이와이 월드’라 불리는 그의 영화 세계는 어둡고 무거운 ‘블랙 이와이’와 밝고 따뜻한 ‘화이트 이와이’로 나뉘어 불려 왔다. 이번 기획전은 그 이분법을 출발점으로 삼아, 팬의 시선에서 두 세계를 관통하는 하나의 키워드 ‘에테르’를 포착한다.명', descEn: '《Director Iwai Shunji Retrospective: ETHER》 is a special screening program of six major works. His cinematic world, often called the “Iwai World,” has long been divided into the dark “Black Iwai” and the bright “White Iwai.” The program focuses on a single keyword, ‘Ether,’ that bridges both worlds through a fan’s perspective.', thumb: 'images/works/cha-seoyeon-thumb.jpg', images: ['images/works/cha-seoyeon-1.jpg', 'images/works/cha-seoyeon-2.jpg', 'images/works/cha-seoyeon-3.jpg', 'images/works/cha-seoyeon-4.jpg'] },
  { id: '허드', category: 'video', designer: '차서연', title: '허드', titleEn: 'HEARD', desc: '미스터리 드라마 장르의 단편 애니메이션 영화 〈허드〉의 트레 일러 영상이다. 남의 이어폰 소리를 훔쳐 듣는 능력을 가진 주인공. 어느 날 우연히 엿들은 소리 하나로, 인기 가수 엘레나와 그녀 곁을 맴도는 의문의 남자를 둘러싼 비밀에 얽혀든다.', descEn: 'Trailer for 〈Heard〉, a mystery drama short animated film. The protagonist can secretly listen to sounds through other people’s earphones. One day, a sound he overhears by chance draws him into a mystery involving pop star ‘Elena’ and a mysterious man who keeps appearing around her.', thumb: 'cha-seoyeon-video-thumb.jpg', images: ['cha-seoyeon-video-1.jpg', 'cha-seoyeon-video-2.jpg', 'cha-seoyeon-video-3.jpg',] },
  { id: 'w8', category: 'video', designer: 'd3', title: '작품명 8', desc: '작품설명작품설명작품설명', descEn: 'English description', thumb: '', images: [] },
];

const CATEGORY_NAMES = {
  comm: '커뮤니케이션디자인',
  story: '스토리텔링일러스트디자인',
  video: '영상콘텐츠디자인',
};
