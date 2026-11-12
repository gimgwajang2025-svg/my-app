/* 식물아, 오늘도 잘 자랐니?
 * 식물 사전 · 증상 정보는 plants-data.js 에 있다.
 * 모든 기록은 이 기기의 localStorage에만 저장된다. (저장 이름은 바꾸지 않는다)
 *   my-app-plants  : 식물 목록
 *   my-app-entries : 기록(날짜, 메모, 태그, 사진)
 */

const KEY_PLANTS = 'my-app-plants';
const KEY_ENTRIES = 'my-app-entries';
const STORAGE_LIMIT = 5 * 1024 * 1024; // 보통 휴대폰 브라우저가 허용하는 크기(약 5MB)

const TAGS = [
  { id: 'leaf', emoji: '🌱', label: '새잎' },
  { id: 'flower', emoji: '🌸', label: '꽃' },
  { id: 'bug', emoji: '🐛', label: '벌레' }
];

const $app = document.getElementById('app');

/* ---------- 저장 ---------- */
function load(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}
let plants = load(KEY_PLANTS);
let entries = load(KEY_ENTRIES);

// 앱 상태(마지막 백업 날짜, 이미 알려 준 배지). 백업 파일에는 넣지 않는다.
const KEY_META = 'my-app-meta';
let meta = (() => {
  try { const m = JSON.parse(localStorage.getItem(KEY_META)); return m && typeof m === 'object' && !Array.isArray(m) ? m : {}; } catch { return {}; }
})();
function saveMeta() {
  try { localStorage.setItem(KEY_META, JSON.stringify(meta)); } catch { /* 작아서 거의 실패하지 않음 */ }
}

function save() {
  try {
    localStorage.setItem(KEY_PLANTS, JSON.stringify(plants));
    localStorage.setItem(KEY_ENTRIES, JSON.stringify(entries));
    return true;
  } catch (e) {
    // 저장공간이 가득 참 → 저장 전 상태로 되돌린다
    plants = load(KEY_PLANTS);
    entries = load(KEY_ENTRIES);
    toast('저장공간이 가득 찼어요 😢 오래된 사진을 지워 주세요');
    return false;
  }
}

function usedBytes() {
  let n = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    n += (k.length + (localStorage.getItem(k) || '').length) * 2;
  }
  return n;
}

/* ---------- 작은 도우미 ---------- */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function todayStr() { return dateStr(new Date()); }
function dateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function parseDate(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function prettyDate(s) {
  const d = parseDate(s);
  const wd = '일월화수목금토'[d.getDay()];
  const base = `${d.getMonth() + 1}월 ${d.getDate()}일 (${wd})`;
  return d.getFullYear() !== new Date().getFullYear() ? `${d.getFullYear()}년 ${base}` : base;
}
function daysBetween(a, b) { return Math.round((parseDate(b) - parseDate(a)) / 86400000); }

const plantById = (id) => plants.find((p) => p.id === id);

// 내 식물의 종류 정보: 직접 고른 종류가 먼저, 없으면 이름으로 찾는다
function infoOf(p) {
  if (!p) return null;
  if (p.type === 'none') return null;
  return PLANT_INFO.find((i) => i.id === p.type) || findPlantInfo(p.name);
}

// 식물의 기록: 날짜 오래된 순
function entriesOf(plantId) {
  return entries
    .filter((e) => e.plantId === plantId)
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt);
}

function latestPhoto(plantId) {
  const list = entriesOf(plantId).filter((e) => e.photos.length);
  const last = list[list.length - 1];
  return last ? last.photos[last.photos.length - 1] : null;
}

const tagText = (e) => TAGS.filter((t) => e.tags.includes(t.id)).map((t) => `${t.emoji} ${t.label}`).join(' ');

// 알림 문구: 여러 개가 겹치면 차례대로 보여 준다
const toastQueue = [];
let toastBusy = false;
function toast(msg, party) {
  toastQueue.push({ msg, party });
  if (!toastBusy) nextToast();
}
function nextToast() {
  const t = document.getElementById('toast');
  const item = toastQueue.shift();
  if (!item) { toastBusy = false; return; }
  toastBusy = true;
  if (item.badge) return showBadgePop(item.badge, item.more, () => setTimeout(nextToast, 250));
  t.textContent = item.msg;
  t.className = 'toast show' + (item.party ? ' party' : '');
  setTimeout(() => {
    t.className = 'toast';
    setTimeout(nextToast, 300);
  }, item.party ? 2600 : 2200);
}

/* ---------- 입력 창 / 확인 창 ---------- */
function openModal({ title, text = '', input = false, value = '', placeholder = '', ok = '확인', danger = false }) {
  return new Promise((resolve) => {
    const modal = document.getElementById('modal');
    const form = document.getElementById('modal-form');
    const inp = document.getElementById('modal-input');
    const okBtn = document.getElementById('modal-ok');
    const cancel = document.getElementById('modal-cancel');
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-text').textContent = text;
    inp.hidden = !input;
    inp.value = value;
    inp.placeholder = placeholder;
    inp.oninput = null;
    document.getElementById('modal-suggest').hidden = true;
    okBtn.textContent = ok;
    okBtn.className = 'btn ' + (danger ? 'danger' : 'primary');
    modal.hidden = false;
    if (input) setTimeout(() => inp.focus(), 50);
    const done = (v) => { modal.hidden = true; form.onsubmit = null; cancel.onclick = null; resolve(v); };
    form.onsubmit = (e) => { e.preventDefault(); done(input ? (inp.value.trim() || null) : true); };
    cancel.onclick = () => done(input ? null : false);
  });
}
const askText = (title, value = '', placeholder = '') => openModal({ title, input: true, value, placeholder });
const askDelete = (text) => openModal({ title: '정말 지울까요? 🥲', text, ok: '지우기', danger: true });

