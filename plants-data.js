/* 식물 도우미 정보 (인터넷 없이 앱 안에 들어 있는 정보)
 * 일반적인 실내식물 관리 상식을 정리한 것이라, 전문가 진단을 대신하지는 않는다.
 *
 * PLANT_INFO 한 칸 설명
 *   id        : 종류 이름표 (바꾸지 않는다 — 저장된 식물이 이 값을 쓴다)
 *   name      : 화면에 보이는 이름
 *   alias     : 식물 이름에 이 말이 들어 있으면 이 종류로 알아본다 (띄어쓰기 무시)
 *   water     : 물 주기 설명 / waterDays: 대략 며칠마다 (2번 기능용)
 *   light     : 햇빛 설명 / lightLevel: 1 그늘에도 괜찮음 · 2 밝은 간접광 · 3 햇빛 듬뿍 (3번 기능용)
 *   temp, humidity, tip : 온도 · 습도 · 키우기 팁
 *   pet       : true 반려동물이 먹으면 해로움 / false 비교적 안전 / null 종류마다 다름
 *   special   : 증상별로 이 식물에 꼭 맞는 한마디 { 증상id: '한마디' }
 * ※ 이름이 여러 종류에 걸리면 가장 길게 맞는 이름을 고른다 (예: '떡갈잎고무나무'는 '고무나무'보다 '떡갈잎'이 길게 맞음)
 */
