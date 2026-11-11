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
       designer : 위 DESIGNERS의 id  → 같은 id 작품이 2개면 상세페이지에 '다른 프로젝트'로 뜸
       thumb    : 썸네일 이미지 경로 (없으면 회색 칸)
       images   : 상세페이지 이미지 경로들 (없으면 회색 칸 3개)
   ========================================================= */

const DESIGNERS = [
  { id: 'd1', name: '김나겸', nameEn: 'Kim Nagyeom', email: 'nagyeom9704@gmail.com', phone: '010-9754-2282', photo: '' },
  { id: 'd2', name: '김덕성', nameEn: 'Kim Duksung', email: '', phone: '', photo: '' },
  { id: 'd3', name: '이시디', nameEn: 'Lee Sidi', email: '', phone: '', photo: '' },
];

const WORKS = [
  { id: 'w1', category: 'comm',  designer: 'd1', title: '회피니스', desc: '작품설명작품설명작품설명작품설명작품설명작품설명', descEn: 'English description English description', thumb: '김나겸_회피니스_섬네일 - 김나겸.jpg', images: [] },
  { id: 'w2', category: 'comm',  designer: 'd2', title: '작품명 2', desc: '작품설명작품설명작품설명', descEn: 'English description', thumb: '', images: [] },
  { id: 'w3', category: 'comm',  designer: 'd3', title: '작품명 3', desc: '작품설명작품설명작품설명', descEn: 'English description', thumb: '', images: [] },
  { id: 'w4', category: 'comm',  designer: 'd2', title: '작품명 4', desc: '작품설명작품설명작품설명', descEn: 'English description', thumb: '', images: [] },
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