// 식물 등록 창: 이름을 치면 아래에 비슷한 식물을 추천한다
async function addPlant() {
  let picked = null; // 추천에서 고른 종류
  const inp = document.getElementById('modal-input');
  const box = document.getElementById('modal-suggest');
  const draw = () => {
    const q = inp.value.trim();
    const list = q ? searchPlants(q, 5) : [];
    const auto = picked || findPlantInfo(q);
    box.hidden = !q;
    box.innerHTML = `
      ${auto ? `<p class="suggest-now">✅ 종류: <b>${auto.emoji} ${auto.name}</b>${picked ? ' <small>(이름은 별명으로 바꿔도 돼요)</small>' : ''}</p>` : ''}
      ${list.filter((i) => i !== auto).map((i) => `<button type="button" class="suggest-item" data-pick="${i.id}">${i.emoji} ${i.name}</button>`).join('')}
      ${q && !auto && !list.length ? `<p class="suggest-none">사전에 없는 식물이에요. 그냥 등록해도 되고, 나중에 대화창에서 Claude에게 물어보면 사전에 넣어 드려요.</p>` : ''}`;
    box.querySelectorAll('[data-pick]').forEach((b) => (b.onclick = () => {
      picked = PLANT_INFO.find((i) => i.id === b.dataset.pick);
      inp.value = picked.name.replace(/\s*\(.*\)/, '');
      inp.focus();
      draw();
    }));
  };
  const pending = openModal({ title: '🪴 새 식물 등록', input: true, placeholder: '식물 이름 (예: 몬스테라)' });
  inp.oninput = () => {
    // 지운 경우, 또는 다른 식물 이름으로 바꿔 친 경우에는 고른 종류를 풀어 준다
    const m = findPlantInfo(inp.value);
    if (picked && (!inp.value.trim() || (m && m !== picked))) picked = null;
    draw();
  };
  const name = await pending;
  if (!name) return null;
  const p = { id: uid(), name, createdAt: todayStr() };
  if (picked && findPlantInfo(name) !== picked) p.type = picked.id;
  plants.push(p);
  if (!save()) return null;
  const info = infoOf(p);
  toast(info ? `${name} 등록 완료! ${info.name} 키우는 법도 찾았어요 📖` : `${name} 등록 완료! 반가워요 🌿`);
  return p;
}

// 사진 크게 보기
document.getElementById('viewer').onclick = () => (document.getElementById('viewer').hidden = true);
function bindPhotos() {
  $app.querySelectorAll('[data-view]').forEach((img) => (img.onclick = () => {
    document.getElementById('viewer-img').src = img.src;
    document.getElementById('viewer').hidden = false;
  }));
}

// 사진을 작게 줄여서 저장 (localStorage 용량이 작기 때문)
function shrinkPhoto(file, max = 900, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('사진을 읽지 못했어요')); };
    img.src = url;
  });
}

/* ---------- 화면 이동 ---------- */
function go(hash) { location.hash = hash; }

function route() {
  const [name, id] = (location.hash.slice(1) || 'home').split('/');
  const views = {
    record: () => viewRecord(id),
    plant: () => viewPlant(id),
    compare: () => viewCompare(id),
    calendar: () => viewCalendar(),
    helper: () => viewHelper(),
    doctor: () => viewDoctor(id, location.hash.split('/')[2]),
    info: () => viewInfo(id),
    type: () => viewType(id),
    badges: () => viewBadges(),
    backup: () => viewBackup()
  };
  const isHome = !views[name];
  const tab = isHome ? 'home' : ['helper', 'info'].includes(name) ? 'helper' : name;
  document.querySelectorAll('.tabbar a').forEach((a) => a.classList.toggle('on', a.dataset.tab === tab));
  document.getElementById('dock').hidden = !isHome;
  document.body.classList.toggle('has-dock', isHome);
  window.scrollTo(0, 0);
  return isHome ? viewHome() : views[name]();
}
window.addEventListener('hashchange', route);

const topbar = (title) =>
  `<div class="topbar"><button class="back" data-back aria-label="뒤로">←</button><h1>${title}</h1></div>`;

function bindBack() {
  $app.querySelectorAll('[data-back]').forEach((b) =>
    b.addEventListener('click', () => (history.length > 1 ? history.back() : go('#home')))
  );
}

/* ---------- 홈: 위(앱 이름) · 가운데(오늘의 기록) · 아래(큰 버튼) ---------- */
function viewHome() {
  const today = todayStr();
  const todays = entries.filter((e) => e.date === today).sort((a, b) => b.createdAt - a.createdAt);
  const used = usedBytes();
  const pct = Math.min(100, Math.round((used / STORAGE_LIMIT) * 100));

  const list = [...plants].sort((a, b) => {
    const la = entriesOf(a.id).at(-1)?.date || a.createdAt;
    const lb = entriesOf(b.id).at(-1)?.date || b.createdAt;
    return lb.localeCompare(la);
  });

  $app.innerHTML = `
    <header class="app-title">
      <h1>🌿 식물아, 오늘도 잘 자랐니?</h1>
      <p>작은 변화도 소중하게 남겨요</p>
    </header>

    ${streakCard()}

    <section class="today-card">
      <div class="head"><b>오늘의 기록</b><small>${prettyDate(today)}</small></div>
      ${todays.length ? todays.map(todayItem).join('') : `
        <div class="today-empty"><span class="emoji">🪴</span>오늘은 어떤 변화가 있었나요?<br>아래 버튼으로 남겨 보세요</div>`}
    </section>

    <h2>내 식물 ${plants.length ? `(${plants.length})` : ''}</h2>
    ${plants.length ? `<div class="plant-list">${list.map(plantCard).join('')}</div>` : `
      <div class="empty"><span class="emoji">🌱</span>아직 등록된 식물이 없어요.<br>첫 번째 식물을 등록해 보세요!</div>`}
    <button class="add-plant" id="add">＋ 식물 등록하기</button>

    <div class="storage ${pct >= 80 ? 'warn' : ''}">
      저장공간 ${pct}% 사용 중${pct >= 80 ? ' · 거의 찼어요!' : ''}
      <div class="bar"><i style="width:${Math.max(pct, 2)}%"></i></div>
    </div>
    ${backupNudge()}
  `;

  document.getElementById('add').onclick = async () => { if (await addPlant()) viewHome(); };
}

function todayItem(e) {
  const p = plantById(e.plantId);
  const sub = [tagText(e), e.memo].filter(Boolean).join(' · ') || `사진 ${e.photos.length}장`;
  return `
    <a class="today-item" href="#plant/${e.plantId}">
      ${e.photos[0] ? `<img class="thumb" src="${e.photos[0]}" alt="">` : `<div class="thumb">📝</div>`}
      <div class="txt"><b>${esc(p?.name || '')}</b><span>${esc(sub)}</span></div>
    </a>`;
}

function plantCard(p) {
  const list = entriesOf(p.id);
  const photo = latestPhoto(p.id);
  const last = list.at(-1);
  return `
    <a class="plant-card" href="#plant/${p.id}">
      ${photo ? `<img class="thumb" src="${photo}" alt="">` : `<div class="thumb">🪴</div>`}
      <div class="info">
        <div class="name">${esc(p.name)}</div>
        <div class="meta">${list.length ? `기록 ${list.length}개 · 마지막 ${prettyDate(last.date)}` : '아직 기록이 없어요'}</div>
      </div>
      <span class="arrow">›</span>
    </a>`;
}