const PLANT_INFO = [
  {
    id: 'hongkong', name: '홍콩야자', emoji: '🌳', alias: ['홍콩야자', '쉐플레라', '셰플레라', '홍콩'],
    water: '겉흙 2~3cm가 마르면 흠뻑 (봄·여름 주 1번, 겨울 10~14일)', waterDays: 7,
    light: '밝은 간접광이 좋아요. 그늘에서도 버티지만 잎이 잘 떨어져요', lightLevel: 2,
    temp: '15~25℃ (10℃ 아래는 피해요)', humidity: '보통', pet: true,
    tip: '튼튼해서 초보에게 좋아요. 키가 너무 크면 줄기를 잘라 주면 옆으로 풍성해져요.',
    special: { drop: '홍콩야자는 빛이 부족하거나 자리를 옮기면 잎을 잘 떨궈요. 밝은 곳에 자리를 정해 주고 그대로 두세요.' }
  },
  {
    id: 'monstera', name: '몬스테라', emoji: '🌿', alias: ['몬스테라', 'monstera'],
    water: '겉흙 2~3cm가 마르면 흠뻑 (봄·여름 주 1번, 겨울 2주에 1번 정도)', waterDays: 7,
    light: '밝은 간접광. 한낮 직사광선은 잎이 탈 수 있어요', lightLevel: 2,
    temp: '18~27℃ (10℃ 아래는 피해요)', humidity: '보통~높게', pet: true,
    tip: '새잎이 갈라지지 않고 작게 나오면 빛이 부족한 거예요. 공중뿌리는 흙에 묻어 주거나 그냥 둬도 돼요.',
    special: { slow: '몬스테라는 빛이 부족하면 잎이 갈라지지 않고 작아져요. 더 밝은 창가로 옮겨 주세요.' }
  },
  {
    id: 'stuckyi', name: '스투키', emoji: '🪴', alias: ['스투키'],
    water: '흙이 완전히 마르면 (봄·여름 3~4주, 겨울 1~2달에 1번)', waterDays: 28,
    light: '밝은 곳이 좋지만 그늘에서도 잘 버텨요', lightLevel: 1,
    temp: '15~30℃ (10℃ 아래는 피해요)', humidity: '건조해도 괜찮아요', pet: true,
    tip: '물을 자주 주는 게 가장 큰 적이에요. 잊어버릴 만할 때 주면 딱 좋아요.',
    special: { mushy: '스투키가 물러지는 건 대부분 물을 너무 자주 줘서예요. 무른 줄기는 잘라 내고 흙을 바싹 말려 주세요.', yellow: '스투키 잎이 노랗게 물렁해지면 과습이에요. 물 주기를 확 줄여 주세요.' }
  },
  {
    id: 'sansevieria', name: '산세베리아', emoji: '🪴', alias: ['산세베리아', '산세비에리아', '산세베', '스네이크플랜트'],
    water: '흙이 완전히 마르면 (봄·여름 2~3주, 겨울 한 달에 1번)', waterDays: 21,
    light: '밝은 곳이 좋지만 그늘에서도 잘 버텨요', lightLevel: 1,
    temp: '15~30℃ (10℃ 아래는 피해요)', humidity: '건조해도 괜찮아요', pet: true,
    tip: '물은 잎 사이 가운데 말고 흙에 주세요. 잎 사이에 물이 고이면 썩을 수 있어요.',
    special: { mushy: '산세베리아가 물러지는 건 대부분 과습이에요. 무른 잎은 잘라 내고 흙을 바싹 말려 주세요.', yellow: '산세베리아 잎이 노랗게 물렁해지면 과습이에요. 물 주기를 확 줄여 주세요.' }
  },
  {
    id: 'cactus', name: '선인장', emoji: '🌵', alias: ['선인장', '백년초', '금호', '바니카스', '귀면각', '백도선', '비모란'],
    water: '흙이 완전히 마르면 (봄·여름 2~3주, 겨울은 거의 안 줘도 돼요)', waterDays: 21,
    light: '햇빛을 듬뿍 좋아해요. 가장 밝은 창가에', lightLevel: 3,
    temp: '봄~가을 따뜻하게, 겨울 5~10℃에서 쉬게 해도 괜찮아요', humidity: '건조하게', pet: false,
    tip: '겨울에는 물을 거의 끊고 서늘하게 두면 봄에 꽃을 피우기도 해요. 가시에 다치지 않게 조심하세요.',
    special: { mushy: '선인장이 아래부터 물러지면 과습이에요. 화분에서 꺼내 무른 부분을 도려내고 며칠 말린 뒤 마른 흙에 다시 심어요.', leggy: '선인장이 위로 가늘게 자라면 햇빛이 부족한 거예요. 가장 밝은 곳으로 천천히 옮겨 주세요.' }
  },
  {
    id: 'succulent', name: '다육식물 (일반)', emoji: '🌸', alias: ['다육', '다육이', '다육식물'],
    water: '잎이 살짝 쭈글해지거나 흙이 완전히 마르면 (봄·가을 1~2주, 여름·겨울은 줄여요)', waterDays: 14,
    light: '햇빛을 많이 좋아해요. 밝은 창가나 베란다', lightLevel: 3,
    temp: '10~25℃. 한여름 더위와 장마철 습기에 약해요', humidity: '건조하게', pet: null,
    tip: '바람이 잘 통해야 해요. 잎에 물이 고이지 않게 흙에 주세요.',
    special: { leggy: '다육이 줄기가 길게 늘어나고 잎 사이가 벌어지면 빛이 부족해요. 더 밝은 곳으로! 웃자란 부분은 잘라서 다시 심을 수 있어요.', mushy: '다육 잎이 투명하게 물러지면 과습이에요. 무른 잎은 떼어 내고 흙을 말려 주세요.' }
  },
  {
    id: 'pothos', name: '스킨답서스', emoji: '🍃', alias: ['스킨답서스', '스킨', '포토스', '형광스킨', '마블스킨', '마블퀸', '엔조이'],
    water: '겉흙이 마르면 흠뻑 (봄·여름 주 1번, 겨울 10~14일)', waterDays: 7,
    light: '밝은 간접광. 그늘에서도 잘 자라요', lightLevel: 1,
    temp: '18~27℃', humidity: '보통', pet: true,
    tip: '목마르면 잎이 축 처져서 알려 줘요. 줄기를 잘라 물에 꽂아 두면 뿌리가 나와요.',
    special: { droop: '스킨답서스는 목마르면 금방 축 처져요. 흙이 말랐다면 흠뻑 주세요. 금방 살아나요.' }
  },
  {
    id: 'fiddle', name: '떡갈잎고무나무', emoji: '🌳', alias: ['떡갈잎', '떡갈고무', '피카스리라타', '리라타'],
    water: '겉흙 3~4cm가 마르면 흠뻑 (봄·여름 주 1번, 겨울 2주)', waterDays: 8,
    light: '아주 밝은 간접광. 해가 잘 드는 창가', lightLevel: 3,
    temp: '18~27℃ (찬바람 싫어해요)', humidity: '보통', pet: true,
    tip: '자리를 옮기는 걸 싫어해요. 한 자리에 두고, 잎에 먼지가 쌓이면 젖은 천으로 닦아 주세요.',
    special: { drop: '떡갈잎고무나무는 자리 이동, 찬바람에 아주 예민해요. 자리를 고정하고 창문 틈 바람을 막아 주세요.', spots: '떡갈잎고무나무 잎에 갈색 반점이 생기면 과습인 경우가 많아요. 흙이 충분히 마른 뒤에 물을 주세요.' }
  },
  {
    id: 'rubber', name: '고무나무', emoji: '🌳', alias: ['고무나무', '인도고무', '엘라스티카', '수채화고무', '피쿠스', '휘카스'],
    water: '겉흙 2~3cm가 마르면 흠뻑 (봄·여름 주 1번, 겨울 2주)', waterDays: 8,
    light: '밝은 간접광', lightLevel: 2,
    temp: '16~27℃', humidity: '보통', pet: true,
    tip: '두꺼운 잎에 먼지가 쌓이면 젖은 천으로 닦아 주세요. 반짝이고 숨도 잘 쉬어요.',
    special: { drop: '고무나무는 자리를 옮기거나 추우면 잎을 떨궈요. 따뜻하고 밝은 곳에 자리를 정해 주세요.' }
  },
  {
    id: 'zz', name: '금전수', emoji: '💰', alias: ['금전수', '돈나무', '자미오쿨카스', '금전초'],
    water: '흙이 완전히 마르면 (봄·여름 2~3주, 겨울 한 달)', waterDays: 18,
    light: '밝은 간접광. 그늘에서도 잘 버텨요', lightLevel: 1,
    temp: '18~27℃ (10℃ 아래는 피해요)', humidity: '건조해도 괜찮아요', pet: true,
    tip: '흙 속 감자 같은 뿌리에 물을 저장해요. 물을 자주 주면 썩어요.',
    special: { yellow: '금전수 잎이 노래지면 대부분 과습이에요. 흙을 완전히 말려 주세요.', mushy: '금전수 줄기 밑동이 물러지면 과습이에요. 화분에서 빼서 무른 뿌리를 정리하고 마른 흙에 심어요.' }
  },
  {
    id: 'dracaena', name: '행운목', emoji: '🎋', alias: ['행운목', '드라세나', '프라그란스', '와네키'],
    water: '겉흙 2~3cm가 마르면 (봄·여름 주 1번, 겨울 2주)', waterDays: 9,
    light: '밝은 간접광', lightLevel: 2,
    temp: '18~27℃', humidity: '보통~높게', pet: true,
    tip: '잎끝이 잘 마르는 편이에요. 받아서 하루 둔 물을 주고, 가끔 분무해 주세요.',
    special: { tips: '행운목은 수돗물 성분과 건조한 공기에 잎끝이 잘 타요. 받아서 하루 둔 물을 주고 분무해 주세요. 마른 끝은 가위로 다듬어도 돼요.' }
  },
  {
    id: 'luckybamboo', name: '개운죽', emoji: '🎍', alias: ['개운죽', '럭키대나무', '부귀죽'],
    water: '물꽂이라면 3~7일마다 물 갈기. 흙이라면 겉흙이 마르면', waterDays: 5,
    light: '밝은 간접광. 직사광선은 피해요', lightLevel: 2,
    temp: '18~30℃', humidity: '보통', pet: true,
    tip: '물꽂이 물은 받아서 하루 둔 물로 자주 갈아 주세요. 병도 가끔 씻어 주세요.',
    special: { yellow: '개운죽이 노래지면 물이 오래됐거나 햇빛이 너무 강한 경우가 많아요. 물을 갈고 그늘진 밝은 곳으로 옮겨요.' }
  },
  {
    id: 'tablepalm', name: '테이블야자', emoji: '🌴', alias: ['테이블야자', '테이블'],
    water: '겉흙이 마르면 흠뻑 (봄·여름 주 1~2번)', waterDays: 6,
    light: '밝은 간접광. 그늘에서도 괜찮아요', lightLevel: 1,
    temp: '18~27℃', humidity: '높게 (분무 좋아해요)', pet: false,
    tip: '건조하면 잎끝이 갈색으로 마르고 응애가 생기기 쉬워요. 자주 분무해 주세요.',
    special: { tips: '테이블야자는 건조하면 잎끝이 금방 말라요. 분무를 자주 하고 가습기 근처에 두면 좋아요.' }
  },
  {
    id: 'areca', name: '아레카야자', emoji: '🌴', alias: ['아레카', '아레카야자', '야자나무'],
    water: '겉흙이 마르면 흠뻑 (봄·여름 주 1~2번)', waterDays: 6,
    light: '밝은 간접광', lightLevel: 2,
    temp: '18~27℃', humidity: '높게', pet: false,
    tip: '잎이 넓게 퍼지니 여유 있는 자리에 두세요. 건조하면 응애가 잘 생겨요.',
    special: { tips: '아레카야자는 건조한 공기에 잎끝이 잘 말라요. 분무하고 에어컨·히터 바람을 피해 주세요.' }
  },
  {
    id: 'spathiphyllum', name: '스파티필름', emoji: '🤍', alias: ['스파티필름', '스파트필름', '스파티', '평화백합'],
    water: '겉흙이 마르면 흠뻑 (봄·여름 주 1~2번)', waterDays: 5,
    light: '밝은 간접광. 그늘에서도 자라지만 꽃은 덜 펴요', lightLevel: 1,
    temp: '18~27℃', humidity: '높게', pet: true,
    tip: '목마르면 잎이 축 처져서 바로 알려 줘요. 물을 주면 몇 시간 안에 다시 일어나요.',
    special: { droop: '스파티필름은 목마르면 잎을 확 늘어뜨려요. 흙이 말랐다면 흠뻑 주세요. 몇 시간 뒤면 다시 일어나요.' }
  },
  {
    id: 'anthurium', name: '안스리움', emoji: '❤️', alias: ['안스리움', '안수리움', '홍학꽃'],
    water: '겉흙이 마르면 흠뻑 (봄·여름 주 1번)', waterDays: 7,
    light: '밝은 간접광. 빛이 부족하면 꽃이 안 펴요', lightLevel: 2,
    temp: '18~27℃', humidity: '높게', pet: true,
    tip: '빨간 부분은 꽃잎이 아니라 꽃을 감싸는 잎이에요. 밝은 곳에서 오래 즐길 수 있어요.',
    special: {}
  },
  {
    id: 'calathea', name: '칼라데아', emoji: '🎨', alias: ['칼라데아', '칼라테아', '오르비폴리아', '진저칼라데아'],
    water: '겉흙이 살짝 마르면 (흙이 늘 촉촉한 정도, 바싹 마르면 안 돼요)', waterDays: 5,
    light: '밝은 간접광. 직사광선은 잎이 타요', lightLevel: 2,
    temp: '18~27℃', humidity: '높게 (가장 중요해요)', pet: false,
    tip: '밤이 되면 잎을 위로 접어요. 잠자는 거니까 걱정 마세요!',
    special: { curl: '칼라데아는 공기가 건조하거나 목마르면 잎을 돌돌 말아요. 분무하고 가습기 근처에 두세요.', tips: '칼라데아는 습도에 아주 예민해요. 잎끝이 마르면 분무를 자주 하고, 받아서 하루 둔 물을 주세요.' }
  },
  {
    id: 'alocasia', name: '알로카시아', emoji: '🐘', alias: ['알로카시아', '오도라', '쿠쿨라타'],
    water: '겉흙 2~3cm가 마르면 (봄·여름 주 1번, 겨울은 줄여요)', waterDays: 7,
    light: '밝은 간접광', lightLevel: 2,
    temp: '18~28℃ (추위에 약해요)', humidity: '높게', pet: true,
    tip: '새잎이 나면 오래된 잎 하나가 지는 건 자연스러워요. 겨울엔 쉬면서 잎이 줄 수 있어요.',
    special: { yellow: '알로카시아는 새잎이 나올 때 가장 오래된 잎을 노랗게 떨구기도 해요. 한 장씩이면 자연스러운 거예요.' }
  },
  {
    id: 'philodendron', name: '필로덴드론', emoji: '💚', alias: ['필로덴드론', '콩고', '오렌지프린스', '헤데라세움', '브라질필로', '레몬라임'],
    water: '겉흙 2~3cm가 마르면 흠뻑', waterDays: 7,
    light: '밝은 간접광', lightLevel: 2,
    temp: '18~27℃', humidity: '보통~높게', pet: true,
    tip: '몬스테라처럼 튼튼한 편이에요. 덩굴형은 지지대를 세워 주면 잎이 커져요.',
    special: {}
  },
  {
    id: 'dieffenbachia', name: '디펜바키아', emoji: '🌱', alias: ['디펜바키아', '디펜'],
    water: '겉흙이 마르면 흠뻑', waterDays: 7,
    light: '밝은 간접광', lightLevel: 2,
    temp: '18~27℃', humidity: '보통~높게', pet: true,
    tip: '즙이 피부에 닿으면 따가울 수 있어요. 자를 때는 장갑을 끼세요.',
    special: {}
  },
  {
    id: 'pilea', name: '필레아', emoji: '🪙', alias: ['필레아', '페페로미오이데스', '동전풀'],
    water: '겉흙 2cm가 마르면 흠뻑', waterDays: 7,
    light: '밝은 간접광. 한쪽으로만 자라면 화분을 가끔 돌려 주세요', lightLevel: 2,
    temp: '15~25℃', humidity: '보통', pet: false,
    tip: '옆에서 새끼 포기가 잘 나와요. 떼어서 따로 심을 수 있어요.',
    special: {}
  },
  {
    id: 'peperomia', name: '페페로미아', emoji: '🟢', alias: ['페페로미아', '페페', '수박페페', '청페페'],
    water: '흙이 거의 마르면 (잎이 두꺼워서 물을 저장해요)', waterDays: 10,
    light: '밝은 간접광', lightLevel: 2,
    temp: '18~27℃', humidity: '보통', pet: false,
    tip: '작고 귀여워서 책상에 두기 좋아요. 물을 자주 주면 줄기가 물러요.',
    special: { mushy: '페페로미아 줄기가 물러지면 과습이에요. 흙을 충분히 말려 주세요.' }
  },
  {
    id: 'hoya', name: '호야', emoji: '⭐', alias: ['호야', '하트호야', '카르노사'],
    water: '흙이 거의 마르면 (잎이 두꺼워서 물을 저장해요)', waterDays: 12,
    light: '밝은 곳. 빛이 충분해야 별 모양 꽃이 펴요', lightLevel: 3,
    temp: '16~27℃', humidity: '보통', pet: false,
    tip: '꽃이 진 꽃자루는 자르지 마세요. 그 자리에서 다시 꽃이 펴요.',
    special: {}
  },
  {
    id: 'ivy', name: '아이비', emoji: '🍀', alias: ['아이비', '헤데라', '잉글리쉬아이비'],
    water: '겉흙이 마르면 흠뻑', waterDays: 6,
    light: '밝은 간접광', lightLevel: 2,
    temp: '10~22℃ (더위에 약해요)', humidity: '보통~높게', pet: true,
    tip: '서늘한 곳을 좋아해요. 여름엔 바람 잘 통하는 곳에 두세요. 응애가 잘 생기니 잎 뒷면을 가끔 보세요.',
    special: {}
  },
  {
    id: 'tillandsia', name: '틸란드시아', emoji: '🌬️', alias: ['틸란드시아', '틸란', '에어플랜트', '수염틸란', '이오난사'],
    water: '1~2주에 한 번 물에 30분~1시간 담갔다가 거꾸로 털어 말려요', waterDays: 10,
    light: '밝은 간접광', lightLevel: 2,
    temp: '15~30℃', humidity: '보통~높게', pet: false,
    tip: '흙이 필요 없어요. 물에 담근 뒤 완전히 말리지 않으면 가운데가 썩을 수 있어요.',
    special: { mushy: '틸란드시아 가운데가 검게 무르면 물이 고여서예요. 물을 준 뒤에는 꼭 거꾸로 털어서 4시간 안에 마르게 해 주세요.' }
  },
  {
    id: 'aloe', name: '알로에', emoji: '🌵', alias: ['알로에'],
    water: '흙이 완전히 마르면 (봄·여름 2~3주)', waterDays: 18,
    light: '햇빛을 좋아해요. 밝은 창가', lightLevel: 3,
    temp: '15~27℃ (겨울 5℃ 아래는 피해요)', humidity: '건조하게', pet: true,
    tip: '다육식물처럼 물을 아껴 주세요. 빛이 부족하면 잎이 옆으로 축 늘어져요.',
    special: { droop: '알로에 잎이 옆으로 눕는 건 빛이 부족해서인 경우가 많아요. 더 밝은 곳으로 옮겨 주세요.' }
  },
  {
    id: 'birdofparadise', name: '극락조화', emoji: '🦜', alias: ['극락조', '극락조화', '스트렐리치아'],
    water: '겉흙 2~3cm가 마르면 흠뻑 (봄·여름 주 1번)', waterDays: 7,
    light: '아주 밝은 곳. 햇빛을 좋아해요', lightLevel: 3,
    temp: '18~27℃', humidity: '보통', pet: true,
    tip: '잎이 바람에 찢어지는 건 자연스러운 모습이에요. 큰 잎은 젖은 천으로 닦아 주세요.',
    special: {}
  },
  {
    id: 'olive', name: '올리브나무', emoji: '🫒', alias: ['올리브'],
    water: '겉흙이 충분히 마르면 흠뻑 (봄·여름 주 1번)', waterDays: 8,
    light: '햇빛을 아주 좋아해요. 가장 밝은 창가나 베란다', lightLevel: 3,
    temp: '봄~가을 따뜻하게, 겨울은 서늘하게(5~10℃)', humidity: '건조해도 괜찮아요', pet: false,
    tip: '실내 빛이 부족하면 잎이 잘 떨어져요. 바람이 잘 통하는 밝은 곳이 좋아요.',
    special: { drop: '올리브나무는 빛이 부족하면 잎을 떨궈요. 가장 밝은 곳으로 옮겨 주세요.' }
  },
  {
    id: 'goldcrest', name: '율마', emoji: '🌲', alias: ['율마', '골드크레스트'],
    water: '겉흙이 마르기 시작하면 바로 흠뻑 (바싹 마르면 잎이 갈색으로 변해요)', waterDays: 4,
    light: '햇빛을 아주 좋아해요', lightLevel: 3,
    temp: '10~25℃', humidity: '보통', pet: null,
    tip: '물이 부족하거나 바람이 안 통하면 속부터 갈색이 돼요. 베란다처럼 밝고 바람 통하는 곳이 좋아요.',
    special: { tips: '율마가 갈색으로 마르면 물이 부족하거나 통풍이 안 되는 경우예요. 흙이 마르기 전에 물을 주고 바람이 통하게 해 주세요. 갈색이 된 부분은 다시 초록으로 돌아오지 않아요.' }
  },
  {
    id: 'rosemary', name: '로즈마리', emoji: '🌿', alias: ['로즈마리', '로즈메리'],
    water: '겉흙이 마르면 흠뻑 (바싹 말리면 안 돼요)', waterDays: 5,
    light: '햇빛을 아주 좋아해요. 하루 4시간 이상', lightLevel: 3,
    temp: '10~25℃', humidity: '건조하게, 통풍 중요', pet: false,
    tip: '바람이 잘 통해야 해요. 실내에만 두면 약해지기 쉬우니 창문을 자주 열어 주세요.',
    special: {}
  },
  {
    id: 'basil', name: '바질', emoji: '🌱', alias: ['바질'],
    water: '겉흙이 마르면 흠뻑 (여름엔 거의 매일)', waterDays: 2,
    light: '햇빛을 아주 좋아해요', lightLevel: 3,
    temp: '20~30℃ (추위에 아주 약해요)', humidity: '보통', pet: false,
    tip: '꽃대가 올라오면 잘라 주세요. 잎을 위에서부터 따 주면 옆으로 풍성해져요.',
    special: {}
  },
  /* ===== 관엽식물 ===== */
  {
    id: 'adansonii', name: '몬스테라 아단소니', emoji: '🕳️', alias: ['아단소니', '오블리쿠아', '구멍몬스테라'],
    water: '겉흙 2cm가 마르면 흠뻑 (봄·여름 주 1번)', waterDays: 6,
    light: '밝은 간접광', lightLevel: 2, temp: '18~27℃', humidity: '보통~높게', pet: true,
    tip: '잎에 구멍이 송송 난 덩굴형 몬스테라예요. 걸이 화분이나 지지대에 올려 키우면 예뻐요.', special: {}
  },
  {
    id: 'selloum', name: '셀로움', emoji: '🌿', alias: ['셀로움', '셀렘', '타우마토필룸'],
    water: '겉흙 2~3cm가 마르면 흠뻑', waterDays: 7,
    light: '밝은 간접광', lightLevel: 2, temp: '15~27℃', humidity: '보통', pet: true,
    tip: '잎이 깊게 갈라지고 크게 퍼져요. 자리를 넉넉하게 잡아 주세요.', special: {}
  },
  {
    id: 'birkin', name: '필로덴드론 버킨', emoji: '🤍', alias: ['버킨'],
    water: '겉흙 2cm가 마르면 흠뻑', waterDays: 7,
    light: '밝은 간접광. 빛이 부족하면 하얀 줄무늬가 옅어져요', lightLevel: 2, temp: '18~27℃', humidity: '보통~높게', pet: true,
    tip: '하얀 줄무늬가 매력이에요. 잎마다 무늬가 달라서 새잎 보는 재미가 있어요.', special: {}
  },
  {
    id: 'bengal', name: '벵갈고무나무', emoji: '🌳', alias: ['벵갈', '뱅갈', '벤갈', '벵갈렌시스'],
    water: '겉흙 2~3cm가 마르면 흠뻑 (봄·여름 주 1번)', waterDays: 7,
    light: '밝은 곳. 햇빛을 좋아해요', lightLevel: 3, temp: '16~27℃', humidity: '보통', pet: true,
    tip: '고무나무 중에서도 튼튼한 편이에요. 빛이 부족하면 잎이 떨어지니 밝은 곳에 두세요.',
    special: { drop: '벵갈고무나무는 빛이 부족하거나 자리를 옮기면 잎을 떨궈요. 밝은 창가에 자리를 정해 주세요.' }
  },
  {
    id: 'benjamin', name: '벤자민고무나무', emoji: '🌳', alias: ['벤자민', '벤자민나무', '벤저민'],
    water: '겉흙이 마르면 흠뻑', waterDays: 6,
    light: '밝은 곳', lightLevel: 3, temp: '16~27℃ (찬바람 싫어해요)', humidity: '보통', pet: true,
    tip: '자리를 옮기면 잎을 우수수 떨구는 걸로 유명해요. 한 자리에 두면 금방 적응해요.',
    special: { drop: '벤자민은 자리 이동, 찬바람에 잎을 잘 떨궈요. 자리를 고정하고 2~3주 기다리면 새잎이 나요.' }
  },
  {
    id: 'ginseng', name: '인삼벤자민', emoji: '🌳', alias: ['인삼벤자민', '인삼고무', '미크로카르파', '진생'],
    water: '겉흙이 마르면 흠뻑', waterDays: 7,
    light: '밝은 곳', lightLevel: 3, temp: '16~27℃', humidity: '보통', pet: true,
    tip: '통통한 뿌리가 인삼처럼 생겼어요. 뿌리가 계속 젖어 있지 않게 해 주세요.', special: {}
  },
  {
    id: 'umbellata', name: '움베르타', emoji: '💚', alias: ['움베르타', '움벨라타', '하트고무나무'],
    water: '겉흙 2~3cm가 마르면 흠뻑', waterDays: 7,
    light: '밝은 간접광', lightLevel: 2, temp: '18~27℃ (추위에 약해요)', humidity: '보통~높게', pet: true,
    tip: '하트 모양 큰 잎이 매력이에요. 겨울에 추우면 잎이 잘 떨어져요.', special: {}
  },
  {
    id: 'marginata', name: '드라세나 마지나타', emoji: '🎋', alias: ['마지나타', '드라세나마지나타'],
    water: '겉흙 3cm가 마르면 (물을 아껴 주는 편이 좋아요)', waterDays: 10,
    light: '밝은 간접광', lightLevel: 2, temp: '16~27℃', humidity: '보통', pet: true,
    tip: '가늘고 뾰족한 잎이 시원해 보여요. 아래 잎이 하나씩 지는 건 자연스러워요.', special: {}
  },
  {
    id: 'compacta', name: '드라세나 콤팩타', emoji: '🎋', alias: ['콤팩타', '컴팩타', '자바'],
    water: '겉흙 2~3cm가 마르면', waterDays: 9,
    light: '밝은 간접광. 그늘에서도 괜찮아요', lightLevel: 1, temp: '16~27℃', humidity: '보통', pet: true,
    tip: '짙은 초록 잎이 촘촘해요. 천천히 자라서 관리가 쉬워요.', special: {}
  },
  {
    id: 'rhapis', name: '관음죽', emoji: '🎍', alias: ['관음죽', '랩피스', '종려죽'],
    water: '겉흙이 마르면 흠뻑', waterDays: 6,
    light: '밝은 간접광. 그늘에서도 잘 버텨요', lightLevel: 1, temp: '10~27℃', humidity: '보통~높게', pet: false,
    tip: '추위에 꽤 강한 야자 종류예요. 잎끝이 마르면 분무해 주세요.', special: {}
  },
  {
    id: 'kentia', name: '켄차야자', emoji: '🌴', alias: ['켄차', '켄챠'],
    water: '겉흙 2~3cm가 마르면 흠뻑', waterDays: 7,
    light: '밝은 간접광. 그늘에도 강해요', lightLevel: 1, temp: '15~27℃', humidity: '보통', pet: false,
    tip: '천천히 자라고 그늘에도 강해서 거실에 두기 좋은 야자예요.', special: {}
  },
  {
    id: 'phoenix', name: '피닉스야자', emoji: '🌴', alias: ['피닉스', '로벨리니', '로베레니'],
    water: '겉흙이 마르면 흠뻑', waterDays: 6,
    light: '밝은 곳. 햇빛을 좋아해요', lightLevel: 3, temp: '15~30℃', humidity: '보통', pet: false,
    tip: '잎줄기 아래에 가시가 있어요. 옮길 때 조심하세요.', special: {}
  },
  {
    id: 'maranta', name: '마란타', emoji: '🙏', alias: ['마란타', '레우코네우라', '기도식물'],
    water: '겉흙이 살짝 마르면 (늘 촉촉하게)', waterDays: 5,
    light: '밝은 간접광. 직사광선은 잎이 바래요', lightLevel: 2, temp: '18~27℃', humidity: '높게', pet: false,
    tip: '밤이 되면 잎을 기도하듯 위로 모아요. 칼라데아처럼 습도를 좋아해요.',
    special: { curl: '마란타는 건조하면 잎을 말아요. 분무를 자주 해 주세요.' }
  },
  {
    id: 'aglaonema', name: '아글라오네마', emoji: '🌺', alias: ['아글라오네마', '스노우사파이어', '엔젤', '레드지르콘', '오로라'],
    water: '겉흙 2~3cm가 마르면 흠뻑', waterDays: 7,
    light: '밝은 간접광. 그늘에서도 괜찮아요', lightLevel: 1, temp: '18~27℃ (15℃ 아래는 피해요)', humidity: '보통~높게', pet: true,
    tip: '빨강·분홍·하양 무늬 잎이 예뻐요. 무늬가 화려할수록 빛을 조금 더 좋아해요.', special: {}
  },
  {
    id: 'syngonium', name: '싱고니움', emoji: '🍃', alias: ['싱고니움', '싱고늄', '네온', '화이트버터플라이'],
    water: '겉흙이 마르면 흠뻑', waterDays: 6,
    light: '밝은 간접광', lightLevel: 2, temp: '18~27℃', humidity: '보통~높게', pet: true,
    tip: '자라면서 잎 모양이 화살촉에서 손바닥 모양으로 변해요. 물꽂이도 잘 돼요.', special: {}
  },
  {
    id: 'fittonia', name: '피토니아', emoji: '🕸️', alias: ['피토니아', '휘토니아'],
    water: '흙이 늘 촉촉하게 (바싹 마르면 쓰러져요)', waterDays: 3,
    light: '밝은 간접광. 직사광선은 피해요', lightLevel: 2, temp: '18~27℃', humidity: '아주 높게', pet: false,
    tip: '물이 부족하면 축 쓰러졌다가 물을 주면 금방 일어나요. 유리병 테라리움에 잘 어울려요.',
    special: { droop: '피토니아는 목마르면 바로 쓰러져요. 물을 주면 몇 시간 안에 다시 일어나요.' }
  },
  {
    id: 'croton', name: '크로톤', emoji: '🍂', alias: ['크로톤', '변엽목'],
    water: '겉흙이 마르면 흠뻑', waterDays: 6,
    light: '햇빛을 좋아해요. 빛이 부족하면 잎 색이 흐려져요', lightLevel: 3, temp: '18~30℃ (추위에 약해요)', humidity: '보통~높게', pet: true,
    tip: '알록달록한 잎 색을 유지하려면 밝은 빛이 꼭 필요해요. 자리를 옮기면 잎을 떨구기도 해요.', special: {}
  },
  {
    id: 'pachira', name: '파키라', emoji: '🌳', alias: ['파키라', '머니트리'],
    water: '겉흙이 충분히 마르면 흠뻑 (줄기에 물을 저장해요)', waterDays: 9,
    light: '밝은 간접광', lightLevel: 2, temp: '16~27℃', humidity: '보통', pet: false,
    tip: '통통한 줄기에 물을 저장해서 물을 자주 주면 밑동이 물러요.',
    special: { mushy: '파키라 줄기 밑동이 물렁해지면 과습이에요. 흙을 충분히 말려 주세요.' }
  },
  {
    id: 'happytree', name: '해피트리 (녹보수)', emoji: '🌳', alias: ['해피트리', '녹보수', '라데르마케라'],
    water: '겉흙이 마르면 흠뻑', waterDays: 6,
    light: '밝은 곳', lightLevel: 2, temp: '16~27℃', humidity: '보통', pet: false,
    tip: '빛이 부족하거나 자리를 옮기면 잎을 잘 떨궈요. 밝은 곳에 두고 바람을 통하게 해 주세요.', special: {}
  },
  {
    id: 'ravenala', name: '여인초', emoji: '🍃', alias: ['여인초', '니콜라이'],
    water: '겉흙 2~3cm가 마르면 흠뻑', waterDays: 7,
    light: '아주 밝은 곳', lightLevel: 3, temp: '18~27℃', humidity: '보통', pet: true,
    tip: '바나나 잎처럼 큰 잎이 시원해요. 잎이 찢어지는 건 자연스러운 모습이에요.', special: {}
  },
  {
    id: 'eucalyptus', name: '유칼립투스', emoji: '🌿', alias: ['유칼립투스', '유칼리', '폴리안', '블랙잭'],
    water: '겉흙이 마르기 시작하면 바로 흠뻑 (바싹 마르면 잎이 말라요)', waterDays: 4,
    light: '햇빛을 아주 좋아해요', lightLevel: 3, temp: '10~25℃', humidity: '건조하게, 통풍 중요', pet: true,
    tip: '실내에서는 까다로운 편이에요. 햇빛과 바람이 가장 중요해요. 한번 바싹 마르면 회복이 어려워요.', special: {}
  },
  {
    id: 'araucaria', name: '아라우카리아', emoji: '🎄', alias: ['아라우카리아', '노포크'],
    water: '겉흙이 마르면 흠뻑', waterDays: 7,
    light: '밝은 곳', lightLevel: 3, temp: '10~24℃', humidity: '보통~높게', pet: null,
    tip: '작은 크리스마스트리 같아요. 한쪽으로 기울지 않게 화분을 가끔 돌려 주세요.', special: {}
  },
  {
    id: 'cycas', name: '소철', emoji: '🌴', alias: ['소철'],
    water: '흙이 충분히 마르면 (물을 아껴요)', waterDays: 12,
    light: '햇빛을 좋아해요', lightLevel: 3, temp: '10~30℃', humidity: '보통', pet: true,
    tip: '아주 천천히 자라요. 반려동물에게 특히 위험한 식물이니 손 닿지 않는 곳에 두세요.', special: {}
  },
  {
    id: 'staghorn', name: '박쥐란', emoji: '🦇', alias: ['박쥐란', '플라티세리움'],
    water: '1~2주에 한 번, 뿌리 쪽 이끼를 물에 푹 담가 적셔요', waterDays: 8,
    light: '밝은 간접광', lightLevel: 2, temp: '15~27℃', humidity: '높게', pet: false,
    tip: '아래쪽 갈색으로 마른 잎(저수엽)은 원래 그런 거예요. 떼어 내지 마세요.', special: {}
  },
  {
    id: 'boston', name: '보스턴고사리', emoji: '🌿', alias: ['보스턴', '고사리', '네프롤레피스', '더피'],
    water: '흙이 늘 촉촉하게', waterDays: 3,
    light: '밝은 간접광. 직사광선은 피해요', lightLevel: 2, temp: '15~25℃', humidity: '아주 높게', pet: false,
    tip: '건조하면 잎이 바스락 마르고 우수수 떨어져요. 욕실처럼 습한 곳을 좋아해요.',
    special: { drop: '고사리 잎이 우수수 떨어지면 공기가 건조하거나 물이 부족한 거예요. 분무를 자주 하고 흙을 촉촉하게 유지해요.' }
  },
  {
    id: 'adiantum', name: '아디안텀', emoji: '🌿', alias: ['아디안텀', '아디안툼', '공작고사리'],
    water: '흙이 늘 촉촉하게 (한 번이라도 바싹 마르면 잎이 말라요)', waterDays: 2,
    light: '밝은 간접광', lightLevel: 2, temp: '15~25℃', humidity: '아주 높게', pet: false,
    tip: '하늘하늘 예쁘지만 까다로운 편이에요. 잎이 말라도 뿌리가 살아 있으면 잘라 주면 새잎이 나요.', special: {}
  },
  {
    id: 'rhipsalis', name: '립살리스', emoji: '🎐', alias: ['립살리스'],
    water: '겉흙이 마르면 흠뻑', waterDays: 7,
    light: '밝은 간접광', lightLevel: 2, temp: '15~27℃', humidity: '보통~높게', pet: false,
    tip: '가시 없는 숲속 선인장이에요. 걸이 화분에서 늘어뜨려 키우면 예뻐요.', special: {}
  },
  {
    id: 'dischidia', name: '디시디아', emoji: '🫧', alias: ['디시디아', '누물라리아'],
    water: '겉흙이 마르면, 가끔 분무', waterDays: 7,
    light: '밝은 간접광', lightLevel: 2, temp: '18~27℃', humidity: '높게', pet: false,
    tip: '동글동글한 잎이 줄줄이 늘어져요. 물을 너무 자주 주면 잎이 떨어져요.', special: {}
  },
  {
    id: 'trachelospermum', name: '마삭줄', emoji: '🍃', alias: ['마삭', '마삭줄', '오색마삭', '황금마삭'],
    water: '겉흙이 마르면 흠뻑', waterDays: 4,
    light: '밝은 곳', lightLevel: 2, temp: '0~30℃ (추위에 강해요)', humidity: '보통', pet: null,
    tip: '햇빛을 받으면 잎이 분홍·빨강으로 물들어요. 바람이 잘 통해야 해요.', special: {}
  },
  {
    id: 'muehlenbeckia', name: '트리안', emoji: '🌱', alias: ['트리안', '뮤렌베키아'],
    water: '겉흙이 마르기 시작하면 흠뻑 (물을 좋아해요)', waterDays: 3,
    light: '밝은 곳', lightLevel: 2, temp: '10~25℃', humidity: '보통~높게', pet: false,
    tip: '물이 부족하면 잎이 바로 바싹 말라요. 바람이 잘 통하는 곳이 좋아요.', special: {}
  },
  {
    id: 'spider', name: '접란', emoji: '🕷️', alias: ['접란', '무늬접란', '스파이더플랜트', '클로로피텀'],
    water: '겉흙이 마르면 흠뻑', waterDays: 6,
    light: '밝은 간접광', lightLevel: 2, temp: '10~27℃', humidity: '보통', pet: false,
    tip: '줄기 끝에 아기 포기가 달려요. 떼어서 심으면 새 식물이 돼요.', special: {}
  },
  {
    id: 'coleus', name: '콜레우스', emoji: '🎨', alias: ['콜레우스'],
    water: '겉흙이 마르면 흠뻑 (물을 좋아해요)', waterDays: 3,
    light: '밝은 곳. 빛이 좋을수록 색이 선명해요', lightLevel: 3, temp: '15~30℃ (추위에 약해요)', humidity: '보통', pet: true,
    tip: '꽃대가 올라오면 잘라 주세요. 잎이 더 풍성하고 예뻐져요.', special: {}
  },
  {
    id: 'asparagus', name: '아스파라거스', emoji: '🌿', alias: ['아스파라거스', '나누스', '미리오클라두스', '스프렝게리'],
    water: '겉흙이 마르면 흠뻑', waterDays: 5,
    light: '밝은 간접광', lightLevel: 2, temp: '13~25℃', humidity: '보통~높게', pet: true,
    tip: '깃털처럼 보드라운 잎이 예뻐요. 건조하면 작은 잎이 노랗게 떨어져요.', special: {}
  },
  {
    id: 'ardisia', name: '백량금', emoji: '🔴', alias: ['백량금', '만냥금', '천냥금', '자금우'],
    water: '겉흙이 마르면 흠뻑', waterDays: 5,
    light: '밝은 간접광', lightLevel: 2, temp: '5~25℃ (서늘한 곳 좋아해요)', humidity: '보통~높게', pet: null,
    tip: '빨간 열매가 오래 달려 있어요. 겨울엔 서늘하게 두면 열매가 오래가요.', special: {}
  },
  {
    id: 'clusia', name: '크루시아', emoji: '🌿', alias: ['크루시아', '클루시아'],
    water: '겉흙이 충분히 마르면 흠뻑 (두꺼운 잎에 물을 저장해요)', waterDays: 10,
    light: '밝은 간접광', lightLevel: 2, temp: '16~27℃', humidity: '보통', pet: null,
    tip: '두툼한 잎이 단단하고 튼튼해요. 물을 자주 주지 않아도 돼요.', special: {}
  },
  {
    id: 'hydrocotyle', name: '워터코인', emoji: '🪙', alias: ['워터코인', '하이드로코타일'],
    water: '흙이 마르지 않게 늘 촉촉하게 (물에 담가 키워도 돼요)', waterDays: 2,
    light: '밝은 곳', lightLevel: 2, temp: '15~28℃', humidity: '높게', pet: null,
    tip: '동전 모양 잎이 귀여워요. 물을 아주 좋아해서 수경재배도 잘 돼요.', special: {}
  },
  {
    id: 'moss', name: '이끼', emoji: '🟩', alias: ['이끼', '비단이끼', '테라리움'],
    water: '분무로 늘 촉촉하게 (고인 물은 피해요)', waterDays: 2,
    light: '밝은 간접광. 직사광선은 마르게 해요', lightLevel: 1, temp: '10~25℃', humidity: '아주 높게', pet: false,
    tip: '뚜껑 있는 유리병 테라리움이라면 물을 거의 안 줘도 돼요. 뚜껑을 가끔 열어 환기해요.', special: {}
  },
  {
    id: 'venusflytrap', name: '파리지옥', emoji: '🪤', alias: ['파리지옥', '파리잡이'],
    water: '받침에 물을 1~2cm 받아 늘 축축하게. 수돗물보다 정수기·빗물이 좋아요', waterDays: 2,
    light: '햇빛을 아주 좋아해요', lightLevel: 3, temp: '봄~가을 따뜻하게, 겨울엔 서늘하게 쉬어요', humidity: '높게', pet: false,
    tip: '덫을 손으로 자꾸 건드리면 힘이 빠져요. 비료는 주지 마세요.', special: {}
  },
  {
    id: 'nepenthes', name: '네펜데스', emoji: '🏺', alias: ['네펜데스', '네펜테스', '벌레잡이통풀'],
    water: '흙을 촉촉하게. 정수기 물이나 받아 둔 물이 좋아요', waterDays: 3,
    light: '밝은 간접광', lightLevel: 2, temp: '18~30℃', humidity: '높게 (통이 잘 생겨요)', pet: false,
    tip: '습도가 높아야 주머니(통)가 생겨요. 통 안의 물은 버리지 마세요.', special: {}
  },
  /* ===== 다육 · 선인장 ===== */
  {
    id: 'haworthia', name: '하월시아', emoji: '💎', alias: ['하월시아', '하워르티아', '십이지권', '옵투사'],
    water: '흙이 완전히 마르면 (봄·가을 2주, 여름·겨울은 줄여요)', waterDays: 14,
    light: '밝은 간접광. 강한 직사광선은 잎이 타요', lightLevel: 2, temp: '10~25℃', humidity: '건조하게', pet: false,
    tip: '다육이 중에서 빛이 적어도 잘 자라는 편이라 실내에 좋아요.', special: {}
  },
  {
    id: 'echeveria', name: '에케베리아', emoji: '🌸', alias: ['에케베리아', '에케', '라울', '정야', '흑법사'],
    water: '흙이 완전히 마르면 흙에만 (잎 사이에 물이 고이지 않게)', waterDays: 14,
    light: '햇빛을 아주 좋아해요', lightLevel: 3, temp: '10~25℃', humidity: '건조하게', pet: false,
    tip: '장미꽃처럼 생긴 다육이에요. 햇빛을 잘 받으면 잎 끝이 예쁘게 물들어요.',
    special: { leggy: '에케베리아가 위로 길어지고 잎이 벌어지면 빛이 부족해요. 더 밝은 곳으로 옮겨 주세요.' }
  },
  {
    id: 'jade', name: '염좌 (돈나무 다육)', emoji: '🪙', alias: ['염좌', '화월', '크라슐라', '돈나무다육', '골룸'],
    water: '흙이 완전히 마르면 (봄·가을 2주)', waterDays: 14,
    light: '햇빛을 좋아해요', lightLevel: 3, temp: '5~27℃', humidity: '건조하게', pet: true,
    tip: '오래 키우면 작은 나무처럼 자라요. 잎을 떼어 꽂아 두면 새 포기가 나와요.', special: {}
  },
  {
    id: 'sedum', name: '세덤', emoji: '🌼', alias: ['세덤', '돌나물', '청옥', '구슬얽이', '황금세덤'],
    water: '흙이 마르면 (다육이 중 물을 조금 더 좋아해요)', waterDays: 10,
    light: '햇빛을 아주 좋아해요', lightLevel: 3, temp: '5~25℃', humidity: '건조하게', pet: false,
    tip: '작은 잎이 오밀조밀 퍼져요. 떨어진 잎에서도 쉽게 뿌리가 나요.', special: {}
  },
  {
    id: 'lithops', name: '리톱스', emoji: '🪨', alias: ['리톱스', '돌멩이다육', '석화옥'],
    water: '가을·봄에만 흙이 완전히 마르면. 탈피 중(봄)이나 한여름엔 물을 끊어요', waterDays: 21,
    light: '햇빛을 아주 좋아해요', lightLevel: 3, temp: '10~25℃', humidity: '아주 건조하게', pet: false,
    tip: '새 잎이 옛 잎을 뚫고 나오는 탈피를 해요. 이때 물을 주면 터질 수 있어요.', special: {}
  },
  {
    id: 'kalanchoe', name: '칼랑코에', emoji: '🌼', alias: ['칼랑코에', '칼란디바', '카랑코에'],
    water: '흙이 거의 마르면', waterDays: 10,
    light: '밝은 곳', lightLevel: 3, temp: '13~25℃', humidity: '건조하게', pet: true,
    tip: '작은 꽃이 오래 피어요. 해가 짧은 겨울에 꽃눈이 생겨요.', special: {}
  },
  {
    id: 'euphorbiamilii', name: '꽃기린', emoji: '🌺', alias: ['꽃기린', '밀리'],
    water: '겉흙이 마르면 (꽃 필 때는 조금 더 자주)', waterDays: 8,
    light: '햇빛을 아주 좋아해요', lightLevel: 3, temp: '15~30℃', humidity: '건조하게', pet: true,
    tip: '하얀 즙이 피부에 닿으면 따가울 수 있어요. 가시도 있으니 장갑을 끼고 만지세요.', special: {}
  },
  {
    id: 'christmascactus', name: '게발선인장', emoji: '🦀', alias: ['게발', '게발선인장', '크리스마스선인장', '가재발'],
    water: '겉흙이 마르면 흠뻑 (숲속 선인장이라 물을 좀 더 좋아해요)', waterDays: 7,
    light: '밝은 간접광', lightLevel: 2, temp: '15~25℃', humidity: '보통', pet: false,
    tip: '가을에 밤을 어둡고 서늘하게 해 주면 겨울에 꽃이 펴요. 꽃봉오리가 생기면 자리를 옮기지 마세요.', special: {}
  },
  {
    id: 'stringofpearls', name: '녹영', emoji: '🟢', alias: ['녹영', '구슬다육', '세네시오'],
    water: '구슬이 살짝 쭈글해지면', waterDays: 12,
    light: '밝은 간접광', lightLevel: 2, temp: '10~25℃', humidity: '건조하게', pet: true,
    tip: '초록 구슬이 줄줄이 늘어져요. 흙 위에 구슬이 닿게 두면 뿌리를 내리며 풍성해져요.', special: {}
  },
  {
    id: 'stringofhearts', name: '러브체인', emoji: '💕', alias: ['러브체인', '세로페기아'],
    water: '흙이 거의 마르면', waterDays: 10,
    light: '밝은 곳', lightLevel: 2, temp: '15~27℃', humidity: '보통', pet: false,
    tip: '하트 모양 잎이 줄줄이 늘어져요. 줄기의 작은 알뿌리를 심으면 새 포기가 돼요.', special: {}
  },
  {
    id: 'agave', name: '아가베', emoji: '🌵', alias: ['아가베', '용설란', '티타노타'],
    water: '흙이 완전히 마르면', waterDays: 21,
    light: '햇빛을 아주 좋아해요', lightLevel: 3, temp: '5~30℃', humidity: '건조하게', pet: true,
    tip: '잎끝 가시가 아주 날카로워요. 사람이 다니는 길목은 피해서 두세요.', special: {}
  },
  /* ===== 꽃 · 난초 ===== */
  {
    id: 'phalaenopsis', name: '호접란 (서양란)', emoji: '🦋', alias: ['호접란', '팔레놉시스', '서양란', '난초'],
    water: '뿌리를 감싼 바크·이끼가 마르면 (보통 7~10일). 뿌리가 은색이면 물 줄 때예요', waterDays: 8,
    light: '밝은 간접광. 직사광선은 잎이 타요', lightLevel: 2, temp: '18~28℃', humidity: '높게', pet: false,
    tip: '꽃이 지면 꽃대를 두 번째 마디 위에서 잘라 주면 다시 꽃이 피기도 해요.', special: {}
  },
  {
    id: 'orientalorchid', name: '동양란', emoji: '🎋', alias: ['동양란', '춘란', '한란', '풍란', '보세란', '석곡'],
    water: '난석이 마르면 흠뻑 (봄·여름 4~5일, 겨울 7~10일)', waterDays: 6,
    light: '밝은 간접광', lightLevel: 2, temp: '5~28℃', humidity: '보통~높게, 통풍 중요', pet: false,
    tip: '바람이 잘 통해야 해요. 물은 화분 아래로 충분히 흘러나오게 주세요.', special: {}
  },
  {
    id: 'dendrobium', name: '덴드로비움', emoji: '💜', alias: ['덴드로비움', '덴드로븀'],
    water: '겉이 마르면 흠뻑', waterDays: 6,
    light: '밝은 곳', lightLevel: 3, temp: '10~28℃', humidity: '보통~높게', pet: false,
    tip: '가을에 서늘하게 지내야 다음 해에 꽃눈이 잘 생겨요.', special: {}
  },
  {
    id: 'geranium', name: '제라늄', emoji: '🌺', alias: ['제라늄', '제라니움', '펠라르고니움', '구문초'],
    water: '겉흙이 마르면 흠뻑 (잎과 꽃에는 물이 닿지 않게)', waterDays: 5,
    light: '햇빛을 아주 좋아해요', lightLevel: 3, temp: '10~25℃', humidity: '건조하게', pet: true,
    tip: '시든 꽃은 꽃대째 잘라 주세요. 햇빛을 많이 받을수록 꽃이 잘 펴요.', special: {}
  },
  {
    id: 'begonia', name: '베고니아', emoji: '🌸', alias: ['베고니아', '마큘라타', '렉스베고니아'],
    water: '겉흙이 마르면 (잎에 물이 닿지 않게 흙에만)', waterDays: 5,
    light: '밝은 간접광', lightLevel: 2, temp: '15~25℃', humidity: '보통~높게', pet: true,
    tip: '잎에 물이 오래 남으면 곰팡이가 생기기 쉬워요. 통풍을 잘 시켜 주세요.', special: {}
  },
  {
    id: 'cyclamen', name: '시클라멘', emoji: '🌸', alias: ['시클라멘', '시크라멘'],
    water: '겉흙이 마르면 화분 받침으로 물을 줘요 (구근 위에 물이 닿지 않게)', waterDays: 5,
    light: '밝은 곳', lightLevel: 2, temp: '10~18℃ (더위에 약해요)', humidity: '보통', pet: true,
    tip: '서늘한 곳에서 꽃이 오래가요. 시든 꽃은 줄기 밑동을 비틀어 뽑아 주세요.', special: {}
  },
  {
    id: 'africanviolet', name: '아프리칸바이올렛', emoji: '💜', alias: ['아프리칸바이올렛', '세인트폴리아', '바이올렛'],
    water: '겉흙이 마르면, 미지근한 물을 흙에만 (잎에 찬물이 닿으면 얼룩져요)', waterDays: 5,
    light: '밝은 간접광', lightLevel: 2, temp: '18~25℃', humidity: '보통~높게', pet: false,
    tip: '빛만 잘 맞으면 1년 내내 꽃을 피워요. 잎을 꽂아도 새 포기가 나와요.', special: {}
  },
  {
    id: 'calla', name: '칼라', emoji: '🤍', alias: ['칼라릴리', '칼라꽃', '카라'],
    water: '자라는 동안 흙을 촉촉하게', waterDays: 4,
    light: '밝은 곳', lightLevel: 3, temp: '15~25℃', humidity: '보통', pet: true,
    tip: '꽃이 지고 잎이 시들면 물을 줄이고 쉬게 해 주세요.', special: {}
  },
  {
    id: 'hydrangea', name: '수국', emoji: '💠', alias: ['수국', '하이드레인지아'],
    water: '겉흙이 마르면 흠뻑 (물을 아주 좋아해요)', waterDays: 2,
    light: '밝은 곳. 한여름 오후 햇빛은 피해요', lightLevel: 2, temp: '10~25℃', humidity: '보통', pet: true,
    tip: '물이 부족하면 금방 축 처져요. 흙이 산성이면 파랗게, 알칼리면 분홍빛이 돼요.',
    special: { droop: '수국은 물이 부족하면 금방 축 처져요. 흠뻑 주면 대부분 살아나요.' }
  },
  {
    id: 'rose', name: '미니장미', emoji: '🌹', alias: ['장미', '미니장미'],
    water: '겉흙이 마르면 흠뻑', waterDays: 3,
    light: '햇빛을 아주 좋아해요', lightLevel: 3, temp: '15~25℃', humidity: '보통, 통풍 중요', pet: false,
    tip: '실내에서는 응애가 잘 생겨요. 잎 뒷면을 자주 보고, 바람이 잘 통하게 해 주세요.', special: {}
  },
  {
    id: 'lavender', name: '라벤더', emoji: '💜', alias: ['라벤더', '라반딘'],
    water: '흙이 거의 마르면 (물을 적게 좋아해요)', waterDays: 7,
    light: '햇빛을 아주 좋아해요', lightLevel: 3, temp: '10~25℃', humidity: '건조하게, 통풍 중요', pet: true,
    tip: '습하고 바람이 안 통하면 금방 약해져요. 베란다처럼 밝고 바람 잘 통하는 곳이 좋아요.', special: {}
  },
  {
    id: 'gardenia', name: '치자나무', emoji: '🤍', alias: ['치자', '치자나무', '가드니아'],
    water: '겉흙이 마르면 흠뻑', waterDays: 4,
    light: '밝은 곳', lightLevel: 3, temp: '15~25℃', humidity: '높게', pet: true,
    tip: '꽃향기가 아주 좋아요. 꽃봉오리가 생기면 자리를 옮기지 마세요. 봉오리가 떨어질 수 있어요.', special: {}
  },
  {
    id: 'jasmine', name: '자스민', emoji: '🤍', alias: ['자스민', '재스민', '쟈스민', '학자스민', '마다가스카르'],
    water: '겉흙이 마르면 흠뻑', waterDays: 4,
    light: '햇빛을 좋아해요', lightLevel: 3, temp: '10~25℃', humidity: '보통', pet: null,
    tip: '겨울에 서늘하게 지내야 봄에 꽃이 잘 펴요. 꽃이 진 뒤 가지를 정리해 주세요.', special: {}
  },
  {
    id: 'murraya', name: '오렌지자스민', emoji: '🍊', alias: ['오렌지자스민', '무라야', '천리향'],
    water: '겉흙이 마르면 흠뻑', waterDays: 5,
    light: '밝은 곳', lightLevel: 3, temp: '15~28℃', humidity: '보통', pet: null,
    tip: '하얀 꽃에서 귤꽃 향기가 나요. 빛이 충분해야 꽃이 자주 펴요.', special: {}
  },
  {
    id: 'clivia', name: '군자란', emoji: '🧡', alias: ['군자란', '클리비아'],
    water: '겉흙이 마르면 (겨울엔 아주 적게)', waterDays: 8,
    light: '밝은 간접광', lightLevel: 2, temp: '10~25℃', humidity: '보통', pet: true,
    tip: '겨울에 10℃ 정도로 서늘하게 지내야 봄에 꽃대가 올라와요.', special: {}
  },
  {
    id: 'amaryllis', name: '아마릴리스', emoji: '🌺', alias: ['아마릴리스', '아마릴리'],
    water: '자라는 동안 겉흙이 마르면, 잎이 시들면 물을 끊고 쉬게 해요', waterDays: 6,
    light: '밝은 곳', lightLevel: 3, temp: '15~25℃', humidity: '보통', pet: true,
    tip: '꽃이 진 뒤에도 잎을 잘 키워야 알뿌리가 통통해져서 다음 해에 또 꽃이 펴요.', special: {}
  },
  {
    id: 'hyacinth', name: '히아신스', emoji: '💐', alias: ['히아신스', '히야신스'],
    water: '흙이 촉촉하게 (수경재배는 뿌리 끝만 물에 닿게)', waterDays: 4,
    light: '밝은 곳', lightLevel: 3, temp: '5~18℃ (서늘해야 꽃이 오래가요)', humidity: '보통', pet: true,
    tip: '꽃이 진 뒤 잎이 시들 때까지 두었다가 알뿌리를 캐서 서늘하게 보관해요.', special: {}
  },
  {
    id: 'tulip', name: '튤립', emoji: '🌷', alias: ['튤립', '튜울립'],
    water: '흙이 촉촉하게', waterDays: 4,
    light: '밝은 곳', lightLevel: 3, temp: '5~18℃', humidity: '보통', pet: true,
    tip: '따뜻한 실내에서는 꽃이 금방 져요. 서늘한 곳에 두면 오래 봐요.', special: {}
  },
  {
    id: 'poinsettia', name: '포인세티아', emoji: '❤️', alias: ['포인세티아', '포인셋티아'],
    water: '겉흙이 마르면 흠뻑', waterDays: 5,
    light: '밝은 곳', lightLevel: 2, temp: '15~25℃ (찬바람에 잎이 떨어져요)', humidity: '보통', pet: true,
    tip: '빨간 부분은 꽃이 아니라 잎이에요. 찬바람과 갑작스러운 온도 변화를 피해 주세요.', special: {}
  },
  {
    id: 'mimosa', name: '미모사', emoji: '🙈', alias: ['미모사', '신경초'],
    water: '겉흙이 마르면 흠뻑', waterDays: 3,
    light: '햇빛을 좋아해요', lightLevel: 3, temp: '18~30℃', humidity: '보통~높게', pet: null,
    tip: '건드리면 잎을 접어요. 너무 자주 건드리면 힘이 빠지니 가끔만 해 주세요.', special: {}
  },
  /* ===== 허브 · 채소 · 과일나무 ===== */
  {
    id: 'mint', name: '애플민트 (민트)', emoji: '🌿', alias: ['민트', '애플민트', '페퍼민트', '스피아민트'],
    water: '겉흙이 마르면 흠뻑 (물을 좋아해요)', waterDays: 3,
    light: '밝은 곳', lightLevel: 2, temp: '10~25℃', humidity: '보통', pet: true,
    tip: '아주 잘 자라요. 자주 잘라 먹으면 더 풍성해져요. 꽃이 피면 잎이 질겨지니 꽃대는 잘라요.', special: {}
  },
  {
    id: 'lemonbalm', name: '레몬밤', emoji: '🍋', alias: ['레몬밤'],
    water: '겉흙이 마르면 흠뻑', waterDays: 3,
    light: '밝은 곳', lightLevel: 2, temp: '10~25℃', humidity: '보통', pet: null,
    tip: '잎을 문지르면 레몬 향이 나요. 차로 우려 마실 수 있어요.', special: {}
  },
  {
    id: 'thyme', name: '타임', emoji: '🌿', alias: ['타임', '백리향'],
    water: '흙이 거의 마르면 (물을 적게)', waterDays: 6,
    light: '햇빛을 아주 좋아해요', lightLevel: 3, temp: '10~25℃', humidity: '건조하게', pet: false,
    tip: '건조하게 키울수록 향이 진해져요. 바람이 잘 통하는 곳이 좋아요.', special: {}
  },
  {
    id: 'parsley', name: '파슬리', emoji: '🌱', alias: ['파슬리'],
    water: '겉흙이 마르면 흠뻑', waterDays: 3,
    light: '밝은 곳', lightLevel: 2, temp: '15~25℃', humidity: '보통', pet: null,
    tip: '바깥쪽 잎부터 따 먹으면 가운데서 계속 새잎이 나와요.', special: {}
  },
  {
    id: 'stevia', name: '스테비아', emoji: '🍬', alias: ['스테비아'],
    water: '겉흙이 마르면 흠뻑', waterDays: 3,
    light: '햇빛을 좋아해요', lightLevel: 3, temp: '15~30℃', humidity: '보통', pet: false,
    tip: '잎이 설탕보다 훨씬 달아요. 끝을 잘라 주면 옆으로 풍성해져요.', special: {}
  },
  {
    id: 'tomato', name: '방울토마토', emoji: '🍅', alias: ['토마토', '방울토마토'],
    water: '겉흙이 마르면 흠뻑 (열매 맺을 때는 매일 볼 수도 있어요)', waterDays: 2,
    light: '햇빛을 아주 좋아해요 (하루 6시간 이상)', lightLevel: 3, temp: '18~30℃', humidity: '보통', pet: true,
    tip: '줄기와 잎 사이에서 나오는 곁순은 따 주세요. 지지대를 세워 줘야 해요.', special: {}
  },
  {
    id: 'lettuce', name: '상추', emoji: '🥬', alias: ['상추', '쌈채소', '로메인'],
    water: '겉흙이 마르면 흠뻑', waterDays: 2,
    light: '밝은 곳', lightLevel: 2, temp: '15~22℃ (더우면 꽃대가 올라와요)', humidity: '보통', pet: false,
    tip: '바깥 잎부터 따 먹으면 오래 수확할 수 있어요.', special: {}
  },
  {
    id: 'pepper', name: '고추', emoji: '🌶️', alias: ['고추', '청양고추', '파프리카', '피망'],
    water: '겉흙이 마르면 흠뻑', waterDays: 2,
    light: '햇빛을 아주 좋아해요', lightLevel: 3, temp: '20~30℃', humidity: '보통', pet: null,
    tip: '첫 꽃이 핀 아래 곁가지는 정리해 주면 열매가 잘 커요.', special: {}
  },
  {
    id: 'strawberry', name: '딸기', emoji: '🍓', alias: ['딸기'],
    water: '겉흙이 마르면 흠뻑 (열매에 물이 닿지 않게)', waterDays: 2,
    light: '햇빛을 아주 좋아해요', lightLevel: 3, temp: '15~25℃', humidity: '보통', pet: false,
    tip: '런너(옆으로 뻗는 줄기) 끝에 새 포기가 생겨요. 열매를 원하면 런너는 잘라 주세요.', special: {}
  },
  {
    id: 'blueberry', name: '블루베리', emoji: '🫐', alias: ['블루베리'],
    water: '흙이 마르지 않게 (물을 좋아해요)', waterDays: 3,
    light: '햇빛을 아주 좋아해요', lightLevel: 3, temp: '겨울 추위를 겪어야 꽃이 펴요', humidity: '보통', pet: false,
    tip: '산성 흙(블루베리 전용 흙)에 심어야 잘 자라요.', special: {}
  },
  {
    id: 'lemon', name: '레몬나무', emoji: '🍋', alias: ['레몬나무', '레몬', '귤나무', '금귤', '낑깡', '유자'],
    water: '겉흙이 마르면 흠뻑', waterDays: 5,
    light: '햇빛을 아주 좋아해요', lightLevel: 3, temp: '10~28℃', humidity: '보통', pet: true,
    tip: '꽃이 피면 붓으로 꽃가루를 옮겨 주면 열매가 잘 달려요. 잎을 문지르면 상큼한 향이 나요.', special: {}
  },
  {
    id: 'fig', name: '무화과나무', emoji: '🟣', alias: ['무화과'],
    water: '겉흙이 마르면 흠뻑 (물을 좋아해요)', waterDays: 3,
    light: '햇빛을 아주 좋아해요', lightLevel: 3, temp: '15~30℃ (겨울엔 잎을 떨구고 쉬어요)', humidity: '보통', pet: true,
    tip: '겨울에 잎이 다 떨어지는 건 쉬는 거예요. 봄에 다시 새잎이 나요.', special: {}
  },
  {
    id: 'avocado', name: '아보카도', emoji: '🥑', alias: ['아보카도'],
    water: '겉흙이 마르면 흠뻑', waterDays: 5,
    light: '햇빛을 좋아해요', lightLevel: 3, temp: '15~28℃', humidity: '보통', pet: true,
    tip: '씨앗을 물에 반쯤 담가 두면 싹이 나요. 키가 크면 끝을 잘라 옆가지를 키워요.', special: {}
  },
  {
    id: 'coffee', name: '커피나무', emoji: '☕', alias: ['커피나무', '커피', '아라비카'],
    water: '겉흙이 마르면 흠뻑', waterDays: 5,
    light: '밝은 간접광. 직사광선은 잎이 타요', lightLevel: 2, temp: '18~27℃ (추위에 약해요)', humidity: '보통~높게', pet: true,
    tip: '반짝이는 짙은 초록 잎이 예뻐요. 몇 년 키우면 하얀 꽃과 빨간 열매를 볼 수 있어요.', special: {}
  },
  {
    id: 'cissus', name: '시서스', emoji: '🍇', alias: ['시서스', '엘렌다니카', '그레이프아이비'],
    water: '겉흙이 마르면 흠뻑', waterDays: 6,
    light: '밝은 간접광', lightLevel: 2, temp: '15~27℃', humidity: '보통', pet: false,
    tip: '덩굴손으로 감고 올라가요. 걸이 화분이나 지지대에 잘 어울려요.', special: {}
  },
  {
    id: 'caladium', name: '칼라디움', emoji: '🎨', alias: ['칼라디움'],
    water: '자라는 동안 흙을 촉촉하게', waterDays: 4,
    light: '밝은 간접광. 직사광선은 잎이 타요', lightLevel: 2, temp: '20~30℃ (추위에 아주 약해요)', humidity: '높게', pet: true,
    tip: '가을에 잎이 시드는 건 알뿌리로 쉬러 가는 거예요. 물을 줄이고 따뜻하게 보관해요.', special: {}
  },
  {
    id: 'oregano', name: '오레가노', emoji: '🌿', alias: ['오레가노', '마조람'],
    water: '흙이 거의 마르면 (물을 적게)', waterDays: 6,
    light: '햇빛을 아주 좋아해요', lightLevel: 3, temp: '10~27℃', humidity: '건조하게', pet: true,
    tip: '건조하게 키울수록 향이 진해요. 줄기 끝을 잘라 주면 풍성해져요.', special: {}
  },
  {
    id: 'coralberry', name: '산호수', emoji: '🔴', alias: ['산호수'],
    water: '겉흙이 마르면 흠뻑', waterDays: 5,
    light: '밝은 간접광. 그늘에서도 괜찮아요', lightLevel: 1, temp: '5~25℃', humidity: '보통~높게', pet: null,
    tip: '작고 동그란 빨간 열매가 귀여워요. 키가 낮게 퍼져서 작은 화분에 좋아요.', special: {}
  },
  {
    id: 'greenonion', name: '반려대파', emoji: '🧅', alias: ['대파', '반려대파', '쪽파', '파뿌리'],
    water: '흙이라면 겉흙이 마르면 흠뻑. 물꽂이라면 뿌리만 잠기게 하고 매일 물 갈기', waterDays: 2,
    light: '밝은 곳', lightLevel: 2, temp: '15~25℃', humidity: '보통', pet: true,
    tip: '뿌리 위 3~5cm를 남기고 잘라 먹으면 다시 자라요. 물꽂이는 물이 상하지 않게 자주 갈아 주세요.', special: {}
  }
];