/* ---------- 기록하기 / 고치기 ---------- */
let draft = null;

function viewRecord(param) {
  // param: 없음(새 기록) / "p-식물번호"(그 식물로 새 기록) / 기록번호(고치기)
  const editing = param && !param.startsWith('p-') ? entries.find((e) => e.id === param) : null;
  if (editing) {
    draft = { ...editing, tags: [...editing.tags], photos: [...editing.photos] };
  } else {
    const pre = param?.startsWith('p-') ? param.slice(2) : null;
    draft = {
      id: null,
      plantId: pre && plantById(pre) ? pre : plants.length === 1 ? plants[0].id : null,
      date: todayStr(), memo: '', tags: [], photos: []
    };
  }
  renderRecord(!!editing);
}

function renderRecord(editing) {
  $app.innerHTML = `
    ${topbar(editing ? '✏️ 기록 고치기' : '📸 오늘 기록하기')}

    <div class="field">
      <span class="label">어떤 식물인가요?</span>
      <div class="chips">
        ${plants.map((p) => `<button class="chip ${draft.plantId === p.id ? 'on' : ''}" data-plant="${p.id}">${esc(p.name)}</button>`).join('')}
        <button class="chip add" id="new-plant">＋ 새 식물</button>
      </div>
    </div>

    <div class="field">
      <label class="label" for="date">날짜</label>
      <input type="date" id="date" value="${draft.date}" max="${todayStr()}">
    </div>

    <div class="field">
      <span class="label">사진 <small>(여러 장 가능)</small></span>
      <div class="photo-grid">
        ${draft.photos.map((src, i) => `
          <div class="ph"><img src="${src}" alt="" data-view><button class="del" data-del="${i}" aria-label="사진 빼기">✕</button></div>`).join('')}
        <label class="photo-add"><span>📷</span>사진 추가
          <input type="file" accept="image/*" multiple hidden id="file">
        </label>
      </div>
    </div>

    <div class="field">
      <span class="label">어떤 변화가 있었나요?</span>
      <div class="tag-btns">
        ${TAGS.map((t) => `<button class="tag-btn ${draft.tags.includes(t.id) ? 'on' : ''}" data-tag="${t.id}"><span>${t.emoji}</span>${t.label}</button>`).join('')}
      </div>
    </div>

    <div class="field">
      <label class="label" for="memo">메모</label>
      <textarea id="memo" placeholder="오늘 우리 식물은 어땠나요?">${esc(draft.memo)}</textarea>
    </div>

    <button class="btn primary block save-btn" id="save">${editing ? '고친 내용 저장 💾' : '기록 저장하기 🌿'}</button>
  `;
  bindBack();
  bindPhotos();

  const memoEl = document.getElementById('memo');
  const dateEl = document.getElementById('date');
  const keep = () => { draft.memo = memoEl.value; draft.date = dateEl.value || todayStr(); };
  const redraw = () => { const y = window.scrollY; renderRecord(editing); window.scrollTo(0, y); };

  $app.querySelectorAll('[data-plant]').forEach((b) => (b.onclick = () => { keep(); draft.plantId = b.dataset.plant; redraw(); }));
  document.getElementById('new-plant').onclick = async () => {
    keep();
    const p = await addPlant();
    if (p) draft.plantId = p.id;
    redraw();
  };
  $app.querySelectorAll('[data-tag]').forEach((b) => (b.onclick = () => {
    keep();
    const t = b.dataset.tag;
    draft.tags = draft.tags.includes(t) ? draft.tags.filter((x) => x !== t) : [...draft.tags, t];
    redraw();
  }));
  $app.querySelectorAll('[data-del]').forEach((b) => (b.onclick = () => { keep(); draft.photos.splice(+b.dataset.del, 1); redraw(); }));

  document.getElementById('file').onchange = async (e) => {
    keep();
    const files = [...e.target.files];
    if (!files.length) return;
    toast('사진 준비 중… 📷');
    for (const f of files) {
      try { draft.photos.push(await shrinkPhoto(f)); } catch { toast('읽을 수 없는 사진이 있었어요'); }
    }
    redraw();
  };

  document.getElementById('save').onclick = () => {
    keep();
    if (!draft.plantId) return toast('어떤 식물인지 먼저 골라 주세요 🪴');
    if (!draft.photos.length && !draft.memo.trim() && !draft.tags.length) return toast('사진이나 메모를 하나라도 남겨 주세요 ✍️');

    const data = { plantId: draft.plantId, date: draft.date, memo: draft.memo.trim(), tags: draft.tags, photos: draft.photos };
    if (editing) {
      const i = entries.findIndex((e) => e.id === draft.id);
      entries[i] = { ...entries[i], ...data };
      if (!save()) return;
      toast('고쳤어요 ✨');
    } else {
      entries.push({ id: uid(), createdAt: Date.now(), ...data });
      if (!save()) return;
      toast(`기록 ${entriesOf(draft.plantId).length}번째예요 🎉`, true);
      const s = streakInfo();
      if (s.current >= 2 && s.today) toast(`🔥 ${s.current}일 연속 기록 중!`);
    }
    checkBadges();
    const pid = draft.plantId;
    draft = null;
    location.replace(`#plant/${pid}`);
  };
}

/* ---------- 식물 상세 ---------- */
function viewPlant(id) {
  const p = plantById(id);
  if (!p) return go('#home');
  const list = entriesOf(id);
  const first = list[0]?.date || p.createdAt;
  const together = daysBetween(p.createdAt < first ? p.createdAt : first, todayStr()) + 1;
  const photoCount = list.reduce((n, e) => n + e.photos.length, 0);

  $app.innerHTML = `
    ${topbar('🪴 ' + esc(p.name))}

    <div class="stats">
      <div class="stat"><b>D+${together}</b><small>함께한 날</small></div>
      <div class="stat"><b>${list.length}번</b><small>기록 ${list.length ? '🎉' : ''}</small></div>
    </div>

    <div class="btn-row">
      <a class="btn primary" href="#record/p-${p.id}">📸 기록하기</a>
      <a class="btn soft" href="#compare/${p.id}">🔍 처음 vs 지금</a>
    </div>

    ${careCard(p)}

    <h2>성장일기 ${photoCount ? `<small style="color:var(--muted);font-weight:400;font-size:16px">· 사진 ${photoCount}장</small>` : ''}</h2>
    ${list.length ? [...list].reverse().map((e) => entryCard(e, list.indexOf(e) + 1)).join('') : `
      <div class="empty"><span class="emoji">📝</span>첫 기록을 남겨 보세요!</div>`}

    <div class="danger-zone">
      <button class="btn soft" id="rename">✏️ 이름 바꾸기</button>
      <button class="btn danger" id="remove">🗑️ 식물 삭제</button>
    </div>
  `;
  bindBack();
  bindPhotos();
  bindEntryButtons(() => viewPlant(id));

  document.getElementById('rename').onclick = async () => {
    const name = await askText('✏️ 새 이름', p.name);
    if (!name) return;
    p.name = name;
    if (save()) viewPlant(id);
  };
  document.getElementById('remove').onclick = async () => {
    if (!(await askDelete(`'${p.name}'와(과) 기록 ${list.length}개가 모두 지워져요.\n지운 뒤에는 되돌릴 수 없어요.`))) return;
    plants = plants.filter((x) => x.id !== id);
    entries = entries.filter((e) => e.plantId !== id);
    save();
    toast('삭제했어요');
    location.replace('#home');
  };
}

function entryCard(e, nth, showPlant) {
  const tags = TAGS.filter((t) => e.tags.includes(t.id));
  const p = plantById(e.plantId);
  return `
    <div class="entry">
      <div class="entry-head">
        <span class="date">${prettyDate(e.date)}</span>
        ${showPlant && p ? `<a class="plant-name" href="#plant/${p.id}">🪴 ${esc(p.name)}</a>` : nth ? `<span class="nth">${nth}번째</span>` : ''}
      </div>
      ${tags.length ? `<div class="tags">${tags.map((t) => `<span>${t.emoji} ${t.label}</span>`).join('')}</div>` : ''}
      ${e.memo ? `<p class="memo">${esc(e.memo)}</p>` : ''}
      ${e.photos.length ? `<div class="photo-grid">${e.photos.map((src) => `<div class="ph"><img src="${src}" alt="" data-view loading="lazy"></div>`).join('')}</div>` : ''}
      ${e.tags.includes('bug') ? `<a class="btn soft block bug-help" href="#doctor/${e.plantId}/bugs">🩺 벌레 해결책 보기</a>` : ''}
      <div class="entry-actions">
        <button class="btn soft" data-edit="${e.id}">✏️ 고치기</button>
        <button class="btn danger" data-remove="${e.id}">🗑️ 지우기</button>
      </div>
    </div>`;
}

function bindEntryButtons(rerender) {
  $app.querySelectorAll('[data-edit]').forEach((b) => (b.onclick = () => go(`#record/${b.dataset.edit}`)));
  $app.querySelectorAll('[data-remove]').forEach((b) => (b.onclick = async () => {
    if (!(await askDelete('이 기록이 사진과 함께 지워져요.\n지운 뒤에는 되돌릴 수 없어요.'))) return;
    entries = entries.filter((e) => e.id !== b.dataset.remove);
    save();
    toast('기록을 지웠어요');
    rerender();
  }));
}

/* ---------- 처음 vs 지금 ---------- */
function viewCompare(id) {
  const p = plantById(id);
  if (!p) return go('#home');
  const shots = [];
  entriesOf(id).forEach((e) => e.photos.forEach((src) => shots.push({ src, date: e.date })));

  let body;
  if (shots.length < 2) {
    body = `<div class="empty"><span class="emoji">📷</span>사진이 2장 이상 있어야 비교할 수 있어요.<br>지금은 ${shots.length}장이에요.</div>
      <a class="btn primary block" style="margin-top:14px" href="#record/p-${id}">📸 사진 기록하러 가기</a>`;
  } else {
    const a = shots[0];
    const b = shots[shots.length - 1];
    const gap = daysBetween(a.date, b.date);
    body = `
      <div class="compare">
        <figure><img src="${a.src}" alt="처음 사진" data-view><figcaption><b>🌱 처음</b>${prettyDate(a.date)}</figcaption></figure>
        <figure><img src="${b.src}" alt="최근 사진" data-view><figcaption><b>🌿 지금</b>${prettyDate(b.date)}</figcaption></figure>
      </div>
      <p class="compare-msg">${gap > 0 ? `${gap}일 동안 이만큼 자랐어요! 👏` : '같은 날 찍은 사진이에요. 며칠 뒤에 또 찍어 봐요 📅'}</p>`;
  }

  $app.innerHTML = `${topbar('🔍 처음 vs 지금')}${body}`;
  bindBack();
  bindPhotos();
}

/* ---------- 캘린더 ---------- */
const cal = { y: new Date().getFullYear(), m: new Date().getMonth(), sel: null, plant: 'all' };

function viewCalendar() {
  const pick = entries.filter((e) => cal.plant === 'all' || e.plantId === cal.plant);
  const byDay = {};
  pick.forEach((e) => (byDay[e.date] ||= []).push(e));

  const first = new Date(cal.y, cal.m, 1);
  const days = new Date(cal.y, cal.m + 1, 0).getDate();
  const today = todayStr();
  let monthCount = 0;

  let cells = '일월화수목금토'.split('').map((w) => `<div class="wd">${w}</div>`).join('');
  for (let i = 0; i < first.getDay(); i++) cells += '<div></div>';
  for (let d = 1; d <= days; d++) {
    const ds = dateStr(new Date(cal.y, cal.m, d));
    const list = byDay[ds] || [];
    monthCount += list.length;
    const tagSet = new Set(list.flatMap((e) => e.tags));
    const mark = list.length ? (TAGS.filter((t) => tagSet.has(t.id)).map((t) => t.emoji)[0] || '🌿') : '';
    cells += `<button class="day ${list.length ? 'has' : ''} ${ds === today ? 'today' : ''} ${ds === cal.sel ? 'sel' : ''}" data-day="${ds}">
      ${d}<span class="dot">${mark}</span></button>`;
  }

  const selList = cal.sel ? (byDay[cal.sel] || []) : [];

  $app.innerHTML = `
    <header class="app-title"><h1>📅 기록 캘린더</h1></header>
    ${plants.length > 1 ? `<div class="chips" style="margin-top:14px">
      <button class="chip ${cal.plant === 'all' ? 'on' : ''}" data-filter="all">전체</button>
      ${plants.map((p) => `<button class="chip ${cal.plant === p.id ? 'on' : ''}" data-filter="${p.id}">${esc(p.name)}</button>`).join('')}
    </div>` : ''}
    <div class="cal-head">
      <button id="prev" aria-label="이전 달">‹</button>
      <b>${cal.y}년 ${cal.m + 1}월</b>
      <button id="next" aria-label="다음 달">›</button>
    </div>
    <div class="cal">${cells}</div>
    <p class="cal-sum">이번 달 기록 ${monthCount}개 ${monthCount ? '🌿' : ''}</p>

    ${cal.sel ? `<h2>${prettyDate(cal.sel)}</h2>
      ${selList.length ? selList.map((e) => entryCard(e, 0, true)).join('') : '<div class="empty">이날은 기록이 없어요</div>'}` : ''}
  `;

  document.getElementById('prev').onclick = () => { cal.m--; if (cal.m < 0) { cal.m = 11; cal.y--; } cal.sel = null; viewCalendar(); };
  document.getElementById('next').onclick = () => { cal.m++; if (cal.m > 11) { cal.m = 0; cal.y++; } cal.sel = null; viewCalendar(); };
  $app.querySelectorAll('[data-day]').forEach((b) => (b.onclick = () => { cal.sel = cal.sel === b.dataset.day ? null : b.dataset.day; viewCalendar(); }));
  $app.querySelectorAll('[data-filter]').forEach((b) => (b.onclick = () => { cal.plant = b.dataset.filter; viewCalendar(); }));
  bindPhotos();
  bindEntryButtons(viewCalendar);
}