/* 증상별 원인과 해결책
 *   id: 증상 이름표 (바꾸지 않는다) / causes: 왜 그럴까요 / fixes: 이렇게 해 보세요
 */
const SYMPTOMS = [
  {
    id: 'yellow', emoji: '💛', title: '잎이 노랗게 변해요',
    causes: [
      '물을 너무 자주 줬어요 (가장 흔해요). 흙이 늘 축축하면 뿌리가 숨을 못 쉬어요',
      '아래쪽 오래된 잎 한두 장이 노래지는 건 자연스러운 현상이에요',
      '빛이 부족해요',
      '오래 분갈이를 안 해서 영양이 부족해요'
    ],
    fixes: [
      '손가락을 흙에 2~3cm 넣어 보고, 말랐을 때만 물을 주세요',
      '화분 받침에 고인 물은 바로 버려 주세요',
      '화분 바닥에 물 빠지는 구멍이 있는지 확인해요',
      '더 밝은 곳으로 옮겨 주세요',
      '봄·여름에 한 달에 한 번 묽은 비료를 주거나, 1~2년에 한 번 분갈이해요',
      '노랗게 된 잎은 다시 초록이 되지 않으니 잘라 줘도 괜찮아요'
    ]
  },
  {
    id: 'tips', emoji: '🤎', title: '잎끝이 갈색으로 말라요',
    causes: [
      '공기가 너무 건조해요 (에어컨·히터 바람)',
      '물이 부족했어요',
      '비료를 너무 많이 줬어요',
      '수돗물 성분에 예민한 식물이에요'
    ],
    fixes: [
      '잎 주변에 분무해 주거나 가습기 근처에 두세요',
      '에어컨·히터 바람이 직접 닿지 않는 곳으로 옮겨요',
      '물을 줄 때는 화분 밑으로 빠져나올 만큼 흠뻑 주세요',
      '비료를 잠시 쉬고, 물을 넉넉히 흘려보내 흙을 씻어 주세요',
      '수돗물은 받아서 하루 둔 뒤에 주세요',
      '마른 끝부분은 가위로 모양 따라 다듬어도 돼요'
    ]
  },
  {
    id: 'droop', emoji: '😩', title: '잎이 축 처져요',
    causes: [
      '목이 말라요 (흙이 바싹 말라 있다면)',
      '반대로 물이 너무 많아 뿌리가 상했어요 (흙이 젖어 있는데도 처진다면)',
      '너무 덥거나 갑자기 추워졌어요'
    ],
    fixes: [
      '먼저 흙을 만져 보세요!',
      '흙이 바싹 말랐다면 → 흠뻑 물을 주세요. 반나절 안에 살아나는 경우가 많아요',
      '흙이 젖어 있다면 → 물을 멈추고 바람이 통하는 곳에서 말려요. 며칠 지나도 그대로면 "줄기·뿌리가 물러요"를 보세요',
      '한낮 직사광선이나 찬 창가에서 떨어진 곳으로 옮겨요'
    ]
  },
  {
    id: 'drop', emoji: '🍂', title: '잎이 우수수 떨어져요',
    causes: [
      '자리를 옮겼거나 새 집에 와서 적응 중이에요',
      '찬바람(창문 틈, 에어컨)을 맞았어요',
      '빛이 갑자기 부족해졌어요',
      '물이 너무 많거나 너무 적었어요'
    ],
    fixes: [
      '밝은 곳에 자리를 정하고 2~3주는 옮기지 말고 기다려 주세요',
      '창문 틈 바람, 에어컨·히터 바람을 피해 주세요',
      '흙 상태를 보고 물 주는 간격을 맞춰요',
      '새잎이 나오기 시작하면 적응한 거예요'
    ]
  },
  {
    id: 'mushy', emoji: '🫠', title: '줄기·뿌리가 물러요 (냄새가 나요)',
    causes: [
      '물을 너무 자주 줘서 뿌리가 썩고 있어요',
      '화분에 물이 잘 안 빠져요',
      '추운 곳에서 물을 줬어요'
    ],
    fixes: [
      '물을 바로 멈춰요',
      '화분에서 살살 빼서 뿌리를 봐요. 건강한 뿌리는 하얗고 단단하고, 썩은 뿌리는 검고 물렁해요',
      '썩은 뿌리와 무른 줄기는 깨끗한 가위로 잘라 내요',
      '물이 잘 빠지는 새 흙에 다시 심고, 일주일쯤 뒤에 물을 주세요',
      '너무 심하면 건강한 줄기를 잘라 물이나 새 흙에 꽂아 다시 키울 수 있어요'
    ]
  },
  {
    id: 'spots', emoji: '🟤', title: '잎에 반점이 생겼어요',
    causes: [
      '바싹 마른 갈색·하얀 자국 → 강한 햇빛에 잎이 탔어요',
      '물렁한 갈색·검은 반점 + 노란 테두리 → 곰팡이·세균병일 수 있어요 (과습, 통풍 부족)',
      '작은 점들이 잎 전체에 퍼진다면 → 벌레(응애) 때문일 수 있어요'
    ],
    fixes: [
      '햇빛에 탄 거라면 커튼 너머 밝은 빛으로 옮겨 주세요 (탄 자국은 그대로 남아요)',
      '병 같다면 반점 난 잎을 잘라 내고, 다른 식물과 떨어뜨려요',
      '잎에 물이 오래 남지 않게 흙에만 물을 주고, 바람이 잘 통하게 해요',
      '잎 뒷면에 벌레가 있는지 확인해 보세요 ("벌레가 보여요" 참고)'
    ]
  },
  {
    id: 'curl', emoji: '🌀', title: '잎이 돌돌 말려요',
    causes: [
      '공기가 건조하거나 목이 말라요',
      '햇빛이 너무 강하거나 너무 더워요',
      '잎 뒷면에 벌레가 있을 수 있어요'
    ],
    fixes: [
      '흙이 말랐다면 물을 흠뻑 주고, 분무해 주세요',
      '직사광선과 히터 바람을 피해 주세요',
      '잎 뒷면을 살펴보고 벌레가 있으면 "벌레가 보여요"를 보세요'
    ]
  },
  {
    id: 'leggy', emoji: '🦒', title: '줄기만 가늘고 길게 자라요 (웃자람)',
    causes: [
      '빛이 부족해서 빛을 찾아 길게 뻗고 있어요',
      '따뜻한데 빛은 부족하면 더 심해져요'
    ],
    fixes: [
      '더 밝은 곳으로 옮겨 주세요. 갑자기 강한 햇빛에 두면 잎이 탈 수 있으니 며칠에 걸쳐 천천히요',
      '한쪽으로 휘면 화분을 가끔 돌려 주세요',
      '웃자란 줄기는 잘라 주면 아래에서 새 가지가 나와요'
    ]
  },
  {
    id: 'bugs', emoji: '🐛', title: '벌레가 보여요',
    causes: [
      '잎 뒷면에 아주 작은 점, 얇은 거미줄, 잎이 희끗희끗 → 응애 (건조할 때 잘 생겨요)',
      '하얀 솜뭉치나 갈색 껍질, 잎이 끈적끈적 → 깍지벌레',
      '흙 위로 작은 날파리가 날아다녀요 → 뿌리파리 (흙이 늘 축축할 때)',
      '새순에 초록·검은 작은 벌레가 모여 있어요 → 진딧물'
    ],
    fixes: [
      '먼저 다른 식물과 떨어뜨려 놓아요 (옮겨 가지 않게)',
      '응애·진딧물 → 샤워기로 잎 앞뒤를 씻어 내고, 며칠 동안 분무를 자주 해요',
      '깍지벌레 → 물티슈나 면봉으로 하나하나 닦아 내요',
      '뿌리파리 → 겉흙을 바싹 말리고, 노란 끈끈이 트랩을 꽂아 두세요',
      '계속 생기면 원예용 살충제를 설명서대로 써 보세요',
      '일주일 뒤에 다시 확인해요. 알에서 또 나올 수 있어요'
    ]
  },
  {
    id: 'mold', emoji: '🍄', title: '흙 위에 하얀 곰팡이가 생겼어요',
    causes: [
      '흙이 오래 축축하고 바람이 안 통해요',
      '흙 위에 떨어진 잎이 썩고 있어요'
    ],
    fixes: [
      '곰팡이 핀 겉흙을 숟가락으로 걷어 내고 새 흙을 살짝 덮어요',
      '물 주는 간격을 늘리고, 창문을 열어 바람이 통하게 해요',
      '흙 위 떨어진 잎은 바로 치워 주세요',
      '식물 자체에는 큰 해가 없는 경우가 많으니 너무 걱정하지 마세요'
    ]
  },
  {
    id: 'slow', emoji: '🐢', title: '안 자라요 / 새잎이 작아요',
    causes: [
      '겨울에는 쉬는 시기라 잘 안 자라는 게 자연스러워요',
      '빛이 부족해요',
      '화분이 작아서 뿌리가 꽉 찼어요 (화분 밑 구멍으로 뿌리가 나와요)',
      '영양이 부족해요'
    ],
    fixes: [
      '겨울이라면 물과 비료를 줄이고 봄까지 기다려 주세요',
      '더 밝은 곳으로 옮겨 주세요',
      '뿌리가 꽉 찼다면 봄·가을에 한 치수 큰 화분으로 분갈이해요',
      '봄·여름에 한 달에 한 번 묽은 비료를 주세요'
    ]
  }
];