/* ---------- 식물 도우미 ---------- */
const NOTICE = '<p class="notice">ℹ️ 일반적인 식물 관리 상식이에요. 전문가 진단을 대신하지는 않아요.</p>';

function petText(pet) {
  if (pet === true) return '⚠️ 고양이·강아지가 먹으면 해로울 수 있어요';
  if (pet === false) return '🐾 비교적 안전한 편이에요';
  return '🐾 종류마다 달라요. 반려동물이 먹지 않게 두는 게 좋아요';
}

function careRows(info) {
  return `
    <ul class="care">
      <li><b>💧 물</b><span>${info.water}</span></li>
      <li><b>☀️ 햇빛</b><span>${LIGHT_TEXT[info.lightLevel].split(' ')[0]} ${info.light}</span></li>
      <li><b>🌡️ 온도</b><span>${info.temp}</span></li>
      <li><b>💦 습도</b><span>${info.humidity}</span></li>
      <li><b>🐾 반려동물</b><span>${petText(info.pet)}</span></li>
    </ul>
    <p class="care-tip">💡 ${info.tip}</p>`;
}

// 식물 상세 화면의 "키우는 법" 카드
function careCard(p) {
  const info = infoOf(p);
  const doctorBtn = `<a class="btn primary block" href="#doctor/${p.id}">🩺 어디가 아파요?</a>`;
  if (!info) {
    return `
      <section class="care-card">
        <h3>📖 키우는 법</h3>
        <p class="muted">'${esc(p.name)}'의 종류를 아직 몰라요. 종류를 골라 주시면 키우는 법을 알려 드릴게요.</p>
        <div class="btn-col">
          <a class="btn soft block" href="#type/${p.id}">🔎 종류 고르기</a>
          ${doctorBtn}
        </div>
      </section>`;
  }
  return `
    <section class="care-card">
      <h3>${info.emoji} ${info.name} 키우는 법</h3>
      ${careRows(info)}
      <div class="btn-col">
        ${doctorBtn}
        <a class="btn ghost block" href="#type/${p.id}">종류가 달라요? 다시 고르기</a>
      </div>
    </section>`;
}

// 도우미 탭: 증상 목록 + 식물 사전
function viewHelper() {
  $app.innerHTML = `
    <header class="app-title"><h1>🩺 식물 도우미</h1><p>아픈 곳을 고르면 해결책을 알려 드려요</p></header>

    <h2>어디가 아파요?</h2>
    <div class="symptom-grid">
      ${SYMPTOMS.map((s) => `<a class="symptom" href="#doctor/-/${s.id}"><span>${s.emoji}</span>${s.title}</a>`).join('')}
    </div>

    <h2>📖 식물 사전 <small class="muted" style="font-size:16px;font-weight:400">${PLANT_INFO.length}종</small></h2>
    <input type="search" class="search" id="dict-q" placeholder="🔍 식물 이름 검색 (예: 몬스테라, 돈나무)" autocomplete="off">
    <div class="dict" id="dict"></div>
    ${NOTICE}
  `;
  bindDictSearch((i) => `<a class="dict-item" href="#info/${i.id}"><span>${i.emoji}</span>${i.name}</a>`);
}

// 사전 검색창: 치는 대로 목록을 걸러 보여 준다
const sortedPlants = () => [...PLANT_INFO].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
function bindDictSearch(itemHtml) {
  const q = document.getElementById('dict-q');
  const box = document.getElementById('dict');
  const draw = () => {
    const text = q.value.trim();
    const list = text ? searchPlants(text) : sortedPlants();
    box.innerHTML = list.length
      ? list.map(itemHtml).join('')
      : `<div class="empty dict-none"><span class="emoji">🔎</span>'${esc(text)}'은(는) 아직 사전에 없어요.<br>대화창에서 Claude에게 물어보시면 사전에 넣어 드려요.</div>`;
  };
  q.oninput = draw;
  draw();
  return draw;
}

// 증상 → 원인 · 해결책 (plantId가 '-'이면 식물 없이 일반 안내)
function viewDoctor(plantId, openId) {
  const p = plantId && plantId !== '-' ? plantById(plantId) : null;
  const info = infoOf(p);
  $app.innerHTML = `
    ${topbar(p ? `🩺 ${esc(p.name)}, 어디가 아파요?` : '🩺 어디가 아파요?')}
    <p class="muted" style="margin-bottom:14px">증상을 누르면 원인과 해결책이 펼쳐져요.</p>
    ${SYMPTOMS.map((s) => {
      const special = info?.special?.[s.id];
      return `
      <details class="sym" id="sym-${s.id}" ${s.id === openId ? 'open' : ''}>
        <summary><span class="sym-emoji">${s.emoji}</span>${s.title}${special ? '<em>맞춤 안내</em>' : ''}</summary>
        <div class="sym-body">
          ${special ? `<p class="special">${info.emoji} <b>${info.name}</b>: ${special}</p>` : ''}
          <h4>🤔 왜 그럴까요?</h4>
          <ul>${s.causes.map((c) => `<li>${c}</li>`).join('')}</ul>
          <h4>💪 이렇게 해 보세요</h4>
          <ol>${s.fixes.map((f) => `<li>${f}</li>`).join('')}</ol>
          ${p ? `<a class="btn soft block" href="#record/p-${p.id}">📸 상태를 사진으로 기록해 두기</a>` : ''}
        </div>
      </details>`;
    }).join('')}
    ${NOTICE}
  `;
  bindBack();
  if (openId) setTimeout(() => document.getElementById(`sym-${openId}`)?.scrollIntoView({ block: 'start' }), 0);
}

// 식물 사전 한 종류
function viewInfo(infoId) {
  const info = PLANT_INFO.find((i) => i.id === infoId);
  if (!info) return go('#helper');
  const mine = plants.filter((p) => infoOf(p)?.id === info.id);
  const specials = SYMPTOMS.filter((s) => info.special[s.id]);
  $app.innerHTML = `
    ${topbar(`${info.emoji} ${info.name}`)}
    <section class="care-card" style="margin-top:0">${careRows(info)}</section>
    ${specials.length ? `<h2>${info.name}에게 자주 생기는 일</h2>
      ${specials.map((s) => `<a class="special-link" href="#doctor/-/${s.id}"><b>${s.emoji} ${s.title}</b><span>${info.special[s.id]}</span></a>`).join('')}` : ''}
    ${mine.length ? `<h2>내 ${info.name}</h2><div class="plant-list">${mine.map(plantCard).join('')}</div>` : ''}
    ${NOTICE}
  `;
  bindBack();
}

// 종류 직접 고르기
function viewType(plantId) {
  const p = plantById(plantId);
  if (!p) return go('#home');
  const cur = infoOf(p)?.id;
  $app.innerHTML = `
    ${topbar(`🔎 ${esc(p.name)}의 종류`)}
    <p class="muted" style="margin-bottom:10px">어떤 식물인지 검색하거나 골라 주세요.</p>
    <input type="search" class="search" id="dict-q" placeholder="🔍 식물 이름 검색" autocomplete="off">
    <div class="dict" id="dict"></div>
    <button class="btn ghost block" id="type-none" style="margin-top:14px">목록에 없어요</button>
  `;
  bindBack();
  const choose = (type) => {
    p.type = type;
    if (!save()) return;
    const info = infoOf(p);
    toast(info ? `${info.name}(으)로 정했어요 📖` : '알겠어요. 일반 안내로 도와드릴게요');
    location.replace(`#plant/${p.id}`);
  };
  const draw = bindDictSearch((i) => `<button class="dict-item ${i.id === cur ? 'on' : ''}" data-type="${i.id}"><span>${i.emoji}</span>${i.name}</button>`);
  // 목록이 다시 그려져도 누르면 동작하게 한 곳에서 받는다
  document.getElementById('dict').onclick = (e) => { const b = e.target.closest('[data-type]'); if (b) choose(b.dataset.type); };
  document.getElementById('type-none').onclick = () => choose('none');
  const q = document.getElementById('dict-q');
  q.value = p.name;
  draw();
  if (!searchPlants(p.name).length) { q.value = ''; draw(); }
}

/* ---------- 연속 기록 · 배지 ---------- */
function shiftDate(s, days) { const d = parseDate(s); d.setDate(d.getDate() + days); return dateStr(d); }

// 연속 기록: 오늘(또는 어제)까지 하루도 빠짐없이 기록한 날 수 + 최고 기록
function streakInfo() {
  const days = new Set(entries.map((e) => e.date));
  const today = todayStr();
  const hasToday = days.has(today);
  let cur = 0;
  let d = hasToday ? today : shiftDate(today, -1);
  while (days.has(d)) { cur++; d = shiftDate(d, -1); }
  let best = 0, run = 0, prev = null;
  [...days].sort().forEach((x) => {
    run = prev && shiftDate(prev, 1) === x ? run + 1 : 1;
    best = Math.max(best, run);
    prev = x;
  });
  return { current: cur, best, today: hasToday, totalDays: days.size };
}

const BADGES = [
  { id: 'first', emoji: '🌱', name: '첫 기록', done: '첫 기록을 남겼어요', how: '첫 기록을 남겨요', ok: (s) => s.entries >= 1 },
  { id: 'rec10', emoji: '📒', name: '기록 10번', done: '기록을 10번 남겼어요', how: '기록을 10번 남겨요', ok: (s) => s.entries >= 10 },
  { id: 'rec30', emoji: '📚', name: '기록 30번', done: '기록을 30번 남겼어요', how: '기록을 30번 남겨요', ok: (s) => s.entries >= 30 },
  { id: 'rec100', emoji: '🏆', name: '기록 100번', done: '기록을 100번 남겼어요', how: '기록을 100번 남겨요', ok: (s) => s.entries >= 100 },
  { id: 'streak3', emoji: '🔥', name: '3일 연속', done: '3일 연속으로 기록했어요', how: '3일 연속으로 기록해요', ok: (s) => s.best >= 3 },
  { id: 'streak7', emoji: '⭐', name: '7일 연속', done: '7일 연속으로 기록했어요', how: '7일 연속으로 기록해요', ok: (s) => s.best >= 7 },
  { id: 'streak30', emoji: '👑', name: '30일 연속', done: '30일 연속으로 기록했어요', how: '30일 연속으로 기록해요', ok: (s) => s.best >= 30 },
  { id: 'photo10', emoji: '📸', name: '사진 10장', done: '사진을 10장 모았어요', how: '사진을 10장 모아요', ok: (s) => s.photos >= 10 },
  { id: 'photo50', emoji: '🖼️', name: '사진 50장', done: '사진을 50장 모았어요', how: '사진을 50장 모아요', ok: (s) => s.photos >= 50 },
  { id: 'leaf', emoji: '🍃', name: '첫 새잎', done: '새잎을 처음 기록했어요', how: '🌱 새잎 태그로 기록해요', ok: (s) => s.tags.has('leaf') },
  { id: 'flower', emoji: '🌸', name: '첫 꽃', done: '꽃을 처음 기록했어요', how: '🌸 꽃 태그로 기록해요', ok: (s) => s.tags.has('flower') },
  { id: 'bug', emoji: '🐛', name: '벌레와의 전쟁', done: '벌레와 처음 맞섰어요', how: '🐛 벌레 태그로 기록해요', ok: (s) => s.tags.has('bug') },
  { id: 'garden', emoji: '🪴', name: '작은 정원', done: '식물이 3개가 됐어요', how: '식물을 3개 등록해요', ok: (s) => s.plants >= 3 },
  { id: 'grow30', emoji: '📏', name: '쑥쑥 자랐어요', done: '30일 동안의 성장을 담았어요', how: '한 식물의 처음·최근 사진이 30일 이상 차이 나요', ok: (s) => s.growDays >= 30 },
  { id: 'backup', emoji: '💾', name: '든든한 집사', done: '처음으로 백업했어요', how: '처음으로 백업해요', ok: () => !!meta.lastBackup }
];