const LIGHT_TEXT = { 1: '🌥️ 그늘에도 괜찮아요', 2: '⛅ 밝은 간접광', 3: '☀️ 햇빛 듬뿍' };

const norm = (t) => String(t || '').replace(/\s/g, '').toLowerCase();

// 식물 이름으로 종류 찾기 (띄어쓰기·대소문자 무시, 가장 길게 맞는 이름을 고른다)
function findPlantInfo(name) {
  const n = norm(name);
  if (!n) return null;
  let best = null, bestLen = 0;
  for (const p of PLANT_INFO) {
    for (const a of [p.name.replace(/\s*\(.*\)/, ''), ...p.alias]) {
      const k = norm(a);
      if (k && n.includes(k) && k.length > bestLen) { best = p; bestLen = k.length; }
    }
  }
  return best;
}

// 검색: 이름 일부만 쳐도 찾는다. 앞부분이 맞을수록 먼저 보여 준다.
function searchPlants(query, limit = 50) {
  const q = norm(query);
  if (!q) return [];
  const scored = [];
  for (const p of PLANT_INFO) {
    let score = 0;
    for (const a of [p.name, ...p.alias]) {
      const k = norm(a);
      if (k === q) score = Math.max(score, 4);
      else if (k.startsWith(q)) score = Math.max(score, 3);
      else if (k.includes(q)) score = Math.max(score, 2);
      else if (q.includes(k) && k.length >= 2) score = Math.max(score, 1);
    }
    if (score) scored.push({ p, score });
  }
  return scored.sort((a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name, 'ko')).slice(0, limit).map((x) => x.p);
}