function badgeStats() {
  const st = streakInfo();
  let growDays = 0;
  plants.forEach((p) => {
    const withPhoto = entriesOf(p.id).filter((e) => e.photos.length);
    if (withPhoto.length >= 2) growDays = Math.max(growDays, daysBetween(withPhoto[0].date, withPhoto.at(-1).date));
  });
  return {
    entries: entries.length,
    photos: entries.reduce((n, e) => n + e.photos.length, 0),
    tags: new Set(entries.flatMap((e) => e.tags)),
    plants: plants.length,
    best: st.best,
    growDays
  };
}
const earnedBadges = () => { const s = badgeStats(); return BADGES.filter((b) => b.ok(s)); };

// 새로 받은 배지가 있으면 알려 준다
function checkBadges() {
  const seen = new Set(meta.seenBadges || []);
  const fresh = earnedBadges().filter((b) => !seen.has(b.id));
  if (!fresh.length) return;
  meta.seenBadges = [...seen, ...fresh.map((b) => b.id)];
  saveMeta();
  // 화분 팝업으로 하나씩 보여 준다 (최대 3개, 나머지는 "외 ○개")
  const shown = fresh.slice(0, 3);
  shown.forEach((b, i) => {
    toastQueue.push({ badge: b, more: i === shown.length - 1 ? fresh.length - shown.length : 0 });
  });
  if (!toastBusy) nextToast();
}

// 화면 가운데 화분 팝업: 누르거나 3.5초 지나면 닫힌다
function showBadgePop(b, more, done) {
  const pop = document.getElementById('badge-pop');
  document.getElementById('bp-emoji').textContent = b.emoji;
  document.getElementById('bp-name').textContent = b.name;
  document.getElementById('bp-why').textContent = more ? `${b.done} · 외 ${more}개 더!` : b.done;
  pop.hidden = false;
  pop.classList.remove('show');
  void pop.offsetWidth; // 애니메이션을 처음부터 다시
  pop.classList.add('show');
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    clearTimeout(timer);
    pop.classList.remove('show');
    pop.classList.add('hide');
    setTimeout(() => { pop.hidden = true; pop.classList.remove('hide'); done(); }, 250);
  };
  const timer = setTimeout(close, 3500);
  pop.onclick = close;
}

function streakCard() {
  const s = streakInfo();
  const got = earnedBadges().length;
  let msg;
  if (!entries.length) msg = '첫 기록을 남기면 연속 기록이 시작돼요';
  else if (s.today) msg = s.current >= 2 ? `오늘도 기록 완료! 최고 기록 ${s.best}일` : '오늘 기록 완료! 내일도 만나요';
  else if (s.current) msg = `오늘 기록하면 ${s.current + 1}일째! 🔥`;
  else msg = '오늘 기록하고 다시 시작해요 💪';
  return `
    <a class="streak-card" href="#badges">
      <span class="streak-fire">${s.current ? '🔥' : '🌱'}</span>
      <span class="streak-txt"><b>${s.current ? `${s.current}일 연속 기록` : '연속 기록'}</b><small>${msg}</small></span>
      <span class="streak-badge">🏅 ${got}/${BADGES.length}</span>
    </a>`;
}

function viewBadges() {
  const s = streakInfo();
  const st = badgeStats();
  $app.innerHTML = `
    ${topbar('🏅 연속 기록 · 배지')}
    <div class="stats">
      <div class="stat"><b>${s.current}일</b><small>지금 연속 🔥</small></div>
      <div class="stat"><b>${s.best}일</b><small>최고 기록 👑</small></div>
    </div>
    <p class="muted" style="text-align:center">지금까지 ${s.totalDays}일 동안 기록했어요</p>
    <h2>내 배지 <small class="muted" style="font-size:16px;font-weight:400">${earnedBadges().length}/${BADGES.length}</small></h2>
    <div class="badge-grid">
      ${BADGES.map((b) => {
        const ok = b.ok(st);
        return `<div class="badge ${ok ? 'on' : ''}"><span>${b.emoji}</span><b>${b.name}</b><small>${ok ? '받았어요!' : b.how}</small></div>`;
      }).join('')}
    </div>
  `;
  bindBack();
}

/* ---------- 백업 · 불러오기 ---------- */
const BACKUP_APP = 'my-app-plant-diary';

function backupNudge() {
  // 기록이 없을 때(새 휴대폰 등)도 불러오기는 할 수 있게 버튼을 보여 준다
  if (!entries.length) return `<a class="backup-link" href="#backup">📂 백업 파일 불러오기</a>`;
  const last = meta.lastBackup;
  const gap = last ? daysBetween(last, todayStr()) : null;
  if (last && gap < 14) return `<a class="backup-link" href="#backup">💾 백업 · 불러오기 <small>(마지막 백업 ${gap === 0 ? '오늘' : `${gap}일 전`})</small></a>`;
  return `<a class="backup-link warn" href="#backup">💾 ${last ? `백업한 지 ${gap}일 됐어요` : '아직 백업을 안 했어요'} · 지금 백업하기</a>`;
}

function backupFile() {
  const data = { app: BACKUP_APP, version: 1, exportedAt: new Date().toISOString(), plants, entries };
  const name = `식물아-백업-${todayStr()}.json`;
  return new File([JSON.stringify(data)], name, { type: 'application/json' });
}

function markBackedUp() {
  meta.lastBackup = todayStr();
  saveMeta();
  checkBadges();
}

function viewBackup() {
  const photoCount = entries.reduce((n, e) => n + e.photos.length, 0);
  const canShare = !!(navigator.canShare && navigator.share);
  $app.innerHTML = `
    ${topbar('💾 백업 · 불러오기')}

    <section class="care-card" style="margin-top:0">
      <h3>📦 백업 파일로 저장</h3>
      <p class="muted">식물 ${plants.length}개 · 기록 ${entries.length}개 · 사진 ${photoCount}장을 파일 하나로 저장해요.
        휴대폰을 바꾸거나 브라우저 기록을 지워도 이 파일만 있으면 되살릴 수 있어요.</p>
      <p class="muted" style="margin-top:6px">마지막 백업: <b>${meta.lastBackup ? prettyDate(meta.lastBackup) : '아직 없어요'}</b></p>
      <div class="btn-col">
        <button class="btn primary block" id="export" ${entries.length || plants.length ? '' : 'disabled'}>📥 백업 파일 내려받기</button>
        ${canShare ? `<button class="btn soft block" id="share" ${entries.length || plants.length ? '' : 'disabled'}>📤 파일 앱·드라이브에 저장</button>` : ''}
      </div>
      <p class="hint">💡 내려받은 파일은 휴대폰 '파일' 앱이나 '다운로드' 폴더에 있어요. 구글 드라이브나 카카오톡 '나와의 채팅'에 올려 두면 더 안전해요.</p>
    </section>

    <section class="care-card">
      <h3>📂 백업 파일 불러오기</h3>
      <p class="muted">전에 저장한 <b>식물아-백업-○○.json</b> 파일을 골라 주세요.</p>
      <label class="btn soft block file-btn">📂 백업 파일 고르기
        <input type="file" id="import" accept=".json,application/json" hidden>
      </label>
      <div id="import-result"></div>
    </section>
  `;
  bindBack();

  const exp = document.getElementById('export');
  exp.onclick = () => {
    const file = backupFile();
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    markBackedUp();
    toast('백업 파일을 저장했어요 💾');
    setTimeout(viewBackup, 300);
  };

  const share = document.getElementById('share');
  if (share) share.onclick = async () => {
    const file = backupFile();
    if (!navigator.canShare({ files: [file] })) return toast('이 휴대폰에서는 이 방법을 쓸 수 없어요. 내려받기를 써 주세요');
    try {
      await navigator.share({ files: [file], title: file.name });
      markBackedUp();
      toast('백업 파일을 보냈어요 💾');
      viewBackup();
    } catch (e) {
      if (e.name !== 'AbortError') toast('저장하지 못했어요. 내려받기를 써 주세요');
    }
  };

  document.getElementById('import').onchange = async (e) => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    let data;
    try { data = checkBackup(JSON.parse(await f.text())); } catch (err) {
      document.getElementById('import-result').innerHTML = `<p class="import-bad">😢 ${esc(err.message || '읽을 수 없는 파일이에요')}</p>`;
      return;
    }
    const newPlants = data.plants.filter((p) => !plantById(p.id)).length;
    const haveIds = new Set(entries.map((x) => x.id));
    const newEntries = data.entries.filter((x) => !haveIds.has(x.id)).length;
    const when = data.exportedAt ? prettyDate(dateStr(new Date(data.exportedAt))) : '날짜 모름';
    const box = document.getElementById('import-result');
    box.innerHTML = `
      <div class="import-ok">
        <p>✅ <b>${when}</b>에 만든 백업이에요.<br>식물 ${data.plants.length}개 · 기록 ${data.entries.length}개가 들어 있어요.</p>
        <div class="btn-col">
          <button class="btn primary block" id="merge">➕ 합치기 (추천) <small>· 새 식물 ${newPlants} · 새 기록 ${newEntries}</small></button>
          <button class="btn danger block" id="replace">🔄 덮어쓰기 (지금 기록을 모두 바꿈)</button>
        </div>
      </div>`;
    document.getElementById('merge').onclick = () => {
      const before = { plants: [...plants], entries: [...entries] };
      plants = [...plants, ...data.plants.filter((p) => !plantById(p.id))];
      entries = [...entries, ...data.entries.filter((x) => !haveIds.has(x.id))];
      if (!save()) { plants = before.plants; entries = before.entries; return; }
      toast(`합쳤어요! 식물 ${newPlants}개 · 기록 ${newEntries}개를 더했어요 🌿`);
      checkBadges();
      go('#home');
    };
    document.getElementById('replace').onclick = async () => {
      const ok = await openModal({
        title: '정말 바꿀까요? 🥲',
        text: `지금 있는 식물 ${plants.length}개 · 기록 ${entries.length}개가 모두 지워지고\n백업 파일 내용으로 바뀌어요. 되돌릴 수 없어요.`,
        ok: '덮어쓰기', danger: true
      });
      if (!ok) return;
      const before = { plants, entries };
      plants = data.plants;
      entries = data.entries;
      if (!save()) { plants = before.plants; entries = before.entries; return; }
      toast('백업으로 바꿨어요 🌿');
      checkBadges();
      go('#home');
    };
  };
}

// 백업 파일 검사: 우리 앱 파일인지, 모양이 맞는지 하나하나 확인한다
function checkBackup(d) {
  const bad = (m) => { throw new Error(m); };
  if (!d || typeof d !== 'object' || d.app !== BACKUP_APP) bad('이 앱의 백업 파일이 아니에요');
  if (!Array.isArray(d.plants) || !Array.isArray(d.entries)) bad('백업 파일 모양이 이상해요');
  const okId = (v) => typeof v === 'string' && /^[a-z0-9]{1,40}$/i.test(v);
  const okDate = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
  const okPhoto = (v) => typeof v === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(v);
  const typeIds = new Set(PLANT_INFO.map((i) => i.id));
  const ps = d.plants.map((p) => {
    if (!p || !okId(p.id) || typeof p.name !== 'string' || !p.name.trim()) bad('식물 정보가 이상해요');
    const out = { id: p.id, name: p.name.slice(0, 30), createdAt: okDate(p.createdAt) ? p.createdAt : todayStr() };
    if (p.type === 'none' || typeIds.has(p.type)) out.type = p.type;
    return out;
  });
  const pids = new Set(ps.map((p) => p.id));
  const tagIds = new Set(TAGS.map((t) => t.id));
  const es = d.entries.map((x) => {
    if (!x || !okId(x.id) || !pids.has(x.plantId) || !okDate(x.date)) bad('기록 정보가 이상해요');
    const photos = Array.isArray(x.photos) ? x.photos : [];
    if (!photos.every(okPhoto)) bad('사진 정보가 이상해요');
    return {
      id: x.id, plantId: x.plantId, date: x.date,
      createdAt: Number.isFinite(x.createdAt) ? x.createdAt : Date.now(),
      memo: typeof x.memo === 'string' ? x.memo.slice(0, 5000) : '',
      tags: Array.isArray(x.tags) ? x.tags.filter((t) => tagIds.has(t)) : [],
      photos
    };
  });
  return { plants: ps, entries: es, exportedAt: typeof d.exportedAt === 'string' ? d.exportedAt : null };
}

/* ---------- 시작 ---------- */
route();
setTimeout(checkBadges, 600); // 처음 열었을 때 이미 받은 배지가 있으면 알려 준다

/* ---------- 서비스 워커 (홈 화면 앱) ----------
 * 새 버전이 적용되면 화면을 한 번 자동으로 새로고침한다.
 * 앱을 다시 열 때마다 새 버전이 있는지 확인한다.
 */
if ('serviceWorker' in navigator) {
  const hadController = !!navigator.serviceWorker.controller;
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloaded) return; // 처음 설치할 때는 새로고침하지 않는다
    reloaded = true;
    location.reload();
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((reg) => {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') reg.update().catch(() => {});
      });
    }).catch(() => {});
  });
}
